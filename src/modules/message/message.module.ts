import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../../entities/message.entity';
import { ChatModule } from '../chat/chat.module';
import { UsersModule } from '../users/users.module';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), ChatModule, UsersModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
