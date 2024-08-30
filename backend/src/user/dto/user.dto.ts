import { IsString, IsOptional, IsIn } from 'class-validator';

export class UserDto {
    id?: string;
    image?: string;
    email?: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    createdAt?: Date;
    updatedAt?: Date | null;
    suspended?: boolean;
}
export class SearchUserDto {
    email?: string;
    role?: string;
    firstName?: string;
    lastName?: string;
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
