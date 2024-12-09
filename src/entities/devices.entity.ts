import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { User } from './user.entity';
import { Access } from './session.entity';

@Entity({ name: 'device' })
export class Device extends BaseEntity {
  @ManyToOne(() => User, (user) => user.devices)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => Access, (a) => a.devices)
  @JoinColumn({ name: 'access_id' })
  access: Access;

  @Column({ name: 'device id', nullable: true, default: null })
  device_id: string;

  @Column({ name: 'type', nullable: true, default: null })
  type: string;

  @Column({ name: 'device token', nullable: true, default: null })
  device_token: string;
}
