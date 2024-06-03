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
import { LoginSchema } from './dto/login.dto'; 
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @HttpCode(HttpStatus.OK)
    // @UseGuards(JwtAuthGuard)
    @Post("login")
    @UsePipes(new ZodValidationPipe(LoginSchema))

    async login(@Body() login: LoginDto, @Res({passthrough: true}) res: Response): Promise<void>{
        const { access_token } = await this.authService.login(login.login, login.password)
        res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
        }).send({status: "ok"})
    }


    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req: any) {
      return req.user;
    }
}
