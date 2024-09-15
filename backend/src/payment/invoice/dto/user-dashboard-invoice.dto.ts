import {
    IsString,
    IsDate,
    IsEnum,
    IsNumber,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InvoiceStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

class ProductDto {
    @IsString()
    name: string;

    @IsString()
    image: string;
}

class OrderItemDto {
    @IsNumber()
    quantity: number;

    @IsNumber()
    price: Decimal;

    @ValidateNested()
    @Type(() => ProductDto)
    product: ProductDto;
}

class OrderDto {
    @IsString()
    id: string;

    @IsDate()
    createdAt: Date;

    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    orderItems: OrderItemDto[];
}

export class InvoiceUserDashboardDto {
    @IsString()
    id: string;

    @IsDate()
    dueDate: Date;

    @IsDate()
    createdAt: Date;

    @IsNumber()
    totalAmount: Decimal;

    @IsEnum(InvoiceStatus)
    status: InvoiceStatus;

    @ValidateNested({ each: true })
    @Type(() => OrderDto)
    orders: OrderDto[];
}
