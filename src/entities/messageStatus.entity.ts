import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Message } from './message.entity';
import { User } from './user.entity';
export enum StatusMessage {
  Sent = 'sent',
  Delivered = 'delivered',
  Read = 'read',
}
@Entity({ name: 'messageStatus' })
export class MessageStatus extends BaseEntity {
  @Column({ name: 'message_id' })
  message_id: number;
  @Column({ name: 'user_id' })
  user_id: number;

  @Column({
    type: 'enum',
    enum: StatusMessage,
  })
  status: StatusMessage;

  @ManyToOne(() => Message, (message) => message.messageStatus)
  message: Message;

  @ManyToOne(() => User, (user) => user.messageStatus)
  user: User;
}
