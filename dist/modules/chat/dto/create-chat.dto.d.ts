import { ChatRole } from '../../../entities/chatMember.entity';
import { ChatStatus } from '../../../entities/chat.entity';
export declare class ChatMemberDto {
    userId: string;
    role: ChatRole;
}
export declare class CreateChatDto {
    name: string;
    type: ChatStatus;
    chatMembers: ChatMemberDto[];
}
