import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InvoiceService } from '../invoice/invoice.service';
import { DueInvoiceDto } from '../invoice/dto/due-invoices.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { MailService } from '../../mail/mail.service';
import { SendEmailDto } from '../../mail/dto/mail.dto';
@Injectable()
export class CronService {
    constructor(
        private readonly invoiceService: InvoiceService,
        private readonly mailService: MailService,
    ) {}

    @Cron(CronExpression.EVERY_10_SECONDS)
    async checkInvoiceDueDates() {
        const dueInvoices = await this.invoiceService.getDueInvoices();
        if (dueInvoices.length > 0) {
            for (const invoice of dueInvoices) {
                await this.sendInvoiceMail(invoice);
            }
        }
    }

    sendInvoiceMail = async (dueInvoice: DueInvoiceDto) => {
        const invoiceTokenId = await this.invoiceService.createInvoiceToken(
            dueInvoice.id,
            dueInvoice.user.email,
        );

        if (!invoiceTokenId) {
            throw new InternalServerErrorException(
                'Failed to create invoice token',
            );
        }

        const inviteLink = `Http://localhost:4200/payment/invoice/approved?token=${invoiceTokenId}`;

        const formatDate = (date: Date) => {
            return date.toLocaleDateString('de-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        };

        const formatCurrency = (amount: number) => {
            return new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'EUR',
            }).format(amount);
        };

        let orderDetails: string;
        dueInvoice.orders.forEach((order, index) => {
            orderDetails += `
                <h3>Order ${index + 1} (${formatDate(order.createdAt)})</h3>
                <ul>
                ${order.orderItems
                    .map(
                        (item) => `
                    <li>${item.product.name} - Quantity: ${item.quantity}, Price: ${formatCurrency(Number(item.price))}</li>
                `,
                    )
                    .join('')}
                </ul>
            `;
        });

        const emailContent = `
            <h1>Your Invoice is due!</h1>
            <p>Total Amount to Pay: ${formatCurrency(Number(dueInvoice.totalAmount))}</p>
            <p>Due Date: ${formatDate(dueInvoice.dueDate)}</p>
            <h2>Order Details:</h2>
            ${orderDetails}
            <p>Click <a href="${inviteLink}">here</a> to pay your invoice</p>
        `;

        const mailOptions: SendEmailDto = {
            from: process.env.MAIL_FROM,
            to: dueInvoice.user.email,
            subject: 'Your Invoice is due!',
            html: emailContent,
        };

        try {
            await this.mailService.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending email:', error);
            throw new InternalServerErrorException(
                'Failed to send invoice email',
            );
        }
    };
}
