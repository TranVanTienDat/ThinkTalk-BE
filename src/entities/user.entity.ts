import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChatMember } from './chatMember.entity';
import { Message } from './message.entity';
import { MessageStatus } from './messageStatus.entity';
import { Notification } from './notification.entity';
export enum UserStatus {
  ON = 'online',
  OFF = 'offline',
}

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;
  @Column()
  fullName: string;
  @Column({ nullable: true })
  nickname: string;
  @Column({ nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ON,
  })
  status: UserStatus;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @OneToMany(() => ChatMember, (chatMember) => chatMember.user)
  chatMembers: ChatMember[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => MessageStatus, (ms) => ms.user)
  messageStatus: MessageStatus[];
}
