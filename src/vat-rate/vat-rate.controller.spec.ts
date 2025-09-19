import { Test, TestingModule } from '@nestjs/testing';
import { VatRateController } from './vat-rate.controller';
import { VatRateService } from './vat-rate.service';

describe('VatRateController', () => {
  let controller: VatRateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VatRateController],
      providers: [VatRateService],
    }).compile();

    controller = module.get<VatRateController>(VatRateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
