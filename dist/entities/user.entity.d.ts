import { BaseEntity } from '../common/entities/base.entity';
import { ChatMember } from './chatMember.entity';
import { Message } from './message.entity';
import { MessageStatus } from './messageStatus.entity';
import { Notification } from './notification.entity';
import { Device } from './devices.entity';
export declare enum UserStatus {
    ON = "online",
    OFF = "offline"
}
export declare class User extends BaseEntity {
    email: string;
    password: string;
    fullName: string;
    nickname: string;
    avatar: string;
    status: UserStatus;
    messages: Message[];
    chatMembers: ChatMember[];
    notifications: Notification[];
    messageStatus: MessageStatus[];
    devices: Device[];
}
