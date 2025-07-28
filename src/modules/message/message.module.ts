import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { MessageRead } from 'src/entities/messageRead.entity';
import { Chat } from 'src/entities/chat.entity';
import { ChatService } from '../chat/chat.service';
import { ChatModule } from '../chat/chat.module';
import { MessageController } from './message.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Message, MessageRead, Chat])],
  providers: [MessageGateway, MessageService],
  exports: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
