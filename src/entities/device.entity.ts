import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { User } from './user.entity';
import { Access } from './access.entity';

@Entity({ name: 'device' })
export class Device extends BaseEntity {
  @ManyToOne(() => User, (user) => user.devices)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => Access)
  @JoinColumn({ name: 'access_id' })
  access: Access;

  @Column({ name: 'type', nullable: true, default: null })
  type: string;

  @Column({ name: 'device_token', nullable: true, default: null })
  device_token: string;
}
