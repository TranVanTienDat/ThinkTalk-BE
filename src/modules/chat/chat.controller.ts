import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatRole } from '../../entities/chatMember.entity';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }

  @Post(':chatId/members')
  async addMembersToChat(
    @Param('chatId') chatId: number,
    @Body('userIds') userIds: number[],
    @Body('role') role: ChatRole = ChatRole.MEMBER,
  ) {
    return await this.chatService.addMembersToChat(userIds, chatId, role);
  }

  @Delete(':chatId/members/:userId')
  async removeMemberFromChat(
    @Param('chatId') chatId: number,
    @Param('userId') userId: number,
  ) {
    return await this.chatService.removeMemberFromChat(userId, chatId);
  }
}
