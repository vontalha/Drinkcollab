import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/role.guard';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, AdminModule],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
