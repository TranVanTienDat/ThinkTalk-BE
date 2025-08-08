import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Device } from './device.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'access' })
export class Access {
  @ManyToOne(() => User, (user) => user.access)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => Device, (device) => device.access)
  device: Device;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude()
  @Column({ name: 'refresh_token', nullable: true, default: null })
  refreshToken: string;

  @Exclude()
  @Column()
  expires_at: Date;
}
