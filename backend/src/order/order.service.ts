import { CartService } from './../cart/cart.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PaymentMethod } from '@prisma/client';
import { CartItemDto, CartWithItemsDto } from 'src/cart/dto/cart.dto';
import { PaypalService } from 'src/payment/paypal/paypal.service';
import { BadRequestException } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { Order } from '@prisma/client';
@Injectable()
export class OrderService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly cartService: CartService,
        private readonly paypalService: PaypalService,
    ) {}

    processCartOrder = async (
        cartId: string,
        userId: string,
        paymentMethod: PaymentMethod,
    ): Promise<{ orderId: string; paypalOrderId?: string }> => {
        return await this.prismaService.$transaction(async (prisma) => {
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

            // let paypalOrderId: string | null = null;
            // if (paymentMethod === PaymentMethod.PAYPAL) {
            //     const paypalOrder = await this.paypalService.createOrder(cart);

            //     if (paypalOrder.status === 'CANCELLED') {
            //         await prisma.order.update({
            //             where: { id: order.id },
            //             data: { status: OrderStatus.CANCELLED },
            //         });
            //         throw new BadRequestException('Payment failed');
            //     } else {
            //         const payment = await prisma.payment.create({
            //             data: {
            //                 userId: userId,
            //                 orderId: order.id,
            //                 amount: order.total,
            //                 method: PaymentMethod.PAYPAL,
            //                 status: PaymentStatus.PENDING,
            //                 paypalOrderId: paypalOrder.paypalOrderId,
            //             },
            //         });

            //         await prisma.order.update({
            //             where: { id: order.id },
            //             data: { paymentId: payment.id },
            //         });

            //         paypalOrderId = paypalOrder.paypalOrderId;
            //     }
            // }
            const paypalOrderId =
                paymentMethod === PaymentMethod.PAYPAL
                    ? await this.handlePayPalOrder(prisma, userId, order, cart)
                    : null;

            return {
                orderId: order.id,
                paypalOrderId,
            };
        });
    };

    private async handlePayPalOrder(
        prisma: Prisma.TransactionClient,
        userId: string,
        order: Order,
        cart: CartWithItemsDto,
    ): Promise<string> {
        const paypalOrder = await this.paypalService.createOrder(cart);

        if (paypalOrder.status === 'CANCELLED') {
            await prisma.order.update({
                where: { id: order.id },
                data: { status: OrderStatus.CANCELLED },
            });
            throw new BadRequestException('Paypal order cancelled');
        }

        const payment = await prisma.payment.create({
            data: {
                userId: userId,
                orderId: order.id,
                amount: order.total,
                method: PaymentMethod.PAYPAL,
                status: PaymentStatus.PENDING,
                paypalOrderId: paypalOrder.paypalOrderId,
            },
        });

        await prisma.order.update({
            where: { id: order.id },
            data: { paymentId: payment.id },
        });

        return paypalOrder.paypalOrderId;
    }
}
