import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CronService } from '../cron/cron.service';
import { MailService } from '../../mail/mail.service';

@Module({
    providers: [InvoiceService, CronService, MailService],
})
export class InvoiceModule {}
