import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Message } from './message.entity';
export enum StatusMessage {
  Sent = 'sent',
  Delivered = 'delivered',
  Read = 'read',
}
@Entity({ name: 'messageStatus' })
export class MessageStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message_id: number;
  @Column()
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
