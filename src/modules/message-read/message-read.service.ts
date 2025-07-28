import { Injectable } from '@nestjs/common';
import { CreateMessageReadDto } from './dto/create-message-read.dto';
import { UpdateMessageReadDto } from './dto/update-message-read.dto';
import { MessageRead } from 'src/entities/messageRead.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MessageReadService {
  constructor(
    @InjectRepository(MessageRead)
    private readonly msgReadService: Repository<MessageRead>,
  ) {}

  async create(createMessageReadDto: CreateMessageReadDto[]) {
    const arrData = createMessageReadDto.map((item) => ({
      user: { id: item.userId },
      message: { id: item.messageId },
    }));
    return await this.msgReadService
      .createQueryBuilder('messageRead')
      .insert()
      .into(MessageRead)
      .values(arrData)
      .execute();
  }

  findAll() {
    return `This action returns all messageRead`;
  }

  findOne(id: number) {
    return `This action returns a #${id} messageRead`;
  }

  update(id: number, updateMessageReadDto: UpdateMessageReadDto) {
    return `This action updates a #${id} messageRead`;
  }

  remove(id: number) {
    return `This action removes a #${id} messageRead`;
  }
}
