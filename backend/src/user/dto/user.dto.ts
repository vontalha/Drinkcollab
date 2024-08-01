import { IsString, IsOptional, IsIn } from 'class-validator';

export class UserDto {
    image?: string;
    email?: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    createdAt?: Date;
    updatedAt?: Date | null;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsIn(['ADMIN', 'USER'])
    role?: 'ADMIN' | 'USER';
}
