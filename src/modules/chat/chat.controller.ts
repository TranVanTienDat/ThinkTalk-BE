import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserAuth } from '../../common/decorators/auth-user.decorator';
import { AdminChatGuard } from '../../common/guard/admin-chat.guard';
import { Chat } from '../../entities/chat.entity';
import { ChatMember, ChatRole } from '../../entities/chatMember.entity';
import { UserPayload } from '../auth/dto/user-payload.dto';
import { ChatService } from './chat.service';
import { ChatFilter } from './dto/chat.filter';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Create chat group' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Chat })
  @ApiBearerAuth()
  create(@UserAuth() user: UserPayload, @Body() createChatDto: CreateChatDto) {
    createChatDto.chatMembers.push({ userId: user.id, role: ChatRole.ADMIN });
    return this.chatService.createService(createChatDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the conversation list' })
  @ApiResponse({ status: HttpStatus.OK, type: Chat })
  getChatByUser(
    @UserAuth() user: UserPayload,
    @Query(new ValidationPipe({ transform: true }))
    filter: ChatFilter,
  ) {
    return this.chatService.getChatByUserService(filter, user);
  }

  // @Get()
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Get the conversation' })
  // @ApiResponse({ status: HttpStatus.OK, type: Chat })
  // getConverseService(@UserAuth() user: UserPayload) {
  //   return this.chatService.getConverseService(user.id);
  // }

  @Patch(':id')
  @UseGuards(AdminChatGuard)
  @ApiOperation({ summary: 'Update chat group' })
  @ApiResponse({ status: HttpStatus.OK, type: Chat })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.updateService(id, updateChatDto);
  }

  @Delete(':id')
  @UseGuards(AdminChatGuard)
  @ApiOperation({ summary: 'Delete chat group' })
  @ApiResponse({ status: HttpStatus.OK, type: Chat })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.chatService.removeChatService(id);
  }

  @Post(':chatId/members')
  @UseGuards(AdminChatGuard)
  @ApiOperation({ summary: 'Add members in chat group' })
  @ApiResponse({ status: HttpStatus.OK, type: ChatMember })
  @ApiBearerAuth()
  async addMembersToChat(
    @Param('chatId') chatId: string,
    @Body('userIds') userIds: string[],
  ) {
    return await this.chatService.addMembersService(userIds, chatId);
  }

  @Delete(':chatId/members/:userId')
  @UseGuards(AdminChatGuard)
  @ApiOperation({ summary: 'Deleted members out chat group' })
  @ApiResponse({ status: HttpStatus.OK, type: ChatMember })
  @ApiBearerAuth()
  async removeMemberFromChat(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
  ) {
    return await this.chatService.removeMemberService(userId, chatId);
  }
}
