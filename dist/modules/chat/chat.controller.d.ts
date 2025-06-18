import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatMember } from '../../entities/chatMember.entity';
import { UserPayload } from '../auth/dto/user-payload.dto';
import { Chat } from '../../entities/chat.entity';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    create(user: UserPayload, createChatDto: CreateChatDto): Promise<Chat>;
    getChatByUser(user: UserPayload): Promise<ChatMember[]>;
    getConverseService(user: UserPayload): Promise<Chat>;
    update(id: string, updateChatDto: UpdateChatDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): Promise<import("typeorm").UpdateResult>;
    addMembersToChat(chatId: string, userIds: string[]): Promise<ChatMember[]>;
    removeMemberFromChat(chatId: string, userId: string): Promise<ChatMember>;
}
