import { Injectable } from '@nestjs/common';
import { InvoiceStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { DueInvoiceDto } from './dto/due-invoices.dto';
import { v4 as uuidv4 } from 'uuid';
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
        await prisma.order.update({
            where: { id: orderId },
            data: {
                invoiceId: invoiceId,
                status: OrderStatus.COMPLETED,
            },
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
        return invoiceToken.id;
    };
}
