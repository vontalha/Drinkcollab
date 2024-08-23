import { IsNotEmpty, IsString, IsInt, IsIn } from 'class-validator';

export class UpdateCartItemDto {
    @IsNotEmpty()
    @IsInt()
    quantity: number;

    @IsNotEmpty()
    @IsString()
    productId: string;

    @IsNotEmpty()
    @IsString()
    cartId: string;

    @IsIn(['increment', 'decrement'])
    action: 'increment' | 'decrement';
}
