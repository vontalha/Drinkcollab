import {
    IsOptional,
    IsString,
    IsEnum,
    IsDecimal,
    IsDateString,
} from 'class-validator';
import { Decimal } from '@prisma/client/runtime/library';
import { PaymentStatus } from '@prisma/client';
import { PaymentMethod } from '@prisma/client';
import { OrderDto } from '../../order/dto/order.dto';

export class PaymentDto {
    @IsString()
    id: string;

    @IsString()
    paymentId: string;

    @IsString()
    orderId: string;

    @IsString()
    userId: string;

    @IsOptional()
    @IsString()
    paypalOrderId?: string;

    @IsOptional()
    @IsString()
    invoiceId?: string;

    @IsDecimal()
    amount: Decimal;

    @IsEnum(PaymentMethod)
    paymentMethod: string;

    @IsEnum(PaymentStatus)
    paymentStatus: PaymentStatus;

    @IsString()
    paymentDate: string;

    @IsDateString()
    createdAt: Date;

    order: OrderDto;
}
