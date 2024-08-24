import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
import { MailService } from './mail/mail.service';
import { MailController } from './mail/mail.controller';
import { MailModule } from './mail/mail.module';
import { AccountRequestModule } from './account-request/account-request.module';
import { ProductsModule } from './product/products.module';
import { ProductsService } from './product/products.service';
import { LikeService } from './product/like.service';
import { DrinksModule } from './drinks/drinks.module';
import { PaymentModule } from './payment/payment.module';
import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';
import { PaypalModule } from './payment/paypal/paypal.module';
import { CronModule } from './cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        AuthModule,
        UserModule,
        PrismaModule,
        AdminModule,
        MailModule,
        AccountRequestModule,
        ProductsModule,
        DrinksModule,
        PaymentModule,
        OrderModule,
        CartModule,
        PaypalModule,
        CronModule,
        ScheduleModule.forRoot(),
    ],
    controllers: [AppController, MailController],
    providers: [AppService, MailService, ProductsService, LikeService],
})
export class AppModule {}
