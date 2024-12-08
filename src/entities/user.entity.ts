import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { ChatMember } from './chatMember.entity';
import { Message } from './message.entity';
import { MessageStatus } from './messageStatus.entity';
import { Notification } from './notification.entity';
export enum UserStatus {
  ON = 'online',
  OFF = 'offline',
}

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Column({ name: 'email', nullable: true })
  email: string;

  @Column({ name: 'password', nullable: true })
  password: string;
  @Column({ name: 'fullName', nullable: true })
  fullName: string;
  @Column({ name: 'nickname', nullable: true })
  nickname: string;
  @Column({ name: 'avatar', nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ON,
  })
  status: UserStatus;

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @OneToMany(() => ChatMember, (chatMember) => chatMember.user)
  chatMembers: ChatMember[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => MessageStatus, (ms) => ms.user)
  messageStatus: MessageStatus[];
}
