import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from '../../entities/chat.entity';
import { ChatMember } from '../../entities/chatMember.entity';
import { User } from '../../entities/user.entity';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Chat, ChatMember]),
    AuthModule,
    ChatModule,
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
