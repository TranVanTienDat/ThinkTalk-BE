import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { StatusMessage, TypeMessage } from '../../../entities/message.entity';

export class CreateMessageDto {
  @ApiProperty({ description: 'content', example: 'ABC' })
  @IsString()
  content: string;

  @ApiProperty({
    description: '',
    example: 'text',
    enum: TypeMessage,
  })
  @IsEnum(TypeMessage)
  type: TypeMessage;

  @ApiProperty({ description: 'chatId', example: 'ABC' })
  @IsString()
  chatId: string;

  @ApiProperty({ description: 'userId', example: 'ABC' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Attachments', example: 'ABC' })
  attachments: string;
}
