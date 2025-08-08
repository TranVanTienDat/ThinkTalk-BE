import {
  Controller,
  Get,
  HttpStatus,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';
import { UserFilter } from './dto/filter.dto';
import { UsersService } from './users.service';
import { UserPayload } from '../auth/dto/user-payload.dto';
import { UserAuth } from 'src/common/decorators/auth-user.decorator';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/users-with-chat-private')
  @ApiOperation({ summary: 'Get users with chat private' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @ApiBearerAuth()
  async getUser(
    @Query(new ValidationPipe({ transform: true })) filter: UserFilter,
    @UserAuth() user: UserPayload,
  ) {
    return await this.usersService.getUserWithChatPrivateService(filter, user);
  }

  @Get('/device-information')
  @ApiOperation({ summary: 'Get the device information of user' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  @ApiBearerAuth()
  async getDeviceInformation(@UserAuth() user: UserPayload) {
    return await this.usersService.getDeviceInformation(user);
  }
}
