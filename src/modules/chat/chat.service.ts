import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatMemberDto, CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from 'src/entities/chat.entity';
import { ChatMember, ChatRole } from 'src/entities/chatMember.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(ChatMember)
    private chatMemberRepository: Repository<ChatMember>,
  ) {}

  async create(createChatDto: CreateChatDto) {
    const { name, type, avatar, chatMembers } = createChatDto;

    const chat = this.chatRepository.create({
      name,
      type,
      avatar,
      created_at: new Date(),
    });
    const savedChat = await this.chatRepository.save(chat);

    const members = chatMembers.map((member: ChatMemberDto) => {
      return this.chatMemberRepository.create({
        user: { id: member.userId },
        chat: savedChat,
        role: member.role,
        created_at: new Date(),
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

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  async update(id: number, updateChatDto: UpdateChatDto) {
    const chat = await this.chatRepository.findOneBy({ id });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    Object.assign(chat, updateChatDto);
    const updatedChat = await this.chatRepository.save(chat);
    return updatedChat;
  }

  async remove(id: number) {
    const chat = await this.chatRepository.findOneBy({ id });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    const updatedChat = await this.chatRepository.delete(chat);
    return updatedChat;
  }

  async addMembersToChat(
    userIds: number[],
    chatId: number,
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

  async removeMemberFromChat(userId: number, chatId: number) {
    const chatMember = await this.chatMemberRepository.findOne({
      where: { user: { id: userId }, chat: { id: chatId } },
    });

    if (!chatMember) {
      throw new Error('Chat member not found');
    }

    return await this.chatMemberRepository.remove(chatMember);
  }
}
