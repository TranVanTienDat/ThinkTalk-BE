import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Device } from './devices.entity';
import { User } from './user.entity';

@Entity({ name: 'session' })
export class Access {
  @ManyToOne(() => User, (user) => user.devices)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => Device, (d) => d.access)
  @JoinColumn({ name: 'devices_id' })
  devices: Device;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'refresh_token', nullable: true, default: null })
  token: string;

  @Column()
  expires_at: Date;
}
