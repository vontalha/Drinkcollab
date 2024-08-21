import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ShoppingCart } from '@prisma/client';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ShoppingCartItem } from '@prisma/client';
import { AddCartItemDto } from './dto/add-cart-item.dto';
@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) {}

    getCartByUserId = async (userId: string): Promise<ShoppingCart> => {
        const cart = await this.prisma.shoppingCart.findFirst({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                price: true,
                                description: true,
                            },
                        },
                    },
                },
            },
        });

        if (!cart) {
            return this.createCart(userId);
        }

        return cart;
    };

    getCartbyCartId = async (cartId: string): Promise<ShoppingCart> => {
        const cart = await this.prisma.shoppingCart.findUnique({
            where: { id: cartId },
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        return cart;
    };

    createCart = async (userId: string): Promise<ShoppingCart> => {
        return this.prisma.shoppingCart.create({
            data: {
                userId,
            },
            include: { items: { include: { product: true } } },
        });
    };

    addCartItem = async (
        addCartItemDto: AddCartItemDto,
        userId: string,
    ): Promise<ShoppingCart> => {
        const { productId, quantity } = addCartItemDto;
        const cart = await this.getCartByUserId(userId);

        const existingItem = await this.prisma.shoppingCartItem.findFirst({
            where: { shoppingCartId: cart.id, productId },
        });

        if (existingItem) {
            await this.prisma.shoppingCartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
            });
        } else {
            await this.prisma.shoppingCartItem.create({
                data: {
                    shoppingCartId: cart.id,
                    productId,
                    quantity,
                },
            });
        }

        return this.getCartByUserId(userId);
    };

    removeItem = async (
        userId: string,
        productId: string,
    ): Promise<ShoppingCart> => {
        const cart = await this.getCartByUserId(userId);

        const existingItem = await this.prisma.shoppingCartItem.findFirst({
            where: { shoppingCartId: cart.id, productId },
        });

        if (!existingItem) {
            throw new NotFoundException('Item not found in cart');
        }

        await this.prisma.shoppingCartItem.delete({
            where: { id: existingItem.id },
        });

        return this.getCartByUserId(userId);
    };

    updateItemQuantity = async (
        updateCartItemDto: UpdateCartItemDto,
        userId: string,
    ): Promise<ShoppingCart> => {
        const { productId, quantity, action } = updateCartItemDto;

        const cart = await this.getCartByUserId(userId);

        const existingItem = await this.prisma.shoppingCartItem.findFirst({
            where: { shoppingCartId: cart.id, productId },
        });

        if (!existingItem) {
            throw new NotFoundException('Item not found in cart');
        }

        if (existingItem.quantity === 1 && action === 'decrement') {
            return this.removeItem(cart.userId, productId);
        }

        if (action === 'increment') {
            existingItem.quantity += quantity;
        } else if (action === 'decrement') {
            existingItem.quantity -= quantity;
        }

        await this.prisma.shoppingCartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity },
        });

        return this.getCartByUserId(userId);
    };

    getCartItem = async (
        userId: string,
        productId: string,
    ): Promise<ShoppingCartItem | null> => {
        const cart = await this.getCartByUserId(userId);

        const cartItem = await this.prisma.shoppingCartItem.findFirst({
            where: {
                shoppingCartId: cart.id,
                productId: productId,
            },
            include: {
                product: true,
            },
        });

        return cartItem;
    };
}
