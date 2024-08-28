import { Controller, Body, Post, UseGuards, Param, Get } from '@nestjs/common';
import { CartService } from 'src/cart/cart.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaypalService } from 'src/payment/paypal/paypal.service';
import { OrderService } from 'src/order/order.service';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';
import { InvoiceService } from 'src/payment/invoice/invoice.service';
import { DueInvoiceDto } from 'src/payment/invoice/dto/due-invoices.dto';

@UseGuards(JwtAuthGuard)
@Controller('payment')
export class PaymentController {
    constructor(private readonly invoiceService: InvoiceService) {}

    @Get('invoice/:invoiceToken')
    async getInvoice(
        @Param('invoiceToken') invoiceToken: string,
    ): Promise<DueInvoiceDto> {
        return this.invoiceService.getInvoiceByToken(invoiceToken);
    }
}
// prisma: Prisma.TransactionClient,
// userId: string,
// order: Order,
// cart?: CartWithItemsDto,
// invoiceId?: string,
