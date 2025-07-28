import { Test, TestingModule } from '@nestjs/testing';
import { MessageReadService } from './message-read.service';

describe('MessageReadService', () => {
  let service: MessageReadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageReadService],
    }).compile();

    service = module.get<MessageReadService>(MessageReadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
