import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ChatRole } from '../../../entities/chatMember.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ChatStatus } from '../../../entities/chat.entity';

export class ChatMemberDto {
  @ApiProperty({ description: 'userId', example: '123' })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'role', example: 'admin' })
  @IsEnum(ChatRole)
  @IsOptional()
  role: ChatRole = ChatRole.MEMBER;
}

export class CreateChatDto {
  @ApiProperty({ description: 'name', example: 'Group' })
  @IsString()
  @IsNotEmpty()
  name: string;

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
}
