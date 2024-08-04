import { IsString } from 'class-validator';

export class SearchProductDto {
    @IsString()
    query: string;
}
