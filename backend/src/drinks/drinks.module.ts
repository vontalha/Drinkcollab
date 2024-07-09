import { Module } from '@nestjs/common';
import { DrinksController } from './drinks.controller';
import { DrinksService } from './drinks.service';
import { ProductsService } from 'src/product/products.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterService } from 'src/product/filter.service';
import { ProductsModule } from 'src/product/products.module';
import { LikeService } from 'src/product/like.service';

@Module({
    imports: [ProductsModule],
    controllers: [DrinksController],
    providers: [
        DrinksService,
        ProductsService,
        PrismaService,
        FilterService,
        LikeService,
    ],
})
export class DrinksModule {}
