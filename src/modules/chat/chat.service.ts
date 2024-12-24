import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../../entities/chat.entity';
import { ChatMember, ChatRole } from '../../entities/chatMember.entity';
import { User } from '../../entities/user.entity';
import { UsersService } from '../users/users.service';
import { ChatMemberDto, CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { UserPayload } from '../auth/dto/user-payload.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepo: Repository<Chat>,
    @InjectRepository(ChatMember)
    private chatMemberRepo: Repository<ChatMember>,
    private userService: UsersService,
  ) {}

  async createService(createChatDto: CreateChatDto) {
    const { name, type, chatMembers } = createChatDto;

    const chat = this.chatRepo.create({
      name,
      type,
      createdAt: new Date(),
    });
    const savedChat = await this.chatRepo.save(chat);

    const members = chatMembers.map((member: ChatMemberDto) => {
      const chatMember = new ChatMember();
      chatMember.user = { id: member.userId } as User;
      chatMember.chat = { id: savedChat.id } as Chat;
      chatMember.role = member.role;
      chatMember.createdAt = new Date();
      return chatMember;
    });

    await this.chatMemberRepo.manager.transaction(async (manager) => {
      await manager
        .createQueryBuilder()
        .insert()
        .into(ChatMember)
        .values(members)
        .execute();
    });

    return await this.chatRepo.findOne({
      where: { id: savedChat.id },
      relations: {
        chatMembers: true,
      },
    });
  }

  getChatByUserService(user: UserPayload) {
    return this.chatMemberRepo.find({
      where: { user },
      relations: {
        chat: true,
      },
      withDeleted: false,
    });
  }

  async getConverseService(id: string) {
    return await this.chatRepo.findOne({
      where: { id },
      relations: {
        chatMembers: true,
      },
      withDeleted: false,
    });
  }

  async updateService(id: string, updateChatDto: UpdateChatDto) {
    return await this.chatRepo.update(id, { ...updateChatDto });
  }

  async removeChatService(id: string) {
    const chat = await this.chatRepo.findOneBy({ id });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    return await this.chatRepo.softDelete(id);
  }

  async addMembersService(userIds: string[], chatId: string) {
    const chat = await this.chatRepo.findOneBy({ id: chatId });

    if (!chat) {
      throw new Error('Chat not found');
    }

    const chatMembers = userIds.map((userId) => {
      const chatMember = this.chatMemberRepo.create({
        user: { id: userId } as User,
        chat,
        role: ChatRole.MEMBER,
      });
      return chatMember;
    });

    return await this.chatMemberRepo.save(chatMembers);
  }

  async removeMemberService(userId: string, chatId: string) {
    const chatMember = await this.chatMemberRepo.findOne({
      where: { user: { id: userId }, chat: { id: chatId } },
    });

    if (!chatMember) {
      throw new Error('Chat member not found');
    }

    return await this.chatMemberRepo.remove(chatMember);
  }
  async isAdminChat(userId: string, chatId: string) {
    const chatMember = await this.chatMemberRepo.findOne({
      where: { user: { id: userId }, chat: { id: chatId } },
    });

    return chatMember?.role === ChatRole.ADMIN;
  }
}
