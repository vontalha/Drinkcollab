import { Injectable } from '@nestjs/common';
import { InvoiceStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';
import { OrderStatus } from '@prisma/client';
@Injectable()
export class InvoiceService {
    constructor() {}

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
}
