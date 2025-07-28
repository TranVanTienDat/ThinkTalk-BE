import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MessageReadService } from './message-read.service';
import { CreateMessageReadDto } from './dto/create-message-read.dto';
import { UpdateMessageReadDto } from './dto/update-message-read.dto';

@Controller('message-read')
export class MessageReadController {
  constructor(private readonly messageReadService: MessageReadService) {}

  @Post()
  create(@Body() createMessageReadDto: CreateMessageReadDto[]) {
    return this.messageReadService.create(createMessageReadDto);
  }

  @Get()
  findAll() {
    return this.messageReadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageReadService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMessageReadDto: UpdateMessageReadDto,
  ) {
    return this.messageReadService.update(+id, updateMessageReadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageReadService.remove(+id);
  }
}
