import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductController } from './products.controller';
import { LikeService } from './like.service';
import { FilterService } from './filter.service';

@Module({
    providers: [ProductsService, LikeService, FilterService],
    controllers: [ProductController],
    exports: [ProductsService, LikeService, FilterService],
})
export class ProductsModule {}
