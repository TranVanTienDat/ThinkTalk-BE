import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { User } from './user.entity';
import { Access } from './access.entity';
import { IsEnum } from 'class-validator';
import { Exclude } from 'class-transformer';

enum DeviceStatus {
  LOGIN = 'login',
  LOGOUT = 'logout',
}

@Entity({ name: 'device' })
export class Device extends BaseEntity {
  @ManyToOne(() => User, (user) => user.devices)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => Access, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'access_id' })
  access: Access;

  @Column({ name: 'type', nullable: true, default: null })
  type: string;

  @Exclude()
  @Column({ name: 'device_token', nullable: true, default: null })
  device_token: string;

  @Column({ type: 'jsonb', nullable: true })
  info: Record<string, any>;

  @Column({ type: 'enum', enum: DeviceStatus, nullable: true })
  @IsEnum(DeviceStatus)
  status: DeviceStatus;
}
