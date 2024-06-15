import { Module } from '@nestjs/common';
import { DrinksController } from './drinks.controller';
import { DrinksService } from './drinks.service';
import { ProductsService } from 'src/product/products.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [DrinksController],
  providers: [DrinksService, ProductsService, PrismaService]
})
export class DrinksModule {}
