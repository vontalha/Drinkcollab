import { IsNotEmpty, IsString } from 'class-validator';

export class LikeProductDto {
	@IsNotEmpty()
	@IsString()
	userId: string;

	@IsNotEmpty()
	@IsString()	
	productId: string;
}
