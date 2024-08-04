import { PrismaModule } from './../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthModule } from 'src/auth/auth.module';
import { AccountRequestModule } from 'src/account-request/account-request.module';
import { AccountRequestService } from 'src/account-request/account-request.service';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';
import { ProductsModule } from 'src/product/products.module';
import { ProductsService } from 'src/product/products.service';
import { FilterService } from 'src/product/filter.service';
import { UserService } from 'src/user/user.service';
@Module({
    providers: [
        AdminService,
        AccountRequestService,
        MailService,
        ProductsService,
        FilterService,
        UserService,
    ],
    controllers: [AdminController],
    imports: [
        PrismaModule,
        AuthModule,
        AccountRequestModule,
        MailModule,
        ProductsModule,
    ],
})
export class AdminModule {}
