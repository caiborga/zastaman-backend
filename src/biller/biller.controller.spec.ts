import { Test, TestingModule } from '@nestjs/testing';
import { BillerController } from './biller.controller';
import { BillerService } from './biller.service';

describe('BillerController', () => {
  let controller: BillerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillerController],
      providers: [BillerService],
    }).compile();

    controller = module.get<BillerController>(BillerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
