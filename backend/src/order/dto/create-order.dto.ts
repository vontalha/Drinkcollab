import {
    IsString,
    IsEnum,
    IsDecimal,
    IsInt,
    IsArray,
    ValidateNested,
} from 'class-validator';
import { Decimal } from '@prisma/client/runtime/library';
import { OrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
    @IsString()
    productId: string;

    @IsInt()
    quantity: number;

    @IsDecimal()
    price: Decimal;
}

export class CreateOrderDto {
    @IsString()
    userId: string;

    @IsDecimal()
    total: Decimal;

    @IsInt()
    quantity: number;

    @IsEnum(OrderStatus)
    status: OrderStatus;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    orderItems: CreateOrderItemDto[];
}
