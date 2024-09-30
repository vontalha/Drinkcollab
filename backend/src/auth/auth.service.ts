import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { SignupDto } from './dto/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private prismaService: PrismaService,
    ) {}

    login = async (
        email: string,
        password: string,
    ): Promise<{ access_token: string; userId: string; role: UserRole }> => {
        const user = await this.userService.getUserByEmail(email);

        if (!user) {
            throw new NotFoundException('User does not exist!');
        }

        const passwordValid = await bcrypt.compare(password, user.password);

        if (!passwordValid) {
            throw new UnauthorizedException('Invalid credentials!');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const access_token = await this.jwtService.signAsync(payload);

        return { access_token, userId: user.id, role: user.role };
    };

    signup = async (
        credentials: SignupDto,
        email: string,
    ): Promise<AuthEntity> => {
        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        const lowercaseEmail = email.toLowerCase();
        const lowercaseFirstName = credentials.firstName.toLowerCase();
        const lowercaseLastName = credentials.lastName.toLowerCase();

        // const existingUser = await this.userService.getUserByEmail(email);
        //
        // if (existingUser) {
        //     throw new ConflictException('Email already in use!');
        // }

        const newUser = await this.prismaService.user.create({
            data: {
                firstName: lowercaseFirstName,
                lastName: lowercaseLastName,
                email: lowercaseEmail,
                password: hashedPassword,
                role: 'USER',
            },
        });

        const shoppingCart = await this.prismaService.shoppingCart.create({
            data: {
                userId: newUser.id,
            },
        });

        const payload = {
            sub: newUser.id,
            email: newUser.email,
            role: newUser.role,
            shoppingCartId: shoppingCart.id,
        };

        const access_token = await this.jwtService.signAsync(payload);

        return { access_token };
    };
}
