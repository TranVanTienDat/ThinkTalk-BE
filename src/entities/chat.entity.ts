import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ChatMember } from './chatMember.entity';
import { Message } from './message.entity';
import { BaseEntity } from '../common/entities/base.entity';
export enum ChatStatus {
  Pr = 'private',
  Gr = 'group',
}
@Entity({ name: 'chat' })
export class Chat extends BaseEntity {
  @Column({ name: 'name', nullable: false, default: null })
  name: string;

  @Column({
    type: 'enum',
    enum: ChatStatus,
    default: ChatStatus.Pr,
  })
  type: ChatStatus;

  @Column({ name: 'avatar', nullable: true, default: null })
  avatar: string;

  @Column('text', {
    name: 'user_ids',
    nullable: true,
    default: [],
    array: true,
  })
  userIds: string[];

  @OneToMany(() => Message, (m) => m.chat, { onDelete: 'CASCADE' })
  messages: Message[];

  @ManyToOne(() => Message, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'last_message_id' })
  lastMessage: Message;

  @OneToMany(() => ChatMember, (c) => c.chat, { onDelete: 'CASCADE' })
  chatMembers: ChatMember[];
}
