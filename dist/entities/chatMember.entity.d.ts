import { BaseEntity } from '../common/entities/base.entity';
import { Chat } from './chat.entity';
import { User } from './user.entity';
export declare enum ChatRole {
    ADMIN = "admin",
    MEMBER = "member"
}
export declare class ChatMember extends BaseEntity {
    role: ChatRole;
    user: User;
    chat: Chat;
}
