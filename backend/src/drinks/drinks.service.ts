import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddDrinkDto, UpdateDrinkDto } from './dto/drinks.dto';
import { Drink } from '@prisma/client';

@Injectable()
export class DrinksService {
    constructor(private prismaService: PrismaService){}

    addDrink = async (data: AddDrinkDto): Promise<Drink> => {
        return await this.prismaService.drink.create({ data })
    }

    getAllDrinks = async (): Promise<Drink[]> => {
        return await this.prismaService.drink.findMany()
    }

    getDrink = async (id: string): Promise<Drink> => {
        return await this.prismaService.drink.findUnique({ where: { id } })
    }

    updateDrink = async (id: string, data: UpdateDrinkDto): Promise<Drink> => {
        return await this.prismaService.drink.update({ where: { id }, data })
    }

    deleteDrink = async (id: string): Promise<void> => {
        await this.prismaService.drink.delete({ where: { id } })
    }

    getDrinkSales = async (id: string): Promise<number> => {
        const drink = await this.prismaService.drink.findUnique({ where: { id } })
        return drink.sales
    }

    getDrinksFilterCategory = async (filter: string): Promise<Drink[]> => {
        return await this.prismaService.drink.findMany({
            where: { category: filter }
        })
    }

    getDrinksOrderedByPrice = async (orderBy: "asc" | "desc"): Promise<Drink[]> => {
        return await this.prismaService.drink.findMany({
            orderBy: {
                price: orderBy
            }
        })
    }

    getDrinksOrderedBySales= async (): Promise<Drink[]> => {
        return await this.prismaService.drink.findMany({
            orderBy: {
                sales: "desc"
            }
        })
    }
}
