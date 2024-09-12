import { Module } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { ProductsService } from 'src/product/products.service';
import { FilterService } from 'src/product/filter.service';

@Module({
    imports: [PrismaModule, HttpModule],
    providers: [PaypalService, ProductsService, FilterService],
    exports: [PaypalService],
})
export class PaypalModule {}
