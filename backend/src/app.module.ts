import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/role.guard';
import { MailService } from './mail/mail.service';
import { MailController } from './mail/mail.controller';
import { MailModule } from './mail/mail.module';
import { AccountRequestModule } from './account-request/account-request.module';
import { ProductModule } from './product/product.module';
import { ProductService } from './product/product.service';
import { LikeService } from './product/like.service';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, AdminModule, MailModule, AccountRequestModule, ProductModule],
  controllers: [AppController, MailController],
  providers: [
    AppService,
    MailService,
    ProductService,
    LikeService
  ],
})
export class AppModule {}
