// chat-message.dto.ts
import { Type } from 'class-transformer';

class MessageStatusDto {
  status: string;
}

export class LastMessageDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  content: string;
  userId: string;
  chatId: string;
  type: string;
}

export class ChatDto {
  id: string;
  //   createdAt: string;
  //   updatedAt: string;
  //   deletedAt: string | null;
  name: string;
  type: string;
  avatar: string | null;
  //   userIds: string[];

  @Type(() => LastMessageDto)
  lastMessage: LastMessageDto;
}

// export class ChatMemberDto {
//   id: string;
//   createdAt: string;
//   updatedAt: string;
//   deletedAt: string | null;
//   role: string;

//   @Type(() => ChatDto)
//   chat: ChatDto;
// }
