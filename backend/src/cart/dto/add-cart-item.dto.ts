import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class AddCartItemDto {
    @IsNotEmpty()
    @IsInt()
    quantity: number;

    @IsNotEmpty()
    @IsString()
    productId: string;
}
