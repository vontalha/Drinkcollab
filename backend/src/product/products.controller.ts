import {
    Body,
    Controller,
    Get,
    Post,
    UseGuards,
    Query,
    ValidationPipe,
    UsePipes,
} from '@nestjs/common';
import { Product } from '@prisma/client';
import { LikeProductDto } from './dto/like.dto';
import { LikeService } from './like.service';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaginationProductDto } from 'src/dto/pagination.dto';
import { FilterDto } from 'src/dto/filter.dto';

@Controller('products')
export class ProductController {
    constructor(
        private productsService: ProductsService,
        private likeService: LikeService,
    ) {}

    @Get('all')
    @UsePipes(new ValidationPipe({ transform: true }))
    async getAllProducts(
        // @Query('page') page: number = 1,
        // @Query('pageSize') pageSize: number = 20,
        // @Query('sortBy') sortBy: string = 'sales',
        // @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc'
        @Query() paginationDto: PaginationProductDto,
        @Query() filterDto: FilterDto,
    ): Promise<{ data: Product[]; total: number; totalPages: number }> {
        const { page, pageSize, sortBy, sortOrder } = paginationDto;

        console.log({ page, pageSize, sortBy, sortOrder });
        return this.productsService.getAllProducts(
            page,
            pageSize,
            sortBy,
            sortOrder,
            filterDto,
        );
    }

    @Get('search')
    async search(@Query('q') query: string): Promise<Product[]> {
        return this.productsService.searchProducts(query);
    }

    @UseGuards(JwtAuthGuard)
    @Post('like')
    async likeProduct(@Body() likeProductDto: LikeProductDto) {
        const { userId, productId } = likeProductDto;
        await this.likeService.likeProduct(userId, productId);
    }
}
