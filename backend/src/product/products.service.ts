import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product, ProductType } from '@prisma/client';
import { AddProductDto, UpdateProductDto } from './dto/product.dto';
import { FilterDto } from 'src/dto/filter.dto';
import { FilterService } from './filter.service';
import { Prisma } from '@prisma/client';
import { CartWithItemsDto } from 'src/cart/dto/cart.dto';
import { Category } from '@prisma/client';
import { AddCategoryDto } from './dto/product.dto';
@Injectable()
export class ProductsService {
    constructor(
        private prismaService: PrismaService,
        private filterService: FilterService,
    ) {}

    addProduct = async (data: AddProductDto): Promise<Product> => {
        const { categoryName, ...productData } = data;
        const category = await this.prismaService.category.findUnique({
            where: { name: categoryName },
        });

        if (!category) {
            throw new NotFoundException(
                'Category does not exist! Choose a different category or add a new one.',
            );
        }

        return await this.prismaService.product.create({
            data: {
                ...productData,
                categoryId: category.id,
            },
        });
    };

    // getAllProducts = async (): Promise<Product[]> => {
    // 	return await this.prismaService.product.findMany();
    // };

    getAllProductsByType = async (
        type: 'DRINK' | 'SNACK',
    ): Promise<Product[]> => {
        return await this.prismaService.product.findMany({ where: { type } });
    };

    getProduct = async (id: string): Promise<Product> => {
        const product = await this.prismaService.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    };

    updateProduct = async (
        id: string,
        data: UpdateProductDto,
    ): Promise<Product> => {
        const { categoryName, ...productData } = data;

        if (categoryName) {
            const category = await this.prismaService.category.findUnique({
                where: { name: categoryName },
            });

            if (!category) {
                throw new NotFoundException(
                    'Category does not exist! Choose a different category or add a new one.',
                );
            }

            return await this.prismaService.product.update({
                where: { id },
                data: {
                    ...productData,
                    categoryId: category.id,
                },
            });
        }

        return await this.prismaService.product.update({
            where: { id },
            data: productData,
        });
    };

    deleteProduct = async (id: string): Promise<Product> => {
        return await this.prismaService.product.delete({ where: { id } });
    };

    getProductSales = async (id: string): Promise<number> => {
        const product = await this.prismaService.product.findUnique({
            where: { id },
        });
        return product.sales;
    };

