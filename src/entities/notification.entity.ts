import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Message } from './message.entity';
import { User } from './user.entity';
export enum NotificationType {
  Message = 'message',
  GroupInvite = 'group_invite',
}
@Entity({ name: 'notification' })
export class Notification extends BaseEntity {
  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @CreateDateColumn({
    name: 'read_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  read_at: Date;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;

  @ManyToOne(() => Message, (m) => m.notifications)
  message: Message;
}
