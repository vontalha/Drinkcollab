import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaypalService } from './paypal/paypal.service';
import { HttpModule } from '@nestjs/axios';
import { InvoiceModule } from './invoice/invoice.module';
import { ProductsService } from 'src/product/products.service';
import { FilterService } from 'src/product/filter.service';
import { InvoiceService } from './invoice/invoice.service';
@Module({
    imports: [HttpModule, InvoiceModule],
    providers: [
        PaymentService,
        PaypalService,
        ProductsService,
        FilterService,
        InvoiceService,
    ],
    controllers: [PaymentController],
})
export class PaymentModule {}