    getProductsByCategoryName = async (
        categoryName: string,
    ): Promise<Product[]> => {
        const category = await this.prismaService.category.findUnique({
            where: { name: categoryName },
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return await this.prismaService.product.findMany({
            where: { categoryId: category.id },
            orderBy: { sales: 'desc' },
        });
    };

    getPopularProducts = async (
        amount: number | undefined,
        type?: 'DRINK' | 'SNACK',
    ): Promise<Product[]> => {
        return await this.prismaService.product.findMany({
            where: {
                ...(type ? { type } : {}),
            },
            orderBy: {
                sales: 'desc',
            },
            ...(amount && { take: amount }),
        });
    };

    // getAllProducts = async (
    //     page: number,
    //     pageSize: number,
    //     sortBy: string,
    //     sortOrder: 'asc' | 'desc',
    //     type?: 'DRINK' | 'SNACK',
    //     categoryName?: string,
    // ): Promise<{ data: Product[]; total: number; totalPages: number }> => {
    //     const skip = (page - 1) * pageSize;
    //     const take = pageSize;

    //     let categoryId: string | undefined;

    //     if (categoryName) {
    //         const category = await this.prismaService.category.findUnique({
    //             where: { name: categoryName },
    //         });

    //         if (!category) {
    //             throw new NotFoundException(
    //                 `Category with name "${categoryName}" not found`,
    //             );
    //         }
    //         categoryId = category.id;
    //     }

    //     const [data, total] = await this.prismaService.$transaction([
    //         this.prismaService.product.findMany({
    //             where: {
    //                 ...(type ? { type } : {}),
    //                 ...(categoryId ? { categoryId } : {}),
    //             },
    //             skip,
    //             take,
    //             orderBy: {
    //                 [sortBy]: sortOrder,
    //             },
    //         }),
    //         this.prismaService.product.count(),
    //     ]);

    //     const totalPages = Math.ceil(total / pageSize);

    //     if (page > totalPages) {
    //         throw new BadRequestException('Page number exceeds total pages.');
    //     }

    //     return { data, total, totalPages };
    // };

    getCategories = async (
        type?: ProductType,
    ): Promise<{ name: string; id: string }[]> => {
        return await this.prismaService.category.findMany({
            where: {
                ...(type ? { type } : {}),
            },
            select: {
                name: true,
                id: true,
            },
        });
    };

    getBrands = async (type?: ProductType): Promise<string[]> => {
        const brands = await this.prismaService.product.findMany({
            where: {
                ...(type ? { type } : {}),
            },
            select: {
                brand: true,
            },
            distinct: ['brand'],
        });
        return brands
            .map((product) => product.brand)
            .filter((brand) => brand !== null);
    };

    async getAllProducts(
        page: number,
        pageSize: number,
        sortBy: string,
        sortOrder: 'asc' | 'desc',
        filterDto?: FilterDto,
    ): Promise<{ data: Product[]; total: number; totalPages: number }> {
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        const whereConditions = filterDto
            ? await this.filterService.buildWhereConditions(filterDto)
            : {};

        const [data, total] = await this.prismaService.$transaction([
            this.prismaService.product.findMany({
                where: whereConditions,
                skip,
                take,
                orderBy: {
                    [sortBy]: sortOrder,
                },
            }),
            this.prismaService.product.count({
                where: whereConditions,
            }),
        ]);

        const totalPages = Math.ceil(total / pageSize);

        if (page > totalPages) {
            throw new BadRequestException('Page number exceeds total pages.');
        }

        return { data, total, totalPages };
    }

    searchProducts = async (
        query: string,
        page: number,
        pageSize: number,
    ): Promise<{ data: Product[]; total: number; totalPages: number }> => {
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        const queryTerms = query
            .split(' ')
            .map((term) => term.trim())
            .filter((term) => term.length > 0);

        const whereConditions = queryTerms
            .map(
                (term) => Prisma.sql`
            (
                "name" % ${term}
                OR "brand" % ${term}
                OR "type"::text % ${term}
                OR "description" % ${term}
                OR "categoryId" IN (
                    SELECT "id" FROM "Category" WHERE "name" % ${term}
                )
            )
        `,
            )
            .reduce((prev, curr) => Prisma.sql`${prev} OR ${curr}`);

        const similarityCalc = queryTerms
            .map(
                (term) => Prisma.sql`
            GREATEST(
                similarity("name", ${term}),
                similarity("brand", ${term}),
                similarity("type"::text, ${term}),
                similarity("description", ${term}),
                (SELECT similarity("name", ${term}) FROM "Category" WHERE "id" = "Product"."categoryId")
            )
        `,
            )
            .reduce((prev, curr) => Prisma.sql`${prev} + ${curr}`);

        const rawQuery = Prisma.sql`
            SELECT *,
                ${similarityCalc} AS similarity_score
            FROM "Product"
            WHERE ${whereConditions}
            ORDER BY similarity_score DESC
            LIMIT ${take} OFFSET ${skip};
        `;

        const countQuery = Prisma.sql`
            SELECT COUNT(*)::INTEGER AS count
            FROM "Product"
            WHERE ${whereConditions};
        `;
        // console.log(rawQuery);

        //this has to be part of the first execution to install pg_trgm for postgres
        //after first run comment out
        await this.prismaService
            .$executeRaw`CREATE EXTENSION IF NOT EXISTS pg_trgm;`;
        const [products, totalResult] = await this.prismaService.$transaction([
            this.prismaService.$queryRaw<Product[]>(rawQuery),
            this.prismaService.$queryRaw<{ count: number }>(countQuery),
        ]);

        const total = totalResult[0].count;
        const totalPages = Math.ceil(total / pageSize);

        if (page > totalPages && totalPages > 0) {
            throw new BadRequestException('Page number exceeds total pages.');
        }

        return { data: products, total, totalPages };
    };

    addCategory = async (data: AddCategoryDto): Promise<Category> => {
        const { name, type } = data;

        const category = await this.prismaService.category.findFirst({
            where: { name },
        });

        if (category) {
            throw new BadRequestException('Category already exists');
        }

        return await this.prismaService.category.create({
            data: {
                name,
                type,
            },
        });
    };

    updateProductsAfterOrder = async (cart: CartWithItemsDto) => {
        for (const item of cart.items) {
            await this.prismaService.product.update({
                where: { id: item.productId },
                data: {
                    stock: { decrement: item.quantity },
                    sales: { increment: item.quantity },
                },
            });
        }
    };

    updateProductAfterCancel = async (cart: CartWithItemsDto) => {
        for (const item of cart.items) {
            await this.prismaService.product.update({
                where: { id: item.productId },
                data: {
                    stock: { increment: item.quantity },
                    sales: { decrement: item.quantity },
                },
            });
        }
    };
}
