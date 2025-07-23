import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MessageType } from 'src/entities/message.entity';

export class SendMessageDto {
  @ApiProperty({ description: 'ID của chat/group', example: 'chat-123' })
  @IsString()
  @IsNotEmpty()
  chatId: string;

  @ApiProperty({
    description: 'Nội dung tin nhắn',
    example: 'Xin chào mọi người!',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'Loại tin nhắn',
    example: 'text',
    required: false,
  })
  @IsString()
  @IsEnum(MessageType)
  messageType: MessageType = MessageType.TEXT;
}

export class RoomDto {
  @ApiProperty({ description: 'ID của chat/group', example: 'chat-123' })
  @IsString()
  @IsNotEmpty()
  chatId: string;
}
