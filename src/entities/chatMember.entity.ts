import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Chat } from './chat.entity';
import { User } from './user.entity';

export enum ChatRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

@Entity({ name: 'chatMembers' })
export class ChatMember extends BaseEntity {
  @Column({
    type: 'enum',
    enum: ChatRole,
    default: ChatRole.MEMBER,
  })
  role: ChatRole;

  @ManyToOne(() => User, (user) => user.chatMembers)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Chat, (c) => c.chatMembers)
  @JoinColumn({ name: 'chat_id' })
  chat: Chat;
}
