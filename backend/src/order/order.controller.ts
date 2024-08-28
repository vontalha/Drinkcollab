import { Controller, Body, Post, UseGuards, Param } from '@nestjs/common';
import { CartService } from 'src/cart/cart.service';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaypalService } from 'src/payment/paypal/paypal.service';
@Controller('order')
export class OrderController {
    constructor(
        private readonly cartService: CartService,
        private readonly orderService: OrderService,
        private readonly paypalService: PaypalService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('create')
    async createOrder(
        @Body() createOrderDto: CreateOrderDto,
    ): Promise<{ orderId: string; paypalOrderId?: string }> {
        return this.orderService.processCartOrder(createOrderDto);
    }

    @Post(':paypalOrderId/capture')
    async captureOrder(
        @Param('paypalOrderId') paypalOrderId: string,
    ): Promise<{ message: string }> {
        await this.paypalService.captureOrder(paypalOrderId);
        return {
            message: 'Payment captured successfully',
        };
    }
}
