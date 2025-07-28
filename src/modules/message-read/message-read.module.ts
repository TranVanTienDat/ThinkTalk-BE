import { Module } from '@nestjs/common';
import { MessageReadService } from './message-read.service';
import { MessageReadController } from './message-read.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageRead } from 'src/entities/messageRead.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MessageRead])],
  controllers: [MessageReadController],
  providers: [MessageReadService],
  exports: [MessageReadService],
})
export class MessageReadModule {}
