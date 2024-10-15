import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
export enum NotificationType {
  Message = 'message',
  GroupInvite = 'group_invite',
}
@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  message_id: number;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column()
  nickname: string;

  @Column()
  fullName: string;

  @Column()
  avatar: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  read_at: Date;
}
