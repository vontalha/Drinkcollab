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
    NotFoundException,
    Query
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Product, ProductType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { LikeProductDto } from './dto/like.dto';
import { LikeService } from './like.service';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('products')
export class ProductController {
    constructor(private productsService: ProductsService, private likeService: LikeService){}

    @Get("all")
    async getAllProducts(
        @Query('page') page: number = 1,
        @Query('pageSize') pageSize: number = 20,
        @Query('sortBy') sortBy: string = 'sales',
        @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc'
    ): Promise<{ data: Product[]; total: number }> {
        return this.productsService.getAllProducts(page, pageSize, sortBy, sortOrder);
    }
    @UseGuards(JwtAuthGuard)
	@Post("liked")
	async likeProduct(@Body() likeProductDto: LikeProductDto) {
		const { userId, productId } = likeProductDto;
		await this.likeService.likeProduct(userId, productId);	
	}
}
