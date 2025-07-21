import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat, ChatStatus } from '../../entities/chat.entity';
import { use } from 'passport';
import { ChatMember, ChatRoles } from '../../entities/chatMember.entity';
import { AuthService } from '../auth/auth.service';
import { AuthDto } from '../auth/dto/auth.dto';
import { ChatService } from '../chat/chat.service';
import { CreateChatDto } from '../chat/dto/create-chat.dto';
import { fakerDE as faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
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
      email: faker.internet.email(),
      password: `password${i + 1}`,
      fullName: faker.internet.displayName(),
      device_token: `token${i + 1}`,
      type: i % 2 === 0 ? 'android' : 'ios',
    }));

    await Promise.all(users.map((user) => this.authService.register(user)));
  }

  async createChatService(): Promise<any> {
    const users = await this.userRepo.find();
    const chats: CreateChatDto[] = Array.from({ length: 10 }, (_, i) => ({
      name: `${faker.internet.displayName({ firstName: 'Nhóm ' })}`,
      type: ChatStatus.Gr,
      avatar: `https://i.pravatar.cc/150?u=${uuidv4()}`,
      chatMembers: users.map((user, index) => ({
        userId: user.id,
        role: index === 3 ? ChatRoles.ADMIN : ChatRoles.MEMBER,
      })),
    }));

    const createPromises = chats.map((c) => this.chatService.createService(c));
    await Promise.all(createPromises);
  }
}
