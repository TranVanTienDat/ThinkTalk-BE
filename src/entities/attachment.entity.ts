import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.entity';

@Entity({ name: 'attachment' })
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  file_url: string;

  @Column()
  file_type: string;
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  uploaded_at: Date;

  @ManyToOne(() => Message, (m) => m.attachments)
  @JoinColumn({ name: 'message_id' })
  message: Message;
}
