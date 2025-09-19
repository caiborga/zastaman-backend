import { Test, TestingModule } from '@nestjs/testing';
import { VatRateService } from './vat-rate.service';

describe('VatRateService', () => {
  let service: VatRateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VatRateService],
    }).compile();

    service = module.get<VatRateService>(VatRateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
