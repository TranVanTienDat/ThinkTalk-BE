import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Attachment } from './attachment.entity';
import { Chat } from './chat.entity';
import { Notification } from './notification.entity';
import { User } from './user.entity';

export enum TypeMessage {
  Text = 'text',
  Image = 'image',
  Video = 'video',
  File = 'file',
}

export enum StatusMessage {
  Sent = 'sent',
  Read = 'read',
}

@Entity({ name: 'message' })
export class Message extends BaseEntity {
  @Column({ name: 'content', nullable: false, default: null })
  content: string;

  @Column({ name: 'type_message', nullable: false, default: null })
  type: TypeMessage;

  @Column({ name: 'status', nullable: false, default: null })
  status: StatusMessage;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Chat, (c) => c.messages)
  @JoinColumn({ name: 'chat_id' })
  chat: Chat;

  @OneToMany(() => Notification, (notification) => notification.message)
  notifications: Notification[];
}
