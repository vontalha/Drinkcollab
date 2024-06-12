import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { LikeService } from './like.service';

@Module({
  providers: [ProductService, LikeService],
  controllers: [ProductController]
})
export class ProductModule {}
