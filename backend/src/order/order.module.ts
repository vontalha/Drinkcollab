import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaypalService } from 'src/payment/paypal/paypal.service';
@Module({
    providers: [OrderService, PrismaService, PaypalService],
    controllers: [OrderController],
})
export class OrderModule {}
