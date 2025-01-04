import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Repository } from 'typeorm';
import { ChatMember, ChatRole } from '../../entities/chatMember.entity';
import { Chat } from '../../entities/chat.entity';
export declare class ChatService {
    private chatRepository;
    private chatMemberRepository;
    constructor(chatRepository: Repository<Chat>, chatMemberRepository: Repository<ChatMember>);
    create(createChatDto: CreateChatDto): Promise<Chat>;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateChatDto: UpdateChatDto): Promise<Chat>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
    addMembersToChat(userIds: string[], chatId: string, role?: ChatRole): Promise<ChatMember[]>;
    removeMemberFromChat(userId: string, chatId: string): Promise<ChatMember>;
}
