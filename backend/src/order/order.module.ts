import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    providers: [OrderService, PrismaService],
    controllers: [OrderController],
})
export class OrderModule {}
