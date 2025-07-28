import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { MessageType } from 'src/entities/message.entity';
import { StatusMessage } from 'src/entities/messageRead.entity';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsUUID()
  senderId?: string;

  @IsNotEmpty()
  @IsUUID()
  chatId: string;

  // @IsNotEmpty()
  @IsEnum(MessageType)
  type: MessageType;
}
