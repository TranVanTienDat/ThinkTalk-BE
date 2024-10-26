import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Chat } from './chat.entity';
export enum ChatStatus {
  Pr = 'private',
  Gr = 'group',
}
export enum ChatRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}
@Entity({ name: 'chatMembers' })
export class ChatMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ChatRole,
    default: ChatRole.MEMBER,
  })
  role: ChatRole;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.chatMembers)
  user: User;

  @ManyToOne(() => Chat, (c) => c.chatMembers)
  chat: Chat;
}
