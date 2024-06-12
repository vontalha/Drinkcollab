import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikeService {
    constructor(private prismaService: PrismaService) {}

    likeProduct = async (userId: string, productId: string): Promise<void> => {
        await this.prismaService.like.create({
            data: { userId, productId }
        })
    }
}