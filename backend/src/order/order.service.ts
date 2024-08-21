import { CartService } from './../cart/cart.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Order } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class OrderService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly cartService: CartService,
    ) {}

    processCartOrder = async (
        cartId: string,
        userId: string,
    ): Promise<Order> => {
        const order = this.prismaService.$transaction(async (prisma) => {
            const cart = await this.cartService.getCartbyCartId(cartId);

            if (!cart || cart.items.length === 0) {
                throw new NotFoundException(
                    'Shopping cart is empty or not found.',
                );
            }

            const total = cart.items.reduce((acc, item) => {
                return acc + item.product.price * item.quantity;
            }, 0);
        });

        return order;
    };
}
