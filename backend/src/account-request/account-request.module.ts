import { Module } from '@nestjs/common';
import { AccountRequestController } from './account-request.controller';
import { AccountRequestService } from './account-request.service';
import { MailModule } from 'src/mail/mail.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';

@Module({
    imports: [MailModule, PrismaModule],
    controllers: [AccountRequestController],
    providers: [AccountRequestService, PrismaService, MailService],
})
export class AccountRequestModule {}
