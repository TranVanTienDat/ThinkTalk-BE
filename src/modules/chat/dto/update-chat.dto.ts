import { PartialType } from '@nestjs/mapped-types';
import { CreateChatDto } from './create-chat.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateChatDto extends PartialType(CreateChatDto) {}

export class UpdateChatDtoSW {
  @IsNotEmpty()
  @IsString()
  chatId: string;

  @IsNotEmpty()
  data: UpdateChatDto;
}
