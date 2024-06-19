import { IsOptional, IsString, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductType } from '@prisma/client';

export class FilterDto {
    @IsOptional()
    @IsString()
    brand?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(0)
    priceMin?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(0)
    priceMax?: number;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsEnum(ProductType)
    type?: ProductType;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(0)
    stock?: number;
}
