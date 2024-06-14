import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product, Category, ProductType } from '@prisma/client';
import { AddProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
	constructor(private prismaService: PrismaService) {}

	addProduct = async (data: AddProductDto): Promise<Product> => {
		const { categoryName, ...productData } = data;
		const category = await this.prismaService.category.findUnique({
			where: { name: categoryName },
		});

		if (!category) {
			throw new NotFoundException("Category does not exist! Choose a different category or add a new one.");
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

    getAllProductsByType = async (type: "DRINK" | "SNACK"): Promise<Product[]>=> {
        return await this.prismaService.product.findMany({ where: { type } })
    }

	getProduct = async (id: string): Promise<Product> => {
		return await this.prismaService.product.findUnique({ where: { id } });
	};

	updateProduct = async (id: string, data: UpdateProductDto): Promise<Product> => {
		const { categoryName, ...productData } = data;

		if (categoryName) {
			const category = await this.prismaService.category.findUnique({
				where: { name: categoryName },
			});

			if (!category) {
				throw new NotFoundException("Category does not exist! Choose a different category or add a new one.");
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
		const product = await this.prismaService.product.findUnique({ where: { id } });
		return product.sales;
	};

	getProductsByCategoryName = async (categoryName: string): Promise<Product[]> => {
		const category = await this.prismaService.category.findUnique({
			where: { name: categoryName },
		});

		if (!category) {
			throw new NotFoundException("Category not found");
		}

		return await this.prismaService.product.findMany({
			where: { categoryId: category.id },
			orderBy: { sales: 'desc' },
		});
	};

	getPopularProducts = async (
            amount: number | undefined, 
            type?: "DRINK" | "SNACK" 
        ): Promise<Product[]> => {
		return await this.prismaService.product.findMany({
            where: { 
                ...( type? { type }: {})
            },
			orderBy: {
				sales: "desc",
			},
            ...(amount && { take: amount }),
		});
	};

	getAllProducts = async (
		page: number,
		pageSize: number,
		sortBy: string,
		sortOrder: "asc" | "desc",
		type?: "DRINK" | "SNACK" 
	): Promise<{ data: Product[]; total: number; totalPages: number }> => {
		const skip = (page - 1) * pageSize;
		const take = pageSize
		const [data, total] = await this.prismaService.$transaction([
            this.prismaService.product.findMany({
				where: { 
					...( type? { type }: {})
				},
                skip,
                take,
                orderBy: {
                    [sortBy]: sortOrder,
                },
            }),
            this.prismaService.product.count(),
        ]);

		const totalPages = Math.ceil(total / pageSize);

        if (page > totalPages) {
            throw new BadRequestException('Page number exceeds total pages.');
        }

        return { data, total, totalPages };	
	}


	getCategories = async (type: ProductType): Promise<Category[]> => {
		return await this.prismaService.category.findMany({
			where: { type },
		});
	};
}
