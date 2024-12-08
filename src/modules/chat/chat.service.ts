import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatMemberDto, CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMember, ChatRole } from '../../entities/chatMember.entity';
import { User } from '../../entities/user.entity';
import { Chat } from '../../entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(ChatMember)
    private chatMemberRepository: Repository<ChatMember>,
  ) {}

  async create(createChatDto: CreateChatDto) {
    const { name, type, chatMembers } = createChatDto;

    const chat = this.chatRepository.create({
      name,
      type,
      createdAt: new Date(),
    });
    const savedChat = await this.chatRepository.save(chat);

    const members = chatMembers.map((member: ChatMemberDto) => {
      return this.chatMemberRepository.create({
        user: { id: member.userId },
        chat: savedChat,
        role: member.role,
        createdAt: new Date(),
      });
    });

    await this.chatMemberRepository.save(members);

    return this.chatRepository.findOne({
      where: { id: savedChat.id },
      relations: ['chatMembers'],
    });
  }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: string) {
    return `This action returns a #${id} chat`;
  }

  async update(id: string, updateChatDto: UpdateChatDto) {
    const chat = await this.chatRepository.findOneBy({ id });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    Object.assign(chat, updateChatDto);
    const updatedChat = await this.chatRepository.save(chat);
    return updatedChat;
  }

  async remove(id: string) {
    const chat = await this.chatRepository.findOneBy({ id });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    const updatedChat = await this.chatRepository.delete(chat);
    return updatedChat;
  }

  async addMembersToChat(
    userIds: string[],
    chatId: string,
    role: ChatRole = ChatRole.MEMBER,
  ) {
    const chat = await this.chatRepository.findOneBy({ id: chatId });

    if (!chat) {
      throw new Error('Chat not found');
    }

    const chatMembers = userIds.map((userId) => {
      const chatMember = this.chatMemberRepository.create({
        user: { id: userId } as User,
        chat,
        role,
      });
      return chatMember;
    });
    console.log('chatMembers', chatMembers);

    return await this.chatMemberRepository.save(chatMembers);
  }

  async removeMemberFromChat(userId: string, chatId: string) {
    const chatMember = await this.chatMemberRepository.findOne({
      where: { user: { id: userId }, chat: { id: chatId } },
    });

    if (!chatMember) {
      throw new Error('Chat member not found');
    }

    return await this.chatMemberRepository.remove(chatMember);
  }
}
