import { config } from 'dotenv';
config();
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CartWithItemsDto } from 'src/cart/dto/cart.dto';
import { Prisma, InvoiceStatus } from '@prisma/client';
import { Order } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { InvoiceService } from '../invoice/invoice.service';
@Injectable()
export class PaypalService {
    private readonly clientId: string = process.env.PAYPAL_CLIENT_ID;
    private readonly clientSecret: string = process.env.PAYPAL_CLIENT_SECRET;
    private readonly baseUrl: string = process.env.PAYPAL_BASE_URL;
    private readonly invoiceService: InvoiceService;

    constructor(
        private readonly prisma: PrismaService,
        private readonly httpService: HttpService,
    ) {}

    generateAccessToken = async (): Promise<string> => {
        try {
            if (!this.clientId || !this.clientSecret) {
                throw new Error('MISSING_PAYPAL_CREDENTIALS');
            }

            const auth = Buffer.from(
                `${this.clientId}:${this.clientSecret}`,
            ).toString('base64');
            console.log('KeyauthKEY:', auth);

            const { data } = await firstValueFrom(
                // body must be url encoded
                this.httpService.post(
                    `${this.baseUrl}/v1/oauth2/token`,
                    new URLSearchParams({
                        grant_type: 'client_credentials',
                    }).toString(),
                    {
                        headers: {
                            Authorization: `Basic ${auth}`,
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    },
                ),
            );

            return data.access_token;
        } catch (error) {
            console.error('Failed to generate Access Token:', error);
        }
    };

    createOrder = async (
        total: Decimal,
    ): Promise<{ status: string; paypalOrderId: string }> => {
        const accessToken = await this.generateAccessToken();
        const url = `${this.baseUrl}/v2/checkout/orders`;
        console.log('accessToken:', accessToken);
        console.log('url:', url);

        const payload = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'EUR',
                        value: total.toString(),
                    },
                },
            ],
        };

        const { data } = await firstValueFrom(
            this.httpService.post(url, payload, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }),
        );

        return { status: data.status, paypalOrderId: data.id };
    };

    captureOrder = async (paypalOrderId: string): Promise<void> => {
        const accessToken = await this.generateAccessToken();
        const url = `${this.baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`;

        const { data } = await firstValueFrom(
            this.httpService.post(
                url,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                },
            ),
        );
        if (data.status === 'COMPLETED') {
            await this.prisma.payment.update({
                where: { paypalOrderId },
                data: { status: 'COMPLETED' },
            });

            const payment = await this.prisma.payment.findUnique({
                where: { paypalOrderId },
            });

            await this.prisma.order.updateMany({
                where: {
                    OR: [
                        { id: payment.orderId },
                        { invoiceId: payment.invoiceId },
                    ],
                },
                data: { status: 'COMPLETED' },
            });
            //invoiceTOken loschen weilbezahlt && invoice auf bezahlt setzen
            payment.invoiceId &&
                (await this.prisma.invoiceToken.delete({
                    where: { invoiceId: payment.invoiceId },
                }) &&
                (await this.invoiceService.updateInvoice(
                    payment.invoiceId,
                    { status: InvoiceStatus.PAID },
                )));
        
        } else {
            await this.prisma.payment.update({
                where: { paypalOrderId },
                data: { status: 'FAILED' },
            });

            const payment = await this.prisma.payment.findUnique({
                where: { paypalOrderId },
            });

            await this.prisma.order.updateMany({
                where: {
                    OR: [
                        { id: payment.orderId },
                        { invoiceId: payment.invoiceId },
                    ],
                },
                data: { status: 'CANCELLED' },
            });
            throw new Error('Payment not completed.');
        }
    };

    handlePayPalOrder = async (
        prisma: Prisma.TransactionClient,
        userId: string,
        order: Order,
        cart: CartWithItemsDto,
    ): Promise<string> => {
        const paypalOrder = await this.createOrder(cart.total);

        if (paypalOrder.status === 'CANCELLED') {
            await prisma.order.update({
                where: { id: order.id },
                data: { status: OrderStatus.CANCELLED },
            });
            throw new BadRequestException('Paypal order cancelled');
        }

        const payment = await prisma.payment.create({
            data: {
                userId: userId,
                orderId: order.id,
                amount: order.total,
                method: PaymentMethod.PAYPAL,
                status: PaymentStatus.PENDING,
                paypalOrderId: paypalOrder.paypalOrderId,
            },
        });

        await prisma.order.update({
            where: { id: order.id },
            data: { paymentId: payment.id },
        });

        await prisma.shoppingCart.update({
            where: { id: cart.id },
            data: {
                items: {
                    deleteMany: {},
                },
                total: 0,
            },
        });

        return paypalOrder.paypalOrderId;
    };

    handleInvoicePayPalOrder = async (
        userId: string,
        invoiceId: string,
    ): Promise<string> => {
        const invoice = await this.invoiceService.getDueInvoice(invoiceId);
        const paypalOrder = await this.createOrder(invoice.totalAmount);

        if (paypalOrder.status === 'CANCELLED') {
            await this.prisma.order.updateMany({
                where: { invoiceId: invoice.id },
                data: { status: OrderStatus.CANCELLED },
            });
            throw new BadRequestException('Paypal order cancelled');
        }

        const payment = await this.prisma.payment.create({
            data: {
                userId: userId,
                invoiceId: invoice.id,
                amount: invoice.totalAmount,
                method: PaymentMethod.PAYPAL,
                status: PaymentStatus.PENDING,
                paypalOrderId: paypalOrder.paypalOrderId,
            },
        });

        await this.prisma.order.updateMany({
            where: { invoiceId: invoice.id },
            data: { paymentId: payment.id },
        });

        return paypalOrder.paypalOrderId;
    };
}
