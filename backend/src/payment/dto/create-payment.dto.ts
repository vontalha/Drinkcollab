import { IsString, IsEnum, IsDecimal } from 'class-validator';
import { Decimal } from '@prisma/client/runtime/library';
import { PaymentStatus } from '@prisma/client';
import { PaymentMethod } from '@prisma/client';
export class CreatePaymentDto {
    @IsString()
    userId: string;

    @IsString()
    orderId: string;

    @IsDecimal()
    amount: Decimal;

    @IsEnum(PaymentMethod)
    method: PaymentMethod;

    @IsEnum(PaymentStatus)
    status: PaymentStatus;
}
