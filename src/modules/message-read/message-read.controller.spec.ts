import { Test, TestingModule } from '@nestjs/testing';
import { MessageReadController } from './message-read.controller';
import { MessageReadService } from './message-read.service';

describe('MessageReadController', () => {
  let controller: MessageReadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageReadController],
      providers: [MessageReadService],
    }).compile();

    controller = module.get<MessageReadController>(MessageReadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
