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
    Request as Req
} from '@nestjs/common';import { Response, Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AccountRequestService } from './account-request.service';
import { NoAuthGuard } from 'src/auth/no-auth.guard';

@Controller('account-request')
export class AccountRequestController {
    constructor(
        private accounRequestService: AccountRequestService 
    ){}

    @UseGuards(NoAuthGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async requestAccount(@Body("email") email:string): Promise<void>{
        this.accounRequestService.createRequestToken(email)
    }
}
