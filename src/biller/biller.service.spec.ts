import { Test, TestingModule } from '@nestjs/testing';
import { BillerService } from './biller.service';

describe('BillerService', () => {
  let service: BillerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillerService],
    }).compile();

    service = module.get<BillerService>(BillerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
