import { BaseEntity } from '../common/entities/base.entity';
import { Message } from './message.entity';
import { User } from './user.entity';
export declare enum StatusMessage {
    Sent = "sent",
    Delivered = "delivered",
    Read = "read"
}
export declare class MessageStatus extends BaseEntity {
    message_id: number;
    user_id: number;
    status: StatusMessage;
    message: Message;
    user: User;
}
