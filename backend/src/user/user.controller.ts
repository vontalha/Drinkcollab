import { Controller, Get, UseGuards, Request as Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { User } from '@prisma/client';
import { UserRole } from '@prisma/client';

type UserInfo = {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    role: UserRole;
    image: string | null;
};

@Controller('user')
export class UserController {
    constructor() {}

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getUser(@Req() req: Request): Promise<UserInfo> {
        const user = req.user as User;
        return {
            id: user.id,
            image: user.image,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
        };
    }
}
