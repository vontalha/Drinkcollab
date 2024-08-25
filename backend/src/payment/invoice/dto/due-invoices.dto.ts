import {
    IsString,
    IsDate,
    IsArray,
    ValidateNested,
    IsNumber,
    IsDecimal,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';

export class DueInvoicesDto {
    @IsString()
    id: string;

    @IsDate()
    dueDate: Date;

    @IsDate()
    createdAt: Date;

    @IsDecimal()
    totalAmount: Decimal;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderDto)
    orders: OrderDto[];

    @ValidateNested()
    @Type(() => UserDto)
    user: UserDto;
}

export class OrderDto {
    @IsDate()
    createdAt: Date;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    orderItems: OrderItemDto[];
}

export class UserDto {
    @IsString()
    id: string;

    @IsString()
    email: string;
}

export class OrderItemDto {
    @IsString()
    id: string;

    @IsString()
    orderId: string;

    @IsString()
    productId: string;

    @IsNumber()
    quantity: number;

    @ValidateNested()
    price: Decimal;

    @IsDate()
    createdAt: Date;
}
