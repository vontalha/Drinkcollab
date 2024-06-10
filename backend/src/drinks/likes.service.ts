import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
    constructor(private prismaService: PrismaService) {}

    likeDrink = async (userId: string, drinkId: string): Promise<void> => {
        await this.prismaService.like.create({
            data: { userId, drinkId }
        })
    }
}