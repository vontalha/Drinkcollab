import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InvoiceService } from '../invoice/invoice.service';
import { DueInvoiceDto } from '../invoice/dto/due-invoices.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { MailService } from '../../mail/mail.service';
import { SendEmailDto } from '../../mail/dto/mail.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { formatDate, formatCurrency } from '../../common/utils';

@Injectable()
export class CronService {
    constructor(
        private readonly invoiceService: InvoiceService,
        private readonly mailService: MailService,
        private readonly prismaService: PrismaService,
    ) {}

    @Cron(CronExpression.EVERY_10_MINUTES)
    async checkInvoiceDueDates() {
        const dueInvoices = await this.invoiceService.getDueInvoices();
        if (dueInvoices.length > 0) {
            for (const invoice of dueInvoices) {
                console.log(invoice);
                await this.sendInvoiceMail(invoice);
            }
        } else {
            console.log('No invoices due');
        }
    }

    @Cron(CronExpression.EVERY_10_MINUTES)
    async checkInvoiceReminders() {
        const reminderInvoices =
            await this.invoiceService.getReminderInvoices(false);
        const secondReminderInvoices =
            await this.invoiceService.getReminderInvoices(true);
        if (reminderInvoices.length > 0) {
            for (const invoice of reminderInvoices) {
                console.log(invoice);
                await this.sendReminderMail(invoice, false);
            }
        }
        if (secondReminderInvoices.length > 0) {
            for (const invoice of secondReminderInvoices) {
                console.log(invoice);
                await this.sendReminderMail(invoice, true);
            }
        }
    }
    //this shoukd be checked more infrequent since it doesnt happen that commonly
    @Cron(CronExpression.EVERY_DAY_AT_10AM)
    async checkOverdrawnInvoices() {
        const overdrawnInvoices =
            await this.invoiceService.getReminderInvoices(true);
        if (overdrawnInvoices.length > 0) {
            for (const invoice of overdrawnInvoices) {
                const suspensionDate = new Date(invoice.reminderDate);
                suspensionDate.setDate(suspensionDate.getDate() + 7);

                if (suspensionDate >= suspensionDate) {
                    await this.prismaService.user.update({
                        where: { id: invoice.user.id },
                        data: { suspended: true },
                    });
                    console.log('User suspended:', invoice.user.email);
                }
            }
        }
    }

    sendInvoiceMail = async (dueInvoice: DueInvoiceDto) => {
        const invoiceToken = await this.invoiceService.createInvoiceToken(
            dueInvoice.id,
            dueInvoice.user.email,
        );

        if (!invoiceToken) {
            throw new InternalServerErrorException(
                'Failed to create invoice token',
            );
        }

        const reminderDate = new Date();
        reminderDate.setDate(reminderDate.getDate() + 7);

        const updatedInvoice = await this.invoiceService.updateInvoice(
            dueInvoice.id,
            {
                reminderDate: reminderDate,
            },
        );

        const paymentLink = `Http://localhost:4200/payment/invoice?token=${invoiceToken}`;

        let orderDetails = '';
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
            <p>Please pay your invoice before ${formatDate(updatedInvoice.reminderDate)}</p>
            <h2>Order Details:</h2>
            ${orderDetails}
            <p>Click <a href="${paymentLink}">here</a> to pay your invoice</p>
        `;

        const mailOptions: SendEmailDto = {
            from: process.env.MAIL_FROM,
            to: dueInvoice.user.email,
            subject: 'Your Invoice is due!',
            html: emailContent,
        };

        try {
            await this.mailService.sendMail(mailOptions);
            console.log('Email sent to ', dueInvoice.user.email);
            await this.prismaService.invoice.update({
                where: { id: dueInvoice.id },
                data: { mailSent: true },
            });
        } catch (error) {
            console.error('Error sending email:', error);
            throw new InternalServerErrorException(
                'Failed to send invoice email',
            );
        }
    };

    sendReminderMail = async (
        reminderInvoice: DueInvoiceDto,
        reminderSent: boolean,
    ) => {
        const invoiceToken = await this.prismaService.invoiceToken.findUnique({
            where: { invoiceId: reminderInvoice.id },
        });

        if (!invoiceToken) {
            throw new InternalServerErrorException(
                'Failed to find invoice token',
            );
        }

        const paymentLink = `Http://localhost:4200/payment/invoice?token=${invoiceToken}`;

        let orderDetails = '';
        reminderInvoice.orders.forEach((order, index) => {
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

        const suspensionDate = new Date();
        suspensionDate.setDate(reminderInvoice.reminderDate.getDate() + 7);

        const emailContent = reminderSent
            ? `
            <h1>Final Reminder: Your Invoice is Overdue!</h1>
            <p>Total Amount to Pay: ${formatCurrency(Number(reminderInvoice.totalAmount))}</p>
            <p>Due Date: ${formatDate(reminderInvoice.reminderDate)}</p>
            <p><strong>Warning: Your account will be suspended if payment is not received by ${formatDate(suspensionDate)}.</strong></p>
            <h2>Order Details:</h2>
            ${orderDetails}
            <p>Click <a href="${paymentLink}">here</a> to pay your invoice immediately</p>
        `
            : `
            <h1>This is a reminder for your invoice!</h1>
            <p>Total Amount to Pay: ${formatCurrency(Number(reminderInvoice.totalAmount))}</p>
            <p>Due Date: ${formatDate(reminderInvoice.reminderDate)}</p>
            <h2>Order Details:</h2>
            ${orderDetails}
            <p>Click <a href="${paymentLink}">here</a> to pay your invoice</p>
        `;

        const mailOptions: SendEmailDto = {
            from: process.env.MAIL_FROM,
            to: reminderInvoice.user.email,
            subject: 'Invoice Reminder!',
            html: emailContent,
        };

        try {
            await this.mailService.sendMail(mailOptions);
            console.log('Email sent to ', reminderInvoice.user.email);
            await this.prismaService.invoice.update({
                where: { id: reminderInvoice.id },
                data: { reminderSent: true },
            });
        } catch (error) {
            console.error('Error sending email:', error);
            throw new InternalServerErrorException(
                'Failed to send reminder email',
            );
        }
    };
}
