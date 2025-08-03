import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Message } from './message.entity';
import { User } from './user.entity';
export enum StatusMessage {
  Sent = 'sent',
  Delivered = 'delivered',
  Read = 'read',
}
@Entity({ name: 'messageRead' })
export class MessageRead extends BaseEntity {
  @ManyToOne(() => Message, (message) => message.messageRead, {
    onDelete: 'CASCADE',
  })
  message: Message;

  @ManyToOne(() => User)
  user: User;
}
