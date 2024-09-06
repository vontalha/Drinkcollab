import { Injectable } from '@nestjs/common';
import { InvoiceStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { DueInvoiceDto } from './dto/due-invoices.dto';
import { v4 as uuidv4 } from 'uuid';
import { Invoice } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
@Injectable()
export class InvoiceService {
    constructor(private readonly prismaService: PrismaService) {}

    createInvoice = async (
        userId: string,
        prisma: Prisma.TransactionClient,
    ): Promise<string> => {
        const invoice = await prisma.invoice.create({
            data: {
                userId,
                //testweise auf 1 min
                dueDate: new Date(
                    //new Date().setMonth(new Date().getMonth() + 1),
                    new Date().setMinutes(new Date().getMinutes() + 1),
                ),
                status: InvoiceStatus.PENDING,
            },
        });
        return invoice.id;
    };

    getInvoiceById = async (invoiceId: string): Promise<Invoice> => {
        const invoice = await this.prismaService.invoice.findUnique({
            where: { id: invoiceId },
        });

        if (!invoice) {
            throw new NotFoundException('Invoice not found');
        }
        return invoice;
    };

    getInvoiceByToken = async (token: string): Promise<DueInvoiceDto> => {
        const invoiceToken = await this.prismaService.invoiceToken.findUnique({
            where: { token },
        });

        if (!invoiceToken) {
            throw new NotFoundException('Invoice not found');
        }

        return await this.getDueInvoice(invoiceToken.invoiceId);
    };

    getDueInvoice = async (invoiceId: string): Promise<DueInvoiceDto> => {
        const invoice = await this.prismaService.invoice.findUnique({
            where: { id: invoiceId },
        });

        if (!invoice) {
            throw new NotFoundException('Invoice not found');
        }

        return await this.prismaService.invoice.findUnique({
            where: {
                id: invoiceId,
            },
            select: {
                id: true,
                dueDate: true,
                createdAt: true,
                totalAmount: true,
                orders: {
                    select: {
                        createdAt: true,
                        id: true,
                        orderItems: {
                            select: {
                                quantity: true,
                                price: true,
                                product: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
    };

    handleInvoice = async (
        userId: string,
        prisma: Prisma.TransactionClient,
    ): Promise<string> => {
        const existingInvoice = await prisma.invoice.findFirst({
            where: {
                userId: userId,
                status: InvoiceStatus.PENDING,
            },
        });

        if (!existingInvoice) {
            return await this.createInvoice(userId, prisma);
        } else return existingInvoice.id;
    };

    addOrderToInvoice = async (
        invoiceId: string,
        orderId: string,
        total: Decimal,
        prisma: Prisma.TransactionClient,
    ): Promise<void> => {
        await prisma.invoice.update({
            where: { id: invoiceId },
            data: {
                totalAmount: { increment: total },
                orders: {
                    connect: { id: orderId },
                },
            },
        });
        const order = await prisma.order.update({
            where: { id: orderId },
            data: {
                invoiceId: invoiceId,
                status: OrderStatus.COMPLETED,
            },
        });

        await prisma.shoppingCart.update({
            where: { id: order.userId },
            data: {
                items: {
                    deleteMany: {},
                },
                total: 0,
            },
        });
    };

    updateInvoice = async (invoiceId: string, data: UpdateInvoiceDto) => {
        return await this.prismaService.invoice.update({
            where: { id: invoiceId },
            data: data,
        });
    };

    getDueInvoices = async (): Promise<DueInvoiceDto[]> => {
        return await this.prismaService.invoice.findMany({
            where: {
                dueDate: {
                    lte: new Date(),
                },
                status: InvoiceStatus.PENDING,
                mailSent: false,
            },
            select: {
                id: true,
                dueDate: true,
                createdAt: true,
                totalAmount: true,
                orders: {
                    select: {
                        id: true,
                        createdAt: true,
                        orderItems: {
                            select: {
                                quantity: true,
                                price: true,
                                product: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
    };

    getReminderInvoices = async (
        reminderSent: boolean,
    ): Promise<DueInvoiceDto[]> => {
        return await this.prismaService.invoice.findMany({
            where: {
                reminderDate: {
                    lte: new Date(),
                },
                status: InvoiceStatus.PENDING,
                reminderSent,
            },
            select: {
                id: true,
                dueDate: true,
                createdAt: true,
                totalAmount: true,
                orders: {
                    select: {
                        id: true,
                        createdAt: true,
                        orderItems: {
                            select: {
                                quantity: true,
                                price: true,
                                product: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        suspended: true,
                    },
                },
            },
        });
    };

    createInvoiceToken = async (
        invoiceId: string,
        email: string,
    ): Promise<string> => {
        const token = uuidv4();
        const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); //eine WOche
        const invoiceToken = await this.prismaService.invoiceToken.create({
            data: {
                email,
                token,
                expires: expirationDate,
                invoice: {
                    connect: { id: invoiceId },
                },
            },
        });
        return invoiceToken.token;
    };
}
