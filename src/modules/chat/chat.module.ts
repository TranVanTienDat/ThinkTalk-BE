import { forwardRef, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from '../../entities/chat.entity';
import { ChatMember } from '../../entities/chatMember.entity';
import { UsersModule } from '../users/users.module';
import { ChatWebsocketGateway } from './chat.gateway';
import { MessageModule } from '../message/message.module';
import { MessageReadModule } from '../message-read/message-read.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, ChatMember]),
    forwardRef(() => UsersModule),
    MessageModule,
    MessageReadModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatWebsocketGateway],
  exports: [ChatService],
})
export class ChatModule {}
