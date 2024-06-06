import { PrismaService } from './../prisma/prisma.service';
import { AccountRequestService } from 'src/account-request/account-request.service';
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Res,
    UseGuards,
    UsePipes,
    Request as Req,
    NotFoundException
} from '@nestjs/common';import { Response, Request } from 'express';
import { LoginSchema } from './dto/login.dto'; 
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto, SignupSchema } from './dto/signup.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { NoAuthGuard } from './no-auth.guard';
import { InviteGuard } from './invite.guard';


@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService, 
        private accountRequestService: AccountRequestService, 
        private prismaService: PrismaService
    ){}

    @HttpCode(HttpStatus.OK)
    // @UseGuards(JwtAuthGuard)
    @UseGuards(NoAuthGuard)
    @UsePipes(new ZodValidationPipe(LoginSchema))
    @Post("login")
    async login(@Body() login: LoginDto, @Res({passthrough: true}) res: Response): Promise<void>{
        const { access_token } = await this.authService.login(login.login, login.password)
        res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
        }).send({status: "ok"})
    }

    // @UseGuards(JwtAuthGuard)
    // @UseGuards(JwtAuthGuard)
    //profile endpunkt nur zu testzwecken
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ZodValidationPipe(SignupSchema))
    @Post('profile')
    getProfile(@Body() credentials: SignupDto): {status: HttpStatus.OK, message: SignupDto} {
    //   return req.user;
        return {
            status: HttpStatus.OK,
            message: credentials
        }
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(InviteGuard)
    @UsePipes(new ZodValidationPipe(SignupSchema))
    @Post("signup")
    async signup(
        @Body() credentials: SignupDto, 
        @Res({passthrough: true}) res: Response,
        @Req() req: Request,
        ): Promise<void>{

        const invite_token = req.cookies["invite_token"];
        
        const existingToken = await this.accountRequestService.getRequestTokenByToken(invite_token);

        if (!existingToken) {
            throw new NotFoundException("Token does not exist!");
        }

        if (existingToken.email !== credentials.email ) {
            throw new NotFoundException("The signup email must match the account request email!");
        }

        const { access_token } = await this.authService.signup(credentials);

        await this.prismaService.requestToken.delete({
            where: { token: existingToken.token }
        })

        res.cookie("invite_token", "", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            expires: new Date(0)
        })

        res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
        })
        .send({status: "ok"})
        .redirect("/auth/profile")
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Res({ passthrough: true }) res: Response): Promise<void> {
        res.cookie('access_token', '', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            expires: new Date(0), 
        });
        res.send({ status: 'logged out' });
    }
}
