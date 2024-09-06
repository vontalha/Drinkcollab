import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { MailService } from '../../mail/mail.service';
import { InvoiceService } from '../invoice/invoice.service';

@Module({
    providers: [CronService, MailService, InvoiceService],
})
export class CronModule {}
