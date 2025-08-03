import { Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ChatService } from '../chat/chat.service';
import { UsersService } from '../users/users.service';
import { User, UserStatus } from '../../entities/user.entity';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { UserPayload } from '../auth/dto/user-payload.dto';
import { UserAuth } from 'src/common/decorators/auth-user.decorator';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Public()
  @Get('/user')
  @ApiOperation({ summary: 'Create users' })
  @ApiResponse({ status: HttpStatus.OK })
  createSeedUser() {
    return this.seedService.createUserService();
  }

  @Public()
  @Get('/chat')
  @ApiOperation({ summary: 'Create chats' })
  @ApiResponse({ status: HttpStatus.OK })
  createSeedChat(@UserAuth() user: UserPayload) {
    return this.seedService.createChatService(user);
  }
}
