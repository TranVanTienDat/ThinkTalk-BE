import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat, ChatStatus } from '../../entities/chat.entity';
import { use } from 'passport';
import { ChatMember, ChatRole } from '../../entities/chatMember.entity';
import { AuthService } from '../auth/auth.service';
import { AuthDto } from '../auth/dto/auth.dto';
import { ChatService } from '../chat/chat.service';
import { CreateChatDto } from '../chat/dto/create-chat.dto';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Chat)
    private readonly chatRepo: Repository<Chat>,
    private readonly authService: AuthService,
    private readonly chatService: ChatService,
  ) {}

  async createUserService(): Promise<any> {
    const users = Array.from({ length: 10 }, (_, i) => ({
      email: `user${i + 1}@example.com`,
      password: `password${i + 1}`,
      fullName: `User ${i + 1}`,
      device_token: `token${i + 1}`,
      type: i % 2 === 0 ? 'android' : 'ios',
    }));

    await Promise.all(users.map((user) => this.authService.register(user)));
  }

  async createChatService(): Promise<any> {
    const users = await this.userRepo.find();
    const chats: CreateChatDto[] = Array.from({ length: 10 }, (_, i) => ({
      name: `Chat Group ${i + 1}`,
      type: ChatStatus.Gr,
      createdAt: new Date(),
      chatMembers: users.map((user, index) => ({
        userId: user.id,
        role: index === 3 ? ChatRole.ADMIN : ChatRole.MEMBER,
      })),
    }));

    const createPromises = chats.map((c) => this.chatService.createService(c));
    await Promise.all(createPromises);
  }
}
