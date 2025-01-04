import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../../entities/user.entity';
import { Chat } from '../../../entities/chat.entity';

export class messageData extends BaseEntity {
  @ApiProperty({ description: 'content', example: 'ABC' })
  content: string;

  @ApiProperty({
    description: '',
    example: 'text',
    enum: ['text', 'image', 'video', 'file'],
  })
  type: string;

  @ApiProperty({
    description: 'the status message',
    example: '',
    enum: ['sent', 'read'],
  })
  status: string;

  @ApiProperty({ description: 'user', example: '{}' })
  user: User;

  @ApiProperty({ description: 'chat', example: '{}' })
  chat: Chat;

  @ApiProperty({ description: 'Attachments', example: '{}' })
  attachments: string;
}
