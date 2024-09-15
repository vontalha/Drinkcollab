import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { InvoiceService } from 'src/payment/invoice/invoice.service';
import { PaymentService } from 'src/payment/payment.service';
import { OrderService } from 'src/order/order.service';

@Module({
    providers: [UserService, InvoiceService, PaymentService, OrderService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {}
