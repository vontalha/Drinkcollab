import { IsOptional, IsIn, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
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
    @IsIn(['sales', 'price', 'createdAt'])
    sortBy: string = 'sales';

    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder: 'asc' | 'desc' = 'desc';
}
