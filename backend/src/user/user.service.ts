import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {

    constructor(private prismaService: PrismaService){}

    getUserByEmail = async (email: string) => {
        const user = await this.prismaService.user.findUnique({
            where: { email }
        })
        return user
    }
    
    getUserById = async (id: string) => {
        const user = await this.prismaService.user.findUnique({
            where: { id }
        })
        return user
    }
}
