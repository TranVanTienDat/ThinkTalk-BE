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
    default: ChatStatus.Pr,
  })
  type: ChatStatus;

  @Column()
  avatar: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => Message, (m) => m.chat, { onDelete: 'CASCADE' })
  messages: Message[];

  @OneToMany(() => ChatMember, (c) => c.chat, { onDelete: 'CASCADE' })
  chatMembers: ChatMember[];
}
