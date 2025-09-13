import { Injectable } from '@nestjs/common';
import { UpdateMessageDto } from './dto/update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message, MessageType } from 'src/entities/message.entity';
import { EntityManager, Repository } from 'typeorm';
import { MessageRead, StatusMessage } from 'src/entities/messageRead.entity';
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
  ) {}

  async create(
    dto: CreateMessageDto,
    manager?: EntityManager,
  ): Promise<Message> {
    const runInManager = manager ?? this.messageRepo.manager;
    if (!manager) {
      return await this.messageRepo.manager.transaction(async (txManager) => {
        return this._createWithManager(dto, txManager);
      });
    }
    const message = manager.create(Message, dto);
    const savedMessage = await manager.save(Message, message);

    const messageStatus = manager.create(MessageRead, {
      message: savedMessage,
      user:
        message.type !== MessageType.SYSTEM
          ? { id: savedMessage.senderId }
          : null,
    });
    await manager.save(MessageRead, messageStatus);

    await manager.update(Chat, savedMessage.chatId, {
      lastMessage: savedMessage,
    });

    return await runInManager.findOne(Message, {
      where: { id: savedMessage.id },
      relations: ['chat', 'user', 'messageRead'],
    });
  }

  private async _createWithManager(
    dto: CreateMessageDto,
    manager: EntityManager,
  ): Promise<Message> {
    const message = manager.create(Message, dto);
    const savedMessage = await manager.save(Message, message);
    const messageStatus = manager.create(MessageRead, {
      message: savedMessage,
      user:
        message.type !== MessageType.SYSTEM
          ? { id: savedMessage.senderId }
          : null,
    });
    await manager.save(MessageRead, messageStatus);

    await manager.update(Chat, savedMessage.chatId, {
      lastMessage: savedMessage,
    });

    return await manager.findOne(Message, {
      where: { id: savedMessage.id },
      relations: ['chat', 'user', 'messageRead'],
    });
  }

  async findByConversation(id: string, filter: MessageFilter) {
    const queryBuilder = this.messageRepo.createQueryBuilder('message');
    const [data, total] = await queryBuilder
      .leftJoinAndSelect('message.chat', 'chat')
      .leftJoinAndSelect('message.user', 'user')
      .leftJoinAndSelect('message.messageRead', 'messageRead')
      .leftJoinAndSelect('messageRead.user', 'userRead')
      .where('message.chatId = :chatId', { chatId: id })
      .orderBy(`message.${filter.orderBy}`, filter.order)
      .skip(filter.skip)
      .take(filter.limit)
      .getManyAndCount();

    const page = new PageMetaDto({ pageDto: filter.pageDto, total });
    return new ResponsePageDto(plainToInstance(Message, data), page);
  }

  async findOne(id: string) {
    return await this.messageRepo.findOneBy({ id });
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
