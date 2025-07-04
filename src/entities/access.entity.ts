import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'access' })
export class Access {
  @ManyToOne(() => User, (user) => user.access)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'refresh_token', nullable: true, default: null })
  refreshToken: string;

  @Column()
  expires_at: Date;
}
