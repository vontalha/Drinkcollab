import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';
import { AddProductDto } from './dto/product.dto';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/product.dto';
import { FilterDto } from 'src/dto/filter.dto';
import { FilterService } from './filter.service';

describe('ProductsService', () => {
    let service: ProductsService;
    let prismaService: PrismaService;
    let filterService: FilterService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                {
                    provide: PrismaService,
                    useValue: {
                        product: {
                            create: jest.fn(),
                            findUnique: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                            findMany: jest.fn(),
                            count: jest.fn(),
                        },
                        category: {
                            findUnique: jest.fn(),
                        },
                        $transaction: jest.fn(),
                        $queryRaw: jest.fn(),
                    },
                },
                {
                    provide: FilterService,
                    useValue: {
                        buildWhereConditions: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        prismaService = module.get<PrismaService>(PrismaService);
        filterService = module.get<FilterService>(FilterService);
    });

    describe('createProduct', () => {
        it('should create a product', async () => {
            const createProductDto: AddProductDto = {
                name: 'Test Product',
                brand: 'Test Brand',
                type: 'DRINK',
                description: 'Test Description',
                categoryName: 'wine',
                price: 10,
                image: 'image',
                size: 1,
                stock: 1,
            };

            const expectedProduct: Product = {
                id: '1',
                name: 'Test Product',
                brand: 'Test Brand',
                type: 'DRINK',
                description: 'Test Description',
                price: 10,
                image: 'image',
                size: 1,
                stock: 0,
                sales: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
                categoryId: '1',
            };

            jest.spyOn(prismaService.category, 'findUnique').mockResolvedValue({
                id: '1',
                name: 'wine',
                description: 'wine',
                imageUrl: 'imageUrl',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'DRINK',
            });

            jest.spyOn(prismaService.product, 'create').mockResolvedValue(
                expectedProduct,
            );

            const result = await service.addProduct(createProductDto);

            expect(result).toEqual(expectedProduct);
            expect(prismaService.product.create).toHaveBeenCalledWith({
                data: {
                    name: 'Test Product',
                    brand: 'Test Brand',
                    type: 'DRINK',
                    description: 'Test Description',
                    price: 10,
                    image: 'image',
                    size: 1,
                    stock: 1,
                    categoryId: '1',
                },
            });
        });
    });

    describe('getProductById', () => {
        it('should return a product if found', async () => {
            const productId = '1';
            const expectedProduct: Product = {
                id: productId,
                name: 'Test Product',
                brand: 'Test Brand',
                type: 'DRINK',
                description: 'Test Description',
                categoryId: '1',
                price: 10,
                image: 'image',
                size: 1,
                stock: 1,
                sales: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue(
                expectedProduct,
            );

            const result = await service.getProduct(productId);

            expect(result).toEqual(expectedProduct);
            expect(prismaService.product.findUnique).toHaveBeenCalledWith({
                where: { id: productId },
            });
        });

        it('should throw NotFoundException if product is not found', async () => {
            const productId = '1';

            jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue(
                null,
            );

            await expect(service.getProduct(productId)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('updateProduct', () => {
        it('should update a product', async () => {
            const productId = '1';
            const updateProductDto: UpdateProductDto = {
                name: 'Updated Product',
            };

            const updatedProduct: Product = {
                id: productId,
                name: 'Updated Product',
                brand: 'Test Brand',
                type: 'DRINK',
                description: 'Test Description',
                categoryId: '1',
                price: 10,
                image: 'image',
                size: 1,
                stock: 1,
                sales: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            jest.spyOn(prismaService.product, 'update').mockResolvedValue(
                updatedProduct,
            );

            const result = await service.updateProduct(
                productId,
                updateProductDto,
            );

            expect(result).toEqual(updatedProduct);
            expect(prismaService.product.update).toHaveBeenCalledWith({
                where: { id: productId },
                data: updateProductDto,
            });
        });
    });

    describe('deleteProduct', () => {
        it('should delete a product', async () => {
            const productId = '1';
            const deletedProduct: Product = {
                id: productId,
                name: 'Deleted Product',
                brand: 'Test Brand',
                type: 'DRINK',
                description: 'Test Description',
                categoryId: '1',
                price: 10,
                image: 'image',
                size: 1,
                stock: 1,
                sales: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            jest.spyOn(prismaService.product, 'delete').mockResolvedValue(
                deletedProduct,
            );

            const result = await service.deleteProduct(productId);

            expect(result).toEqual(deletedProduct);
            expect(prismaService.product.delete).toHaveBeenCalledWith({
                where: { id: productId },
            });
        });
    });

    describe('getAllProducts', () => {
        it('should return products with pagination', async () => {
            const page = 1;
            const pageSize = 10;
            const sortBy = 'name';
            const sortOrder = 'asc';
            const filterDto: FilterDto = {};

            const mockProducts: Product[] = [
                {
                    id: '1',
                    name: 'Product 1',
                    brand: 'Brand 1',
                    type: 'DRINK',
                    description: 'Description 1',
                    categoryId: '1',
                    price: 10,
                    image: 'image',
                    size: 1,
                    stock: 1,
                    sales: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            const mockTotal = 1;

            jest.spyOn(filterService, 'buildWhereConditions').mockResolvedValue(
                {},
            );
            jest.spyOn(prismaService, '$transaction').mockResolvedValue([
                mockProducts,
                mockTotal,
            ]);

            const result = await service.getAllProducts(
                page,
                pageSize,
                sortBy,
                sortOrder as 'asc' | 'desc',
                filterDto,
            );

            expect(result).toEqual({
                data: mockProducts,
                total: mockTotal,
                totalPages: 1,
            });
            expect(prismaService.$transaction).toHaveBeenCalled();
        });

        it('should throw BadRequestException if page number exceeds total pages', async () => {
            const page = 2;
            const pageSize = 10;
            const sortBy = 'name';
            const sortOrder = 'asc';
            const filterDto: FilterDto = {};

            jest.spyOn(filterService, 'buildWhereConditions').mockResolvedValue(
                {},
            );
            jest.spyOn(prismaService, '$transaction').mockResolvedValue([
                [],
                0,
            ]);

            await expect(
                service.getAllProducts(
                    page,
                    pageSize,
                    sortBy,
                    sortOrder as 'asc' | 'desc',
                    filterDto,
                ),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('searchProducts', () => {
        it('should return products matching the search query', async () => {
            const query = 'test product';
            const mockProducts: Product[] = [
                {
                    id: '1',
                    name: 'Test Product',
                    brand: 'Test Brand',
                    type: 'DRINK',
                    description: 'Test Description',
                    categoryId: '1',
                    price: 10,
                    image: 'image',
                    size: 1,
                    stock: 1,
                    sales: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            jest.spyOn(prismaService, '$queryRaw').mockResolvedValue(
                mockProducts,
            );

            const result = await service.searchProducts(query);

            expect(result).toEqual(mockProducts);
            expect(prismaService.$queryRaw).toHaveBeenCalled();
        });
    });
});
