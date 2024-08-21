import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaypalService {
    private readonly clientId: string = process.env.PAYPAL_CLIENT_ID;
    private readonly clientSecret: string = process.env.PAYPAL_CLIENT_SECRET;
    private readonly baseUrl: string = process.env.PAYPAL_API_BASE_URL;

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

    // createOrder = async (cart: Cart): Promise<string> => {
    //     const accessToken = await this.generateAccessToken();
    //     const url = `${this.baseUrl}/v2/checkout/orders`;
    //     const payload = {
    //         intent: 'CAPTURE',
    //         purchase_units: [
    //             {
    //                 amount: {
    //                     value: '100.00',
    //                     currency_code: 'EUR',
    //                 },
    //             },
    //         ],
    //     };
    //     return;
    // };
}
