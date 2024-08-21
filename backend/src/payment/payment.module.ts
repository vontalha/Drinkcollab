import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaypalService } from './paypal/paypal.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    providers: [PaymentService, PaypalService],
    controllers: [PaymentController],
})
export class PaymentModule {}
