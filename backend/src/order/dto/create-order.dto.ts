import { IsString, IsEnum } from 'class-validator';

import { PaymentMethod } from '@prisma/client';

export class CreateOrderDto {
    @IsString()
    userId: string;

    @IsString()
    cartId: string;

    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;
}

export class CreateInvoiceOrderDto {
    @IsString()
    userId: string;

    @IsString()
    invoiceId: string;
}
