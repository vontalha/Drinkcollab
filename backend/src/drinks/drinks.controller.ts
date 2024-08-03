import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    Query,
    Param,
} from '@nestjs/common';
import { Product, ProductType } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProductsService } from 'src/product/products.service';
import { LikeProductDto } from 'src/product/dto/like.dto';
import { LikeService } from 'src/product/like.service';
import { PaginationProductDto } from 'src/dto/pagination.dto';
import { FilterDto } from 'src/dto/filter.dto';

@Controller('drinks')
export class DrinksController {
    constructor(
        private productsService: ProductsService,
        private likeService: LikeService,
    ) {}

    @Get('categories')
    async getAllCategories(): Promise<{ name: string; id: string }[]> {
        return this.productsService.getCategories(ProductType.DRINK);
    }

    @Get('categories/:category')
    async getDrinks(
        @Param('category') categoryName: string,
        @Query() paginationDto: PaginationProductDto,
        @Query() filterDto: FilterDto,
    ): Promise<{ data: Product[]; total: number; totalPages: number }> {
        const { page, pageSize, sortBy, sortOrder } = paginationDto;
        const filter = {
            ...filterDto,
            category: categoryName,
            type: ProductType.DRINK,
        };
        return this.productsService.getAllProducts(
            page,
            pageSize,
            sortBy,
            sortOrder,
            filter,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Post('liked')
    async likeProduct(@Body() likeProductDto: LikeProductDto) {
        const { userId, productId } = likeProductDto;
        await this.likeService.likeProduct(userId, productId);
    }
}
