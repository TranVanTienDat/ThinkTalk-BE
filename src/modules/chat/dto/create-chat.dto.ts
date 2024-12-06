import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ChatRole, ChatStatus } from '../../../entities/chatMember.entity';

export class ChatMemberDto {
  @IsNotEmpty()
  userId: number;

  @IsEnum(ChatRole)
  @IsOptional()
  role: ChatRole = ChatRole.MEMBER;
}

export class CreateChatDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ChatStatus)
  @IsOptional()
  type: ChatStatus = ChatStatus.Gr;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMemberDto)
  chatMembers: ChatMemberDto[];
}
