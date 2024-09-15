import {
    IsString,
    IsDate,
    IsNumber,
    ValidateNested,
    IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
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

class PaymentDto {
    @IsEnum(PaymentMethod)
    method: PaymentMethod;

    @IsEnum(PaymentStatus)
    status: PaymentStatus;
}

export class DirectCheckoutOrderDto {
    @IsString()
    id: string;

    @IsDate()
    createdAt: Date;

    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    orderItems: OrderItemDto[];

    @ValidateNested()
    @Type(() => PaymentDto)
    payment: PaymentDto;
}
