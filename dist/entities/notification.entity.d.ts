import { BaseEntity } from '../common/entities/base.entity';
import { Message } from './message.entity';
import { User } from './user.entity';
export declare enum NotificationType {
    Message = "message",
    GroupInvite = "group_invite"
}
export declare class Notification extends BaseEntity {
    type: NotificationType;
    read_at: Date;
    user: User;
    message: Message;
}
