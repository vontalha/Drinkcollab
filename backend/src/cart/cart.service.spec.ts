import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

describe('CartService', () => {
    let service: CartService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CartService,
                {
                    provide: PrismaService,
                    useValue: {
                        shoppingCart: {
                            findFirst: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn(),
                            update: jest.fn(),
                        },
                        shoppingCartItem: {
                            findFirst: jest.fn(),
                            create: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                            findMany: jest.fn(),
                        },
                        product: {
                            findUnique: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<CartService>(CartService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getCartByUserId', () => {
        it('should return the cart if found', async () => {
            const userId = 'user-id';
            const mockCart = {
                id: 'cart-id',
                userId,
                items: [],
                total: new Decimal(0),
            };

            (
                prismaService.shoppingCart.findFirst as jest.Mock
            ).mockResolvedValue(mockCart);

            const result = await service.getCartByUserId(userId);
            expect(result).toBe(mockCart);
            expect(prismaService.shoppingCart.findFirst).toHaveBeenCalledWith({
                where: { userId },
                include: {
                    items: { include: { product: expect.any(Object) } },
                },
            });
        });

        it('should throw NotFoundException if cart not found', async () => {
            const userId = 'non-existent-user-id';
            (
                prismaService.shoppingCart.findFirst as jest.Mock
            ).mockResolvedValue(null);

            await expect(service.getCartByUserId(userId)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('addCartItem', () => {
        it('should add a new item to the cart', async () => {
            const userId = 'user-id';
            const productId = 'product-id';
            const quantity = 2;
            const addCartItemDto = { productId, quantity };

            const mockProduct = {
                id: productId,
                stock: 10,
                price: new Decimal(100),
            };
            const mockCart = {
                id: 'cart-id',
                userId: 'user-id',
                items: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                total: new Decimal(0),
            };
            const mockCartItem = { id: 'item-id', productId, quantity };

            jest.spyOn(service, 'updateCartTotal').mockResolvedValue(mockCart);

            (prismaService.product.findUnique as jest.Mock).mockResolvedValue(
                mockProduct,
            );
            (
                prismaService.shoppingCart.findFirst as jest.Mock
            ).mockResolvedValue(mockCart);
            (
                prismaService.shoppingCartItem.findFirst as jest.Mock
            ).mockResolvedValue(null);
            (
                prismaService.shoppingCartItem.create as jest.Mock
            ).mockResolvedValue(mockCartItem);

            const result = await service.addCartItem(addCartItemDto, userId);

            expect(result).toBe(mockCart);
            expect(prismaService.product.findUnique).toHaveBeenCalledWith({
                where: { id: productId },
            });
            expect(prismaService.shoppingCartItem.create).toHaveBeenCalledWith({
                data: { shoppingCartId: mockCart.id, productId, quantity },
            });
            expect(service.updateCartTotal).toHaveBeenCalledWith(mockCart.id);
        });

        it('should throw NotFoundException if product not found', async () => {
            const userId = 'user-id';
            const productId = 'non-existent-product-id';
            const addCartItemDto = { productId, quantity: 1 };

            (prismaService.product.findUnique as jest.Mock).mockResolvedValue(
                null,
            );

            await expect(
                service.addCartItem(addCartItemDto, userId),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('removeItem', () => {
        it('should remove an item from the cart', async () => {
            const userId = 'user-id';
            const productId = 'product-id';
            const mockCart = {
                id: 'cart-id',
                userId: 'user-id',
                items: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                total: new Decimal(0),
            };
            const mockCartItem = { id: 'cart-item-id', productId };

            jest.spyOn(service, 'updateCartTotal').mockResolvedValue(mockCart);

            (
                prismaService.shoppingCart.findFirst as jest.Mock
            ).mockResolvedValue(mockCart);
            (
                prismaService.shoppingCartItem.findFirst as jest.Mock
            ).mockResolvedValue(mockCartItem);
            (
                prismaService.shoppingCartItem.delete as jest.Mock
            ).mockResolvedValue(mockCartItem);

            const result = await service.removeItem(userId, productId);

            expect(result).toBe(mockCart);
            expect(prismaService.shoppingCartItem.delete).toHaveBeenCalledWith({
                where: { id: mockCartItem.id },
            });
            expect(service.updateCartTotal).toHaveBeenCalledWith(mockCart.id);
        });

        it('should throw NotFoundException if item not found', async () => {
            const userId = 'user-id';
            const productId = 'non-existent-product-id';
            const mockCart = { id: 'cart-id', userId, items: [] };

            (
                prismaService.shoppingCart.findFirst as jest.Mock
            ).mockResolvedValue(mockCart);
            (
                prismaService.shoppingCartItem.findFirst as jest.Mock
            ).mockResolvedValue(null);

            await expect(service.removeItem(userId, productId)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('updateItemQuantity', () => {
        it('should increment the item quantity', async () => {
            const userId = 'user-id';
            const productId = 'product-id';
            const updateCartItemDto = {
                productId: 'product-id',
                quantity: 1,
                action: 'increment' as const,
                cartId: 'cart-id',
            };

            const mockProduct = { id: productId, stock: 10 };
            const mockCart = {
                id: 'cart-id',
                userId: 'user-id',
                items: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                total: new Decimal(0),
            };
            const mockCartItem = { id: 'item-id', productId, quantity: 1 };

            jest.spyOn(service, 'updateCartTotal').mockResolvedValue(mockCart);

            (prismaService.product.findUnique as jest.Mock).mockResolvedValue(
                mockProduct,
            );
            (
                prismaService.shoppingCart.findFirst as jest.Mock
            ).mockResolvedValue(mockCart);
            (
                prismaService.shoppingCartItem.findFirst as jest.Mock
            ).mockResolvedValue(mockCartItem);
            (
                prismaService.shoppingCartItem.update as jest.Mock
            ).mockResolvedValue(mockCartItem);

            const result = await service.updateItemQuantity(
                updateCartItemDto,
                userId,
            );

            expect(result).toBe(mockCart);
            expect(prismaService.shoppingCartItem.update).toHaveBeenCalledWith({
                where: { id: mockCartItem.id },
                data: { quantity: 2 },
            });
        });
    });

    describe('updateItemQuantity', () => {
        it('should throw NotFoundException if product not found', async () => {
            const userId = 'user-id';
            const productId = 'non-existent-product-id';
            const updateCartItemDto = {
                productId,
                quantity: 1,
                action: 'increment' as const,
                cartId: 'cart-id',
            };

            (prismaService.product.findUnique as jest.Mock).mockResolvedValue(
                null,
            );

            await expect(
                service.updateItemQuantity(updateCartItemDto, userId),
            ).rejects.toThrow(NotFoundException);
        });
    });
});
