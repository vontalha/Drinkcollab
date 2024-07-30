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
        return await this.prismaService.product.findUnique({ where: { id } });
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

    deleteProduct = async (id: string): Promise<void> => {
        await this.prismaService.product.delete({ where: { id } });
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

    // async getFilteredProducts(
    //     filterDto: FilterDto,
    //     page: number,
    //     pageSize: number,
    //     sortBy: string,
    //     sortOrder: 'asc' | 'desc',
    // ): Promise<{ data: Product[]; total: number; totalPages: number }> {
    //     const skip = (page - 1) * pageSize;
    //     const take = pageSize;

    //     const whereConditions =
    //         await this.filterService.buildWhereConditions(filterDto);

    //     const [data, total] = await this.prismaService.$transaction([
    //         this.prismaService.product.findMany({
    //             where: whereConditions,
    //             skip,
    //             take,
    //             orderBy: {
    //                 [sortBy]: sortOrder,
    //             },
    //         }),
    //         this.prismaService.product.count({
    //             where: whereConditions,
    //         }),
    //     ]);

    //     const totalPages = Math.ceil(total / pageSize);

    //     if (page > totalPages) {
    //         throw new BadRequestException('Page number exceeds total pages.');
    //     }

    //     return { data, total, totalPages };
    // }

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
}
