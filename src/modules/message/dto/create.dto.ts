import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { MessageType } from 'src/entities/message.entity';
import { StatusMessage } from 'src/entities/messageStatus.entity';

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

  @IsEnum(StatusMessage)
  status: StatusMessage;
}
