import { Injectable } from '@nestjs/common';
import { InvoiceStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';
@Injectable()
export class InvoiceService {
    constructor() {}

    createInvoice = async (
        userId: string,
        totalAmount: Decimal,
        prisma: Prisma.TransactionClient,
    ): Promise<string> => {
        const invoice = await prisma.invoice.create({
            data: {
                userId,
                totalAmount,
                dueDate: new Date(
                    new Date().setMonth(new Date().getMonth() + 1),
                ),
                status: InvoiceStatus.PENDING,
                paid: false,
            },
        });
        return invoice.id;
    };

    handleInvoice = async (
        userId: string,
        total: Decimal,
        prisma: Prisma.TransactionClient,
    ): Promise<string> => {
        const existingInvoice = await prisma.invoice.findFirst({
            where: {
                userId: userId,
                status: InvoiceStatus.PENDING,
            },
        });

        if (!existingInvoice) {
            return await this.createInvoice(userId, total, prisma);
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
    };
}
