import { Controller, Body, Post, UseGuards, Param, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaypalService } from 'src/payment/paypal/paypal.service';
import { InvoiceService } from 'src/payment/invoice/invoice.service';
import { DueInvoiceDto } from 'src/payment/invoice/dto/due-invoices.dto';
import { CreateInvoiceOrderDto } from 'src/order/dto/create-order.dto';
@UseGuards(JwtAuthGuard)
@Controller('payment')
export class PaymentController {
    constructor(
        private readonly invoiceService: InvoiceService,
        private readonly paypalService: PaypalService,
    ) {}

    @Get('invoice/:invoiceToken')
    async getInvoice(
        @Param('invoiceToken') invoiceToken: string,
    ): Promise<DueInvoiceDto> {
        return this.invoiceService.getInvoiceByToken(invoiceToken);
    }

    @Post('invoice/paypal-order/create')
    async createPaypalOrder(
        @Body() body: CreateInvoiceOrderDto,
    ): Promise<string> {
        return this.paypalService.handleInvoicePayPalOrder(
            body.userId,
            body.invoiceId,
        );
    }

    @Post('invoice/paypal-order/capture/:paypalOrderId')
    async capturePaypalOrder(
        @Param('paypalOrderId') paypalOrderId: string,
    ): Promise<{ message: string }> {
        await this.paypalService.captureOrder(paypalOrderId);
        return {
            message: 'Payment captured successfully',
        };
    }
}
