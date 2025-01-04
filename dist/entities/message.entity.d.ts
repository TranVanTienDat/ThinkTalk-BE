import { BaseEntity } from '../common/entities/base.entity';
import { Attachment } from './attachment.entity';
import { Chat } from './chat.entity';
import { MessageStatus } from './messageStatus.entity';
import { Notification } from './notification.entity';
import { User } from './user.entity';
export declare class Message extends BaseEntity {
    content: string;
    user: User;
    chat: Chat;
    messageStatus: MessageStatus[];
    notifications: Notification[];
    attachments: Attachment[];
}
