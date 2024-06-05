import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { NoAuthGuard } from './no-auth.guard';

@Module({
  imports: [
    UserModule,
    PassportModule, 
    PrismaModule, 
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: "1d"}
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, NoAuthGuard]
})
export class AuthModule {}
