import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductController } from './products.controller';
import { LikeService } from './like.service';

@Module({
  providers: [ProductsService, LikeService],
  controllers: [ProductController]
})
export class ProductModule {}
