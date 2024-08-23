import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaypalService } from 'src/payment/paypal/paypal.service';
import { CartService } from 'src/cart/cart.service';
import { HttpModule } from '@nestjs/axios';
@Module({
    imports: [HttpModule],
    providers: [OrderService, PrismaService, PaypalService, CartService],
    controllers: [OrderController],
})
export class OrderModule {}
