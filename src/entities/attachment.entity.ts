import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'attachments' })
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message_id: number;
  @Column()
  file_url: string;

  @Column()
  file_type: string;
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  uploaded_at: Date;
}
