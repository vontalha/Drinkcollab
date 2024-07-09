import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsOptional,
    IsIn,
} from 'class-validator';

export class AddProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    image: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsOptional()
    @IsNumber()
    size: number;

    @IsOptional()
    @IsNumber()
    stock: number;

    @IsNotEmpty()
    @IsString()
    categoryName: string;

    @IsNotEmpty()
    @IsIn(['DRINK', 'SNACK'])
    type: 'DRINK' | 'SNACK';
}

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsNumber()
    size?: number;

    @IsOptional()
    @IsNumber()
    stock?: number;

    @IsOptional()
    @IsString()
    categoryName?: string;

    @IsOptional()
    @IsIn(['DRINK', 'SNACK'])
    type?: 'DRINK' | 'SNACK';
}
