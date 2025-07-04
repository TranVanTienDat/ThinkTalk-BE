import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { MessageStatus } from 'src/entities/messageStatus.entity';
import { Chat } from 'src/entities/chat.entity';
import { ChatService } from '../chat/chat.service';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message, MessageStatus, Chat])],
  providers: [MessageGateway, MessageService],
  exports: [MessageService],
})
export class MessageModule {}
