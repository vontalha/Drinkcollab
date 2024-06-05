import { Module } from '@nestjs/common';
import { AccountRequestController } from './account-request.controller';
import { AccountRequestService } from './account-request.service';
import { AuthModule } from 'src/auth/auth.module';
import { MailModule } from 'src/mail/mail.module';
import { PrismaModule } from 'src/prisma/prisma.module';


@Module({
  imports: [AuthModule, MailModule, PrismaModule],
  controllers: [AccountRequestController],
  providers: [AccountRequestService]
})
export class AccountRequestModule {}
