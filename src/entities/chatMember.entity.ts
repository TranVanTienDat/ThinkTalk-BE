import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
export enum ChatStatus {
  Pr = 'private',
  Gr = 'group',
}
@Entity({ name: 'chatMember' })
export class chatMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chat_id: number;

  @Column()
  user_id: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
