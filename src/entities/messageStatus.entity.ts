import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
export enum MessageStatus {
  Sent = 'sent',
  Delivered = 'delivered',
  Read = 'read',
}
@Entity({ name: 'messageStatus' })
export class messageStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message_id: number;
  @Column()
  user_id: number;

  @Column({
    type: 'enum',
    enum: MessageStatus,
  })
  status: MessageStatus;
}
