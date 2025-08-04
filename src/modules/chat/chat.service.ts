import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { MessageType } from 'src/entities/message.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { PageMetaDto } from '../../common/dto';
import { ResponsePageDto } from '../../common/dto/response-page.dto';
import { Chat, ChatStatus } from '../../entities/chat.entity';
import { ChatMember, ChatRoles } from '../../entities/chatMember.entity';
import { User } from '../../entities/user.entity';
import { UserPayload } from '../auth/dto/user-payload.dto';
import { MessageService } from '../message/message.service';
import { ChatFilter } from './dto/chat.filter';
import { ChatMemberDto, CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { NotificationService } from '../notification/notification.service';
import { CreateNotificationDto } from '../notification/dto/create-notification.dto';
import { NotificationJobType } from 'src/common/utils/constant.util';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepo: Repository<Chat>,
    @InjectRepository(ChatMember)
    private chatMemberRepo: Repository<ChatMember>,
    private messageService: MessageService,
    private notificationService: NotificationService,
  ) {}

  async createService(createChatDto: CreateChatDto, user: UserPayload) {
    const { name, type, chatMembers, avatar, message } = createChatDto;

    return await this.chatRepo.manager.transaction(async (manager) => {
      const chat = this.chatRepo.create({
        name,
        type,
        userIds: chatMembers.map((chatMember) => chatMember.userId),
        avatar: avatar ?? `https://i.pravatar.cc/150?u=${uuidv4()}`,
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

      if (message) {
        const msg = {
          content: message.content,
          chatId: savedChat.id,
          user: user,
          createdAt: new Date(),
          type: message.type,
        };

        await this.messageService.create(msg, manager);
      }

      const getChat = await manager.findOne(Chat, {
        where: { id: savedChat.id },
        relations: ['chatMembers', 'messages', 'lastMessage'],
      });

      const notification: CreateNotificationDto<Partial<Chat>> = {
        data: {
          id: getChat.id,
          name: getChat.name,
          avatar: getChat.avatar,
        },
        message: `${user.fullName} đã tạo nhóm ${getChat.name}`,
        type: NotificationJobType.GROUP_CREATED,
        actor: user.fullName,
        target: `Nhóm ${getChat.name}`,
        receiverIds: chatMembers.map((chatMember) => chatMember.userId),
      };

      await this.notificationService.create({
        ...notification,
      });

      return getChat;
    });
  }

  async findAllService(filter: ChatFilter, id: string) {
    const queryBuilder = this.chatRepo.createQueryBuilder('chat');
    if (filter.search) {
      queryBuilder.andWhere('LOWER(chat.name) LIKE LOWER(:search)', {
        search: `%${filter.search}%`,
      });
    }

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
    const queryBuilder = this.chatMemberRepo.createQueryBuilder('ChatMember');

    const [conversations, conversationCount] = await queryBuilder
      .leftJoinAndSelect('ChatMember.chat', 'chat')
      .leftJoinAndSelect('chat.lastMessage', 'lastMessage')
      .leftJoinAndSelect('lastMessage.messageRead', 'messageRead')
      // .leftJoinAndSelect('messageRead.user', 'user')
      .where('ChatMember.user = :userId', { userId: user.id })
      .orderBy(`ChatMember.${filter.orderBy}`, filter.order)
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

  async getAllChatId(user: UserPayload) {
    const chatIds = await this.chatMemberRepo
      .createQueryBuilder('ChatMember')
      .select('ChatMember.chat_id', 'chatId')
      .where('ChatMember.user = :userId', { userId: user.id })
      .getRawMany();
    return chatIds.map((row) => row);
  }

  async getDetailChatService(id: string) {
    return await this.chatRepo.findOne({
      where: {
        id,
      },
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
          role: ChatRoles.MEMBER,
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
  async getRole(userId: string, chatId: string) {
    const chatMember = await this.chatMemberRepo.findOne({
      where: { user: { id: userId }, chat: { id: chatId } },
    });

    return chatMember?.role;
  }

  public async findPrivateChatBetweenUsers(id: string, user: UserPayload) {
    const chat = await this.chatRepo
      .createQueryBuilder('chat')
      .innerJoin('chat.chatMembers', 'cm1', 'cm1.user.id = :userId1', {
        userId1: user.id,
      })
      .innerJoin('chat.chatMembers', 'cm2', 'cm2.user.id = :userId2', {
        userId2: id,
      })
      .where('chat.type = :chatType', { chatType: ChatStatus.Pr })
      .getOne();

    return { chatId: chat?.id ?? null };
  }
}
