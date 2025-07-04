import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { EntityManager, Repository } from 'typeorm';
import {
  MessageStatus,
  StatusMessage,
} from 'src/entities/messageStatus.entity';
import { Chat } from 'src/entities/chat.entity';

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
      user: { id: savedMessage.senderId },
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

  findAll() {
    return `This action returns all message`;
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
