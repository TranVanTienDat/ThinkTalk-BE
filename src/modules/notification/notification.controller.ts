import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserAuth } from 'src/common/decorators/auth-user.decorator';
import { CacheDecorator } from 'src/common/decorators/cache.decorator';
import { Notification } from 'src/entities/notification.entity';
import { UserPayload } from '../auth/dto/user-payload.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationFilter } from './dto/notification.filter.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

    @Get()
    @CacheDecorator({
      cacheForEachUser: true,
      cacheKey: 'get-notifications',
      cacheTTL: 600000,
    })
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get the notification list' })
    @ApiResponse({ status: HttpStatus.OK, type: Notification })
  findAll(
     @UserAuth() user: UserPayload,
        @Query(new ValidationPipe({ transform: true }))
        filter: NotificationFilter,
  ) {
    return this.notificationService.findAll(filter,user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
