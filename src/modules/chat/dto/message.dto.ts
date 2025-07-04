import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  @IsOptional()
  messageType?: string = 'text';
}

export class JoinRoomDto {
  @ApiProperty({ description: 'ID của chat/group', example: 'chat-123' })
  @IsString()
  @IsNotEmpty()
  chatId: string;
}

export class LeaveRoomDto {
  @ApiProperty({ description: 'ID của chat/group', example: 'chat-123' })
  @IsString()
  @IsNotEmpty()
  chatId: string;
}
