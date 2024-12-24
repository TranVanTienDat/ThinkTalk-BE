import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from '../../entities/chat.entity';
import { ChatMember } from '../../entities/chatMember.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, ChatMember]), UsersModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
