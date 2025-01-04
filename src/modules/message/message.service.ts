import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message, StatusMessage } from '../../entities/message.entity';
import { Repository } from 'typeorm';
import { Chat } from '../../entities/chat.entity';
import { User } from '../../entities/user.entity';
import { UsersService } from '../users/users.service';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
    private readonly userService: UsersService,
    private readonly chatService: ChatService,
  ) {}
  async createService(createMessageDto: CreateMessageDto) {
    const { chatId, userId, ...res } = createMessageDto;

    const chat = await this.chatService.findService(chatId);
    if (!chat) return new NotFoundException('Chat not found');

    const user = await this.userService.findUserByIdService(userId);
    if (!user) return new NotFoundException('User not found');

    const message = this.messageRepo.create({
      ...res,
      user,
      chat,
      status: StatusMessage.Sent,
    });
    return this.messageRepo.save(message);
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
