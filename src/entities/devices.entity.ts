import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { User } from './user.entity';

@Entity({ name: 'device' })
export class Device extends BaseEntity {
  @Column({ name: 'user id', nullable: true, default: null })
  user_id: string;

  @Column({ name: 'device id', nullable: true, default: null })
  device_id: string;

  @Column({ name: 'type', nullable: true, default: null })
  type: string;

  @Column({ name: 'device token', nullable: true, default: null })
  device_token: string;

  @ManyToOne(() => User, (user) => user.devices)
  user: User;
}
