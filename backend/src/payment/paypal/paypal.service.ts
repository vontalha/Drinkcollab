import { config } from 'dotenv';
config();
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CartWithItemsDto } from 'src/cart/dto/cart.dto';

@Injectable()
export class PaypalService {
    private readonly clientId: string = process.env.PAYPAL_CLIENT_ID;
    private readonly clientSecret: string = process.env.PAYPAL_CLIENT_SECRET;
    private readonly baseUrl: string = process.env.PAYPAL_BASE_URL;

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
        cart: CartWithItemsDto,
    ): Promise<{ status: string; paypalOrderId: string }> => {
        const accessToken = await this.generateAccessToken();
        const url = `${this.baseUrl}/v2/checkout/orders`;
        console.log('createOrder:', cart);
        console.log('accessToken:', accessToken);
        console.log('url:', url);

        const payload = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'EUR',
                        value: cart.total,
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

            await this.prisma.order.update({
                where: { id: payment.orderId },
                data: { status: 'COMPLETED' },
            });
        } else {
            await this.prisma.payment.update({
                where: { paypalOrderId },
                data: { status: 'FAILED' },
            });

            const payment = await this.prisma.payment.findUnique({
                where: { paypalOrderId },
            });

            await this.prisma.order.update({
                where: { id: payment.orderId },
                data: { status: 'CANCELLED' },
            });
            throw new Error('Payment not completed.');
        }
    };
}
