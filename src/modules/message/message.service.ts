import { Injectable } from '@nestjs/common';
import { UpdateMessageDto } from './dto/update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message, MessageType } from 'src/entities/message.entity';
import { EntityManager, Repository } from 'typeorm';
import {
  MessageStatus,
  StatusMessage,
} from 'src/entities/messageStatus.entity';
import { Chat } from 'src/entities/chat.entity';
import { MessageFilter } from './dto/filter.dto';
import { CreateMessageDto } from './dto/create.dto';
import { ResponsePageDto } from 'src/common/dto/response-page.dto';
import { PageMetaDto } from 'src/common/dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    // private readonly messageStatusRepo: Repository<MessageStatus>,
    // private readonly chatRepo: Repository<Chat>,
  ) {}

  async create(
    dto: CreateMessageDto,
    manager?: EntityManager,
  ): Promise<Message> {
    const runInManager = manager ?? this.messageRepo.manager;

    const message = runInManager.create(Message, dto);
    const savedMessage = await runInManager.save(Message, message);
    console.log('savedMessage', savedMessage);
    const messageStatus = runInManager.create(MessageStatus, {
      message: savedMessage,
      user:
        message.type !== MessageType.SYSTEM
          ? { id: savedMessage.senderId }
          : null,
      status: dto.status,
    });
    await runInManager.save(MessageStatus, messageStatus);

    await runInManager.update(Chat, savedMessage.chatId, {
      lastMessage: savedMessage,
    });

    return await runInManager.findOne(Message, {
      where: { id: savedMessage.id },
      relations: ['messageStatus'],
    });
  }

  async findByConversation(id: string, filter: MessageFilter) {
    console.log('filter', filter);
    const queryBuilder = this.messageRepo.createQueryBuilder('message');

    const [data, total] = await queryBuilder
      .leftJoinAndSelect('message.chat', 'chat')
      .leftJoinAndSelect('message.user', 'user')
      .where('message.chatId = :chatId', { chatId: id })
      .orderBy(`message.${filter.orderBy}`, filter.order)
      .skip(filter.skip)
      .take(filter.limit)
      .getManyAndCount();

    const page = new PageMetaDto({ pageDto: filter.pageDto, total });
    return new ResponsePageDto(plainToInstance(Message, data), page);
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
