import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product, Category, ProductType } from '@prisma/client';
import { AddProductDto, UpdateProductDto } from './dto/product.dto';
import { FilterDto } from 'src/dto/filter.dto';

@Injectable()
export class FilterService {
    constructor(private prismaService: PrismaService) {}

    buildWhereConditions = async (filterDto: FilterDto): Promise<any> =>{
        const whereConditions: any = {};
    
        if (filterDto.brand) {
          whereConditions.brand = { contains: filterDto.brand, mode: 'insensitive' };
        }
    
        if (filterDto.description) {
          whereConditions.description = { contains: filterDto.description, mode: 'insensitive' };
        }
    
        if (filterDto.priceMin !== undefined || filterDto.priceMax !== undefined) {
          whereConditions.price = {};
          if (filterDto.priceMin !== undefined) {
            whereConditions.price.gte = filterDto.priceMin;
          }
          if (filterDto.priceMax !== undefined) {
            whereConditions.price.lte = filterDto.priceMax;
          }
        }
    
        if (filterDto.category) {
          const category = await this.prismaService.category.findUnique({
            where: { name: filterDto.category },
          });
    
          if (!category) {
            throw new NotFoundException(`Category with name "${filterDto.category}" not found`);
          }
    
          whereConditions.categoryId = category.id;
        }
    
        if (filterDto.type) {
          whereConditions.type = filterDto.type;
        }
    
        if (filterDto.stock !== undefined) {
          whereConditions.stock = { gte: filterDto.stock };
        }
    
        return whereConditions;
      }

}