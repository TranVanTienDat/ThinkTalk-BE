import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { MessageService } from './message.service';
import { UpdateMessageDto } from './dto/update.dto';
import { CreateMessageDto } from './dto/create.dto';

@WebSocketGateway()
export class MessageGateway {
  constructor(private readonly messageService: MessageService) {}

  @SubscribeMessage('create-message')
  async create(@MessageBody() createMessageDto: CreateMessageDto) {
    return await this.messageService.create(createMessageDto);
  }

  // @SubscribeMessage('findAllMessage')
  // findAll() {
  //   return this.messageService.findAll();
  // }

  @SubscribeMessage('find-one-message')
  async findOne(@MessageBody() id: string) {
    return await this.messageService.findOne(id);
  }

  @SubscribeMessage('update-message')
  async update(@MessageBody() updateMessageDto: UpdateMessageDto) {
    return await this.messageService.update(
      updateMessageDto.id,
      updateMessageDto,
    );
  }

  @SubscribeMessage('remove-message')
  async remove(@MessageBody() id: number) {
    return await this.messageService.remove(id);
  }
}
