import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Res,
    UseGuards,
    UsePipes,
    Request as Req,
    NotFoundException
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ProductService } from './product/product.service';
import { Product, ProductType } from '@prisma/client';
import { LikeService } from './product/like.service';
import { LikeProductDto } from './product/dto/like.dto';

@Controller()
export class AppController {
	constructor(
		private productService: ProductService,
		private likeService: LikeService
	) {}

	@Get()
	async getLandingPageData(): Promise<{ drinks: Product[], snacks: Product[], popular: Product[] }> {
		const drinks = await this.productService.getPopularProducts(9, ProductType.DRINK);
		const snacks = await this.productService.getPopularProducts(9, ProductType.SNACK);
		const popular = await this.productService.getPopularProducts(9);

		return { drinks, snacks, popular };
	}

	@UseGuards(JwtAuthGuard)
	@Post("liked")
	async likeProduct(@Body() likeProductDto: LikeProductDto) {
		const { userId, productId } = likeProductDto;
		await this.likeService.likeProduct(userId, productId);	
	}
}
