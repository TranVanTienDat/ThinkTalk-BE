import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Attachment } from './attachment.entity';
import { Chat } from './chat.entity';
import { MessageStatus } from './messageStatus.entity';
import { Notification } from './notification.entity';
import { User } from './user.entity';

@Entity({ name: 'message' })
export class Message extends BaseEntity {
  @Column({ name: 'content', nullable: false, default: null })
  content: string;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Chat, (c) => c.messages)
  @JoinColumn({ name: 'chat_id' })
  chat: Chat;

  @OneToMany(() => MessageStatus, (c) => c.message)
  messageStatus: MessageStatus[];

  @OneToMany(() => Notification, (notification) => notification.message)
  notifications: Notification[];

  @OneToMany(() => Attachment, (a) => a.message)
  attachments: Attachment[];
}
