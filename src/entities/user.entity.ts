import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { ChatMember } from './chatMember.entity';
import { Message } from './message.entity';
import { MessageRead } from './messageRead.entity';
import { Notification } from './notification.entity';
import { Device } from './device.entity';
import { Access } from './access.entity';
import { Exclude } from 'class-transformer';
export enum UserStatus {
  ON = 'online',
  OFF = 'offline',
}

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Exclude()
  @Column({ name: 'email', nullable: true })
  email: string;

  @Exclude()
  @Column({ name: 'password', nullable: true })
  password: string;
  @Column({ name: 'fullName', nullable: true })
  fullName: string;
  @Column({ name: 'nickname', nullable: true })
  nickname: string;
  @Column({ name: 'avatar', nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ON,
  })
  status: UserStatus;

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @OneToMany(() => ChatMember, (chatMember) => chatMember.user)
  chatMembers: ChatMember[];

  @OneToMany(() => Notification, (notification) => notification.receiverId)
  notifications: Notification[];

  @OneToMany(() => MessageRead, (ms) => ms.user)
  messageRead: MessageRead[];

  @OneToMany(() => Access, (a) => a.user, { cascade: true })
  access: Access[];

  @OneToMany(() => Device, (d) => d.user, { cascade: true })
  devices: Device[];
}
