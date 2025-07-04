import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { MessageType } from 'src/entities/message.entity';
import { Repository } from 'typeorm';
import { PageMetaDto } from '../../common/dto';
import { ResponsePageDto } from '../../common/dto/response-page.dto';
import { Chat } from '../../entities/chat.entity';
import { ChatMember, ChatRole } from '../../entities/chatMember.entity';
import { User } from '../../entities/user.entity';
import { UserPayload } from '../auth/dto/user-payload.dto';
import { MessageService } from '../message/message.service';
import { UsersService } from '../users/users.service';
import { ChatFilter } from './dto/chat.filter';
import { ChatMemberDto, CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { StatusMessage } from 'src/entities/messageStatus.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepo: Repository<Chat>,
    @InjectRepository(ChatMember)
    private chatMemberRepo: Repository<ChatMember>,
    private userService: UsersService,
    private messageService: MessageService,
  ) {}

  async createService(createChatDto: CreateChatDto) {
    const { name, type, chatMembers } = createChatDto;

    return await this.chatRepo.manager.transaction(async (manager) => {
      const chat = this.chatRepo.create({
        name,
        type,
        userIds: chatMembers.map((chatMember) => chatMember.userId),
        createdAt: new Date(),
      });
      const savedChat = await manager.save(chat);

      const members = chatMembers.map((member: ChatMemberDto) => {
        const chatMember = new ChatMember();
        chatMember.user = { id: member.userId } as User;
        chatMember.chat = { id: savedChat.id } as Chat;
        chatMember.role = member.role;
        chatMember.createdAt = new Date();
        return chatMember;
      });
      await manager.insert(ChatMember, members);

      const userAdmin = chatMembers.filter(
        (member) => member.role === ChatRole.ADMIN,
      )[0];

      const msg = {
        content: `Tạo thành công nhóm ${savedChat.name}`,
        userId: userAdmin.userId,
        chatId: savedChat.id,
        createdAt: new Date(),
        type: MessageType.SYSTEM,
        status: StatusMessage.Sent,
      };

      await this.messageService.create(msg, manager);

      return await manager.findOne(Chat, {
        where: { id: savedChat.id },
        relations: ['chatMembers', 'messages', 'lastMessage'],
      });
    });
  }

  async findAllService(filter: ChatFilter, id: string) {
    const queryBuilder = this.chatRepo.createQueryBuilder('chat');
    if (filter.search) {
      queryBuilder.andWhere('LOWER(chat.name) LIKE LOWER(:search)', {
        search: `%${filter.search}%`,
      });
    }
    // if (id) {
    //   queryBuilder.andWhere('LOWER(chat.) LIKE LOWER(:search)', {
    //     search: `%${filter.i}%`,
    //   });
    // }

    const [chats, chatCount] = await queryBuilder
      .orderBy(`object_configs.${filter.orderBy}`, filter.order)
      .skip(filter.skip)
      .take(filter.limit)
      .setFindOptions({ withDeleted: false })
      .getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      pageDto: filter.pageDto,
      total: chatCount,
    });

    return new ResponsePageDto(
      chats.map((e) => plainToInstance(Chat, e)),
      pageMetaDto,
    );
  }

  async getChatByUserService(filter: ChatFilter, user: UserPayload) {
    const queryBuilder = this.chatRepo.createQueryBuilder('ChatMember');

    const [conversations, conversationCount] = await this.chatMemberRepo
      .createQueryBuilder('ChatMember')
      .leftJoinAndSelect('ChatMember.chat', 'chat')
      // .leftJoinAndSelect('chat.lastMessage', 'lastMessage')
      // .leftJoinAndSelect('lastMessage.messageStatus', 'messageStatus')
      // .leftJoinAndSelect('messageStatus.user', 'user')
      .where('ChatMember.user = :userId', { userId: user.id })
      .skip(filter.skip)
      .take(filter.limit)
      .getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      pageDto: filter.pageDto,
      total: conversationCount,
    });

    return new ResponsePageDto(
      conversations.map((c) => c.chat),
      pageMetaDto,
    );
  }

  async getDetailChatService(id: string) {
    return await this.chatRepo.findOne({
      where: {
        id,
      },
    });
  }

  async getConverseService(id: string) {
    console.log('id', id);
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

  async addMembersService(users: string[], chatId: string) {
    const chat = await this.chatRepo.findOneBy({ id: chatId });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    await this.chatMemberRepo.manager.transaction(async (manager) => {
      chat.userIds = [...chat.userIds, ...users];
      await manager.save(chat);

      const chatMembers = users.map((userId) => {
        return manager.create(this.chatMemberRepo.target, {
          user: { id: userId } as User,
          chat,
          role: ChatRole.MEMBER,
        });
      });

      await manager.save(this.chatMemberRepo.target, chatMembers);
    });
  }

  async removeMemberService(userId: string, chatId: string) {
    const chatMember = await this.chatMemberRepo.findOne({
      where: { user: { id: userId }, chat: { id: chatId } },
    });

    if (!chatMember) {
      throw new Error('Chat member not found');
    }

    const chat = await this.getConverseService(chatId);

    await this.chatMemberRepo.manager.transaction(async (manager) => {
      chat.userIds = chat.userIds.filter((item) => item !== userId);
      await this.chatRepo.update(chat.id, { userIds: chat.userIds });

      await this.chatMemberRepo.remove(chatMember);
    });
  }
  async isAdminChat(userId: string, chatId: string) {
    const chatMember = await this.chatMemberRepo.findOne({
      where: { user: { id: userId }, chat: { id: chatId } },
    });

    return chatMember?.role === ChatRole.ADMIN;
  }
}
