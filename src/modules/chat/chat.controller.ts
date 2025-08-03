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
import { CacheDecorator } from 'src/common/decorators/cache.decorator';
import { UserAuth } from '../../common/decorators/auth-user.decorator';
import { AdminChatGuard } from '../../common/guard/admin-chat.guard';
import { Chat } from '../../entities/chat.entity';
import { ChatMember, ChatRoles } from '../../entities/chatMember.entity';
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
  create(
    @UserAuth() user: UserPayload,
    @Body(new ValidationPipe({ transform: true })) createChatDto: CreateChatDto,
  ) {
    createChatDto.chatMembers.push({ userId: user.id, role: ChatRoles.ADMIN });
    return this.chatService.createService(createChatDto, user);
  }

  @Get()
  // @CacheDecorator({
  //   cacheForEachUser: true,
  //   cacheKey: 'get-conversations',
  //   cacheTTL: 600000,
  // })
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

  @Get('/private/:userId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Check to see if the two users have a private group',
  })
  @ApiResponse({ status: HttpStatus.OK, type: Chat })
  findPrivateChat(
    @UserAuth() user: UserPayload,
    @Param('userId') userId: string,
  ) {
    return this.chatService.findPrivateChatBetweenUsers(userId, user);
  }
}
