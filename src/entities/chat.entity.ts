import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
export enum ChatStatus {
  Pr = 'private',
  Gr = 'group',
}
@Entity({ name: 'chats' })
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
}
