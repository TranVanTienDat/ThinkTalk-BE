import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat, ChatStatus } from '../../entities/chat.entity';
import { use } from 'passport';
import { ChatMember, ChatRole } from '../../entities/chatMember.entity';
import { AuthService } from '../auth/auth.service';
import { AuthDto } from '../auth/dto/auth.dto';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Chat)
    private readonly chatRepo: Repository<Chat>,
    private readonly authService: AuthService,
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
    const chats = Array.from({ length: 10 }, (_, i) => ({
      name: `Chat Group ${i + 1}`,
      type: 'group' as ChatStatus,
      createdAt: new Date(),
    }));

    const newChats = chats.map((c) => {
      const chat = new Chat();
      chat.name = c.name;
      chat.type = c.type;
      chat.createdAt = c.createdAt;
      return chat;
    });

    await this.chatRepo.manager.transaction(async (manager) => {
      const savedChats = await manager
        .createQueryBuilder()
        .insert()
        .into(Chat)
        .values(newChats)
        .execute();

      const chatMembers = savedChats.identifiers.flatMap((chat, index) => {
        return users.map((user, index) => {
          const chatMember = new ChatMember();
          chatMember.user = user;
          chatMember.chat = chat as Chat;
          chatMember.role = index !== 3 ? ChatRole.MEMBER : ChatRole.ADMIN;
          chatMember.createdAt = new Date();
          return chatMember;
        });
      });

      await manager
        .createQueryBuilder()
        .insert()
        .into(ChatMember)
        .values(chatMembers)
        .execute();
    });
  }
}
