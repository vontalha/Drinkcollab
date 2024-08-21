import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { CartItemDto, CartWithItemsDto } from './dto/cart.dto';
import { Decimal } from '@prisma/client/runtime/library';
@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) {}

    getCartByUserId = async (userId: string): Promise<CartWithItemsDto> => {
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
                                stock: true,
                                description: true,
                            },
                        },
                    },
                },
            },
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        return cart;
    };

    getCartbyCartId = async (cartId: string): Promise<CartWithItemsDto> => {
        const cart = await this.prisma.shoppingCart.findUnique({
            where: { id: cartId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                price: true,
                                stock: true,
                                description: true,
                            },
                        },
                    },
                },
            },
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        return cart;
    };

    createCart = async (userId: string): Promise<CartWithItemsDto> => {
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
    ): Promise<CartWithItemsDto> => {
        const { productId, quantity } = addCartItemDto;

        const existingProduct = await this.prisma.product.findUnique({
            where: { id: productId },
        });

        if (!existingProduct) {
            throw new NotFoundException('Product not found');
        }

        if (existingProduct.stock < quantity) {
            throw new NotFoundException(
                `Not enough in stock of ${existingProduct.name}`,
            );
        }

        const cart = await this.getCartByUserId(userId);

        const existingCartItem = await this.prisma.shoppingCartItem.findFirst({
            where: { shoppingCartId: cart.id, productId },
        });

        if (existingCartItem) {
            await this.prisma.shoppingCartItem.update({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + quantity },
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

        return this.updateCartTotal(cart.id);
    };

    removeItem = async (
        userId: string,
        productId: string,
    ): Promise<CartWithItemsDto> => {
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

        return this.updateCartTotal(cart.id);
    };

    updateItemQuantity = async (
        updateCartItemDto: UpdateCartItemDto,
        userId: string,
    ): Promise<CartWithItemsDto> => {
        const { productId, quantity, action } = updateCartItemDto;

        const existingProduct = await this.prisma.product.findUnique({
            where: { id: productId },
        });

        if (!existingProduct) {
            throw new NotFoundException('Product not found');
        }

        if (existingProduct.stock < quantity) {
            throw new NotFoundException(
                `Not enough in stock of ${existingProduct.name}`,
            );
        }

        const cart = await this.getCartByUserId(userId);

        const existingCartItem = await this.prisma.shoppingCartItem.findFirst({
            where: { shoppingCartId: cart.id, productId },
        });

        if (!existingCartItem) {
            throw new NotFoundException('Item not found in cart');
        }

        if (existingCartItem.quantity === 1 && action === 'decrement') {
            return this.removeItem(cart.userId, productId);
        }

        if (action === 'increment') {
            existingCartItem.quantity += quantity;
        } else if (action === 'decrement') {
            existingCartItem.quantity -= quantity;
        }

        await this.prisma.shoppingCartItem.update({
            where: { id: existingCartItem.id },
            data: { quantity: existingCartItem.quantity },
        });

        return this.updateCartTotal(cart.id);
    };

    getCartItem = async (
        userId: string,
        productId: string,
    ): Promise<CartItemDto> => {
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

        if (!cartItem) {
            throw new NotFoundException('Item not found in cart');
        }

        return cartItem;
    };

    updateCartTotal = async (cartId: string): Promise<CartWithItemsDto> => {
        const updatedCartItems = await this.prisma.shoppingCartItem.findMany({
            where: { shoppingCartId: cartId },
            include: {
                product: {
                    select: {
                        price: true,
                    },
                },
            },
        });

        const newTotal = updatedCartItems.reduce((acc: Decimal, item) => {
            return acc.add(
                new Decimal(item.product.price).mul(new Decimal(item.quantity)),
            );
        }, new Decimal(0));

        await this.prisma.shoppingCart.update({
            where: { id: cartId },
            data: {
                total: newTotal,
            },
        });

        return this.getCartbyCartId(cartId);
    };
}
