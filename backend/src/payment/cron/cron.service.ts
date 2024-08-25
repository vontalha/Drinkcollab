import { PrismaService } from './../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InvoiceService } from '../invoice/invoice.service';
@Injectable()
export class CronService {
    constructor(
        private readonly invoiceService: InvoiceService,
        private readonly prismaService: PrismaService,
    ) {}

    @Cron(CronExpression.EVERY_10_SECONDS)
    async checkInvoiceDueDates() {
        const dueInvoices = await this.invoiceService.getDueInvoices();
        if (dueInvoices.length > 0) {
            for (const invoice of dueInvoices) {
                console.log(invoice);
            }
        }
    }
}
