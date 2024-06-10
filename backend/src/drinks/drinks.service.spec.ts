import { Test, TestingModule } from '@nestjs/testing';
import { DrinksService } from './drinks.service';

describe('DrinksService', () => {
  let service: DrinksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DrinksService],
    }).compile();

    service = module.get<DrinksService>(DrinksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
