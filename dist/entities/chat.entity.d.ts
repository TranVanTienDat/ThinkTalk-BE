import { ChatMember } from './chatMember.entity';
import { Message } from './message.entity';
import { BaseEntity } from '../common/entities/base.entity';
export declare enum ChatStatus {
    Pr = "private",
    Gr = "group"
}
export declare class Chat extends BaseEntity {
    name: string;
    type: ChatStatus;
    avatar: string;
    messages: Message[];
    chatMembers: ChatMember[];
}
