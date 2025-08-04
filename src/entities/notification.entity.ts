import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Message } from './message.entity';
import { User } from './user.entity';
import { NotificationJobType } from 'src/common/utils/constant.util';

@Entity({ name: 'notification' })
export class Notification extends BaseEntity {
  @Column({
    type: 'enum',
    enum: NotificationJobType,
  })
  type: NotificationJobType;

  @Column({ name: 'is_read' })
  isRead: boolean;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'receiver_Id' })
  receiverId: User;

  @Column({ name: 'target', nullable: true })
  target: string;

  @Column({ name: 'actor', nullable: true })
  actor: string;

  @Column({ name: 'message' })
  message: string;

  @Column({ type: 'jsonb', nullable: true })
  data: Record<string, any>;
}
