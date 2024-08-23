import {
    IsOptional,
    IsString,
    IsEnum,
    IsDecimal,
    IsDateString,
    IsInt,
    IsArray,
    ValidateNested,
} from 'class-validator';
import { Decimal } from '@prisma/client/runtime/library';
import { OrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';

class OrderItemDto {
    @IsString()
    id: string;

    @IsString()
    productId: string;

    @IsInt()
    quantity: number;

    @IsDecimal()
    price: Decimal;
}

export class OrderDto {
    @IsString()
    id: string;

    @IsString()
    userId: string;

    @IsInt()
    quantity: number;

    @IsDateString()
    createdAt: Date;

    @IsOptional()
    @IsDateString()
    updatedAt?: Date;

    @IsOptional()
    @IsString()
    paymentId?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    orderItems: OrderItemDto[];

    @IsOptional()
    @IsDecimal()
    total?: Decimal;

    @IsOptional()
    @IsString()
    invoiceId?: string;

    @IsEnum(OrderStatus)
    status: OrderStatus;
}
