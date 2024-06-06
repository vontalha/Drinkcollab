import { PrismaService } from './../prisma/prisma.service';
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
    Req,
    Query,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';import { Response, Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AccountRequestService } from './account-request.service';
import { NoAuthGuard } from 'src/auth/no-auth.guard';
import { TokenExpiredError } from '@nestjs/jwt';

@Controller('account-request')
export class AccountRequestController {
    constructor(
        private accounRequestService: AccountRequestService,
    ){}

    /**
     * @param email  gets passed the email of the unauthorized user as string
     * uses email to create new accountRequestToken which expires after 1 day
     */
    @UseGuards(NoAuthGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async requestAccount(@Body("email") email:string): Promise<void>{
        this.accounRequestService.createRequestToken(email)
    }


    @Get("approved")
    @HttpCode(HttpStatus.CREATED)
    async createAccount(@Query("token") token: string, @Res() res: Response): Promise<void> {
        const existingToken = await this.accounRequestService.getRequestTokenByToken(token);
        if (!existingToken) {
            throw new NotFoundException("Invalid token!")
        }

        const hasExpired = new Date(existingToken.expires) < new Date();
        if (hasExpired) {
            throw new BadRequestException("Invitation link has expired!")
        }

        res.cookie('invite_token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        });
        res.redirect("/auth/signup");
    }
}
