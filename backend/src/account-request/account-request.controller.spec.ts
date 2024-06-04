import { Test, TestingModule } from '@nestjs/testing';
import { AccountRequestController } from './account-request.controller';

describe('AccountRequestController', () => {
  let controller: AccountRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountRequestController],
    }).compile();

    controller = module.get<AccountRequestController>(AccountRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
