import { CartService } from './../cart/cart.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PaymentMethod } from '@prisma/client';
import { CartItemDto } from 'src/cart/dto/cart.dto';
import { PaypalService } from 'src/payment/paypal/paypal.service';

import { CreateOrderDto } from './dto/create-order.dto';
@Injectable()
export class OrderService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly cartService: CartService,
        private readonly paypalService: PaypalService,
    ) {}

    processCartOrder = async (
        createOrderDto: CreateOrderDto,
    ): Promise<{
        orderId: string;
        paypalOrderId?: string;
        invoiceId?: string;
    }> => {
        return await this.prismaService.$transaction(async (prisma) => {
            const { cartId, userId, paymentMethod } = createOrderDto;
            console.log('processCartorder:', cartId, userId, paymentMethod);
            const cart = await this.cartService.getCartbyCartId(cartId);

            if (!cart || cart.items.length === 0) {
                throw new NotFoundException(
                    'Shopping cart is empty or not found.',
                );
            }

            const order = await prisma.order.create({
                data: {
                    userId: userId,
                    total: cart.total,
                    quantity: cart.items.reduce(
                        (sum: number, item: CartItemDto) => sum + item.quantity,
                        0,
                    ),
                    status: OrderStatus.PENDING,
                    orderItems: {
                        create: cart.items.map((item: CartItemDto) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.product.price,
                        })),
                    },
                },
            });

            const paypalOrderId =
                paymentMethod === PaymentMethod.PAYPAL
                    ? await this.paypalService.handlePayPalOrder(
                          prisma,
                          userId,
                          order,
                          cart,
                      )
                    : null;

            return {
                orderId: order.id,
                paypalOrderId,
            };
        });
    };
}
