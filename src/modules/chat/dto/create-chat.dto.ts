import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ChatRoles } from '../../../entities/chatMember.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ChatStatus } from '../../../entities/chat.entity';
import { MessageType } from 'src/entities/message.entity';

export class ChatMemberDto {
  @ApiProperty({ description: 'userId', example: '123' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'role', example: 'admin' })
  @IsEnum(ChatRoles)
  @IsOptional()
  role: ChatRoles = ChatRoles.MEMBER;
}

class MessageTemp {
  @ApiProperty({ example: 'hello' })
  @IsString()
  content: string;

  @ApiProperty({ example: 'text' })
  @IsEnum(MessageType)
  type: MessageType;
}

export class CreateChatDto {
  @ApiProperty({ description: 'name', example: 'Group' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'avatar', example: 'link image' })
  @IsString()
  avatar?: string;

  @ApiProperty({ description: 'type', example: 'private', default: 'group' })
  @IsEnum(ChatStatus)
  @IsOptional()
  type: ChatStatus = ChatStatus.Pr;

  @ApiProperty({
    description: 'Members',
    example: [{ userId: '123', role: 'member' }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMemberDto)
  chatMembers: ChatMemberDto[];

  @ApiProperty({
    description: 'Content message',
    example: [{ content: '123', type: 'text' }],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => MessageTemp)
  message?: MessageTemp;
}
