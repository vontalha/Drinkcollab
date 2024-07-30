import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ProductsService } from './product/products.service';
import { Product, ProductType } from '@prisma/client';
import { LikeService } from './product/like.service';
import { LikeProductDto } from './product/dto/like.dto';
@UseGuards(JwtAuthGuard)
@Controller()
export class AppController {
    constructor(
        private productService: ProductsService,
        private likeService: LikeService,
    ) {}

    @Get()
    async getLandingPageData(): Promise<{
        drinks: Product[];
        snacks: Product[];
        popular: Product[];
    }> {
        const drinks = await this.productService.getPopularProducts(
            9,
            ProductType.DRINK,
        );
        const snacks = await this.productService.getPopularProducts(
            9,
            ProductType.SNACK,
        );
        const popular = await this.productService.getPopularProducts(9);

        return { drinks, snacks, popular };
    }

    @Post('liked')
    async likeProduct(@Body() likeProductDto: LikeProductDto) {
        const { userId, productId } = likeProductDto;
        await this.likeService.likeProduct(userId, productId);
    }
}
