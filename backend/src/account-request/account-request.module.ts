import { Module } from '@nestjs/common';
import { AccountRequestController } from './account-request.controller';
import { AccountRequestService } from './account-request.service';

@Module({
  controllers: [AccountRequestController],
  providers: [AccountRequestService]
})
export class AccountRequestModule {}
