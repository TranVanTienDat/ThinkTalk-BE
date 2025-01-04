import { Message } from './message.entity';
export declare class Attachment {
    id: number;
    file_url: string;
    file_type: string;
    uploaded_at: Date;
    message: Message;
}
