import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChatMember } from './chatMember.entity';
import { Message } from './message.entity';
export enum ChatStatus {
  Pr = 'private',
  Gr = 'group',
}
@Entity({ name: 'chat' })
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ChatStatus,
  })
  type: ChatStatus;

  @Column()
  nickname: string;

  @Column()
  fullName: string;

  @Column()
  avatar: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => Message, (m) => m.chat)
  messages: Message[];

  @OneToMany(() => ChatMember, (c) => c.chat)
  chatMembers: ChatMember[];
}
