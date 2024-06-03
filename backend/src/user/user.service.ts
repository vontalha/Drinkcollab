import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService){}

    getUserByEmail = async (email: string) => {
        const user = await this.prisma.user.findUnique({
            where: { email }
        })
        return user
    }
    
    getUserById = async (id: string) => {
        const user = await this.prisma.user.findUnique({
            where: { id }
        })
        return user
    }
    getUserByUsername = async (name: string) => {
        const user = await this.prisma.user.findUnique({
            where: { name }
        })
        return user
    }
    
    getUserByLogin = async (login: string) => {
        if (login.includes("@")){
            return await this.getUserByEmail(login)
        } 
        return await this.getUserByUsername(login)
    }
}
