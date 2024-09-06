import { Module } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [PrismaModule, HttpModule],
    providers: [PaypalService],
    exports: [PaypalService],
})
export class PaypalModule {}
