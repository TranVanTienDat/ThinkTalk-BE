import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
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
  @Column({
    type: 'enum',
    enum: StatusMessage,
  })
  status: StatusMessage;

  @ManyToOne(() => Message, (message) => message.messageStatus)
  @JoinColumn({ name: 'message_id' })
  message: Message;

  @ManyToOne(() => User, (user) => user.messageStatus)
  user: User;
}
