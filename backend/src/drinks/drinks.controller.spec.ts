import { Test, TestingModule } from '@nestjs/testing';
import { DrinksController } from './drinks.controller';

describe('DrinksController', () => {
  let controller: DrinksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DrinksController],
    }).compile();

    controller = module.get<DrinksController>(DrinksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
