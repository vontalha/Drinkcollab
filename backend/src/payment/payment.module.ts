import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaypalService } from './paypal/paypal.service';
import { HttpModule } from '@nestjs/axios';
import { InvoiceModule } from './invoice/invoice.module';

@Module({
    imports: [HttpModule, InvoiceModule],
    providers: [PaymentService, PaypalService],
    controllers: [PaymentController],
})
export class PaymentModule {}
