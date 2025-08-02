import { Test, TestingModule } from '@nestjs/testing';
import { CacheCustomService } from './cache-custom.service';

describe('CacheCustomService', () => {
  let service: CacheCustomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheCustomService],
    }).compile();

    service = module.get<CacheCustomService>(CacheCustomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
