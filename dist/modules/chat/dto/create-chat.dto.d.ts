import { ChatRole, ChatStatus } from '../../../entities/chatMember.entity';
export declare class ChatMemberDto {
    userId: string;
    role: ChatRole;
}
export declare class CreateChatDto {
    name: string;
    type: ChatStatus;
    chatMembers: ChatMemberDto[];
}
