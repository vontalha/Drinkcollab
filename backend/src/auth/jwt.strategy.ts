import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt"){

    constructor (private userService: UserService){
        super ({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy.extractJWTFromCookie,
            ]),
            ignoreExiration:false,
            secretOrKey: process.env.JWT_SECRET
        });
    }

    private static extractJWTFromCookie = (req: Request): string | null => {
        if (req.cookies && req.cookies.access_token) {
          return req.cookies.access_token;
        }
        return null;
      }

    validate = async (payload: { sub: string }) => {
        const user =  await this.userService.getUserById(payload.sub);

        if (!user) {
            throw new UnauthorizedException();
        }

        console.log('Validated user:', user); 

        return user;
    }
}