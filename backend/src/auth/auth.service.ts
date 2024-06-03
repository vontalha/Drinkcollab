import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from "bcryptjs"


@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService, private userService: UserService){}

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
            throw new UnauthorizedException("Invalid password!")
        }

        const payload = { sub: user.id, username: user.name, email: user.email }
        const access_token = await this.jwtService.signAsync(payload)

        return { access_token }
    }


}
