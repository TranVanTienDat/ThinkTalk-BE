import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Message } from 'src/entities/message.entity';
import { MessageFilter } from './dto/filter.dto';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly msgService: MessageService) {}

  @Get('/conversation/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get message by conversation' })
  @ApiResponse({ status: HttpStatus.OK, type: Message })
  async get(
    @Query(new ValidationPipe({ transform: true }))
    filter: MessageFilter,
    @Param('id') id: string,
  ) {
    return await this.msgService.findByConversation(id, filter);
  }
}
