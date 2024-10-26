import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Chat } from './chat.entity';
import { MessageStatus } from './messageStatus.entity';
import { Notification } from './notification.entity';
import { Attachment } from './attachment.entity';

@Entity({ name: 'message' })
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.messages)
  user: User;

  @ManyToOne(() => Chat, (c) => c.messages)
  chat: Chat;

  @OneToMany(() => MessageStatus, (c) => c.message)
  messageStatus: MessageStatus[];

  @OneToMany(() => Notification, (notification) => notification.message)
  notifications: Notification[];

  @OneToMany(() => Attachment, (a) => a.message)
  attachments: Attachment[];
}
