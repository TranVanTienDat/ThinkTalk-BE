import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';

export class BaseChat extends BaseEntity {
  @ApiProperty({ description: 'Name', example: 'ABC' })
  name: string;
  @ApiProperty({ description: 'Avatar', example: 'Link' })
  avatar: string;
}

export class ChatData extends BaseChat {
  @ApiProperty({ description: 'Type converse', example: 'group | private' })
  type: string;

  @ApiProperty({ description: 'Messages', example: '[]' })
  messages: Array<any>;

  @ApiProperty({ description: 'Member', example: [] })
  chatMembers: [];
}
