import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatRole } from '../../entities/chatMember.entity';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    create(createChatDto: CreateChatDto): Promise<import("../../entities").Chat>;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateChatDto: UpdateChatDto): Promise<import("../../entities").Chat>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
    addMembersToChat(chatId: string, userIds: string[], role?: ChatRole): Promise<import("../../entities/chatMember.entity").ChatMember[]>;
    removeMemberFromChat(chatId: string, userId: string): Promise<import("../../entities/chatMember.entity").ChatMember>;
}
