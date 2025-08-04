import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Attachment } from './attachment.entity';
import { Chat } from './chat.entity';
import { MessageRead } from './messageRead.entity';
import { Notification } from './notification.entity';
import { User } from './user.entity';

export enum MessageType {
  TEXT = 'text', // Tin nhắn văn bản
  IMAGE = 'image', // Hình ảnh
  VIDEO = 'video', // Video
  AUDIO = 'audio', // Âm thanh / voice
  FILE = 'file', // Tệp đính kèm
  STICKER = 'sticker', // Sticker / emoji
  SYSTEM = 'system', // Thông báo hệ thống (ví dụ: user rời nhóm)
  REPLY = 'reply', // Tin nhắn dạng trả lời
  FORWARD = 'forward', // Tin nhắn được chuyển tiếp
  REACTION = 'reaction', // Biểu cảm (like, haha, love, v.v.)
  CALL = 'call', // Thông tin cuộc gọi (voice/video)
  LOCATION = 'location', // Gửi vị trí
  CONTACT = 'contact', // Gửi danh bạ
}

@Entity({ name: 'message' })
export class Message extends BaseEntity {
  @Column({ name: 'content', nullable: false, default: null })
  content: string;

  @Column({ name: 'sender_id' })
  senderId: string;
  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'sender_id' })
  user: User;

  @Column({ name: 'chat_id' })
  chatId: string;

  @ManyToOne(() => Chat, (c) => c.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_id' })
  chat: Chat;

  @OneToMany(() => MessageRead, (read) => read.message)
  messageRead: MessageRead[];

  @OneToMany(() => Attachment, (a) => a.message)
  attachments: Attachment[];

  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  type: MessageType;
}
