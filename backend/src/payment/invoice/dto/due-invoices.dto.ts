import {
    IsString,
    IsDate,
    IsArray,
    ValidateNested,
    IsNumber,
    IsDecimal,
    IsOptional,
    IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';
export class ProductDto {
    @IsString()
    name: string;
}

export class OrderItemDto {
    @IsNumber()
    quantity: number;

    @IsDecimal()
    price: Decimal;

    @ValidateNested()
    @Type(() => ProductDto)
    product: ProductDto;
}

export class OrderDto {
    @IsDate()
    createdAt: Date;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    orderItems: OrderItemDto[];

    @IsString()
    id: string;
}

export class UserDto {
    @IsString()
    id: string;

    @IsString()
    email: string;

    @IsBoolean()
    @IsOptional()
    suspended?: boolean;
}

export class DueInvoiceDto {
    @IsString()
    id: string;

    @IsDate()
    dueDate: Date;

    @IsDate()
    @IsOptional()
    reminderDate?: Date;

    @IsBoolean()
    @IsOptional()
    reminderSent?: boolean;

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
