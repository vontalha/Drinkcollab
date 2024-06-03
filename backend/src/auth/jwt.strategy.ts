import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt"){
    constructor (private userService: UserService){
        super ({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        });
    }

    validate = async (payload: { sub: string }) => {
        const user =  this.userService.getUserById(payload.sub);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}