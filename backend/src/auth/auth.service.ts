import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from "bcryptjs"
import { SignupDto } from './dto/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';



@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService, 
        private userService: UserService,
        private prismaService: PrismaService
    ){}

    login = async (
        login: string,
        password: string
    ): Promise<AuthEntity> => {

        const user = await this.userService.getUserByLogin(login)
        
        if (!user) {
            throw new NotFoundException("User does not exist!")
        }

        const passwordValid = await bcrypt.compare(password, user.password)

        if (!passwordValid) {
            throw new UnauthorizedException("Invalid credentials!")
        }

        const payload = { 
            sub: user.id, 
            username: user.name, 
            email: user.email, 
            role: user.role 
        }
        const access_token = await this.jwtService.signAsync(payload)

        return { access_token }
    }


    signup = async (credentials: SignupDto): Promise<AuthEntity> => {
        
        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        const lowercaseUsername = credentials.username.toLowerCase();
        const lowercaseEmail = credentials.email.toLowerCase();

        const existingUser = await this.userService.getUserByEmail(lowercaseEmail);

        if (existingUser) {
            throw new ConflictException("Email already in use!")
        }

        const newUser = await this.prismaService.user.create({
            data: {
                name: lowercaseUsername,
                email: lowercaseEmail,
                password: hashedPassword,
                role: "USER"
            }
        })

        const payload = { 
            sub: newUser.id, 
            username: newUser.name, 
            email: newUser.email, 
            role: newUser.role 
        };

        const access_token = await this.jwtService.signAsync(payload)

        return { access_token }
    }

}
