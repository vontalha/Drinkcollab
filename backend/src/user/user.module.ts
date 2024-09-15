import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { InvoiceService } from 'src/payment/invoice/invoice.service';
import { PaymentService } from 'src/payment/payment.service';
import { OrderService } from 'src/order/order.service';
import { CartService } from 'src/cart/cart.service';
import { PaypalService } from 'src/payment/paypal/paypal.service';
import { ProductsService } from 'src/product/products.service';
import { FilterService } from 'src/product/filter.service';
import { HttpModule } from '@nestjs/axios';
@Module({
    imports: [HttpModule],
    providers: [
        UserService,
        InvoiceService,
        PaymentService,
        OrderService,
        CartService,
        PaypalService,
        ProductsService,
        FilterService,
    ],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {}
