import { IsOptional, IsIn, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationProductDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageSize: number = 20;

    @IsOptional()
    @IsIn(['sales', 'price', 'createdAt', 'stock'])
    sortBy: string = 'sales';

    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder: 'asc' | 'desc' = 'desc';
}

export class PaginationUserDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageSize: number = 20;

    @IsOptional()
    @IsIn(['createdAt', 'updatedAt'])
    sortBy: string = 'createdAt';

    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder: 'asc' | 'desc' = 'desc';
}

export class PaginationSearchDto {
    @IsString()
    query: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    pageSize: number = 20;
}
