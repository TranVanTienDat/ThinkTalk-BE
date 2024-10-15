import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'massage' })
export class Massage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  sender_id: number;

  @Column()
  chat_id: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
