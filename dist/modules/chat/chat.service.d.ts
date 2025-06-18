import { Repository } from 'typeorm';
import { Chat } from '../../entities/chat.entity';
import { ChatMember } from '../../entities/chatMember.entity';
import { UsersService } from '../users/users.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { UserPayload } from '../auth/dto/user-payload.dto';
export declare class ChatService {
    private chatRepo;
    private chatMemberRepo;
    private userService;
    constructor(chatRepo: Repository<Chat>, chatMemberRepo: Repository<ChatMember>, userService: UsersService);
    createService(createChatDto: CreateChatDto): Promise<Chat>;
    getChatByUserService(user: UserPayload): Promise<ChatMember[]>;
    getConverseService(id: string): Promise<Chat>;
    updateService(id: string, updateChatDto: UpdateChatDto): Promise<import("typeorm").UpdateResult>;
    removeChatService(id: string): Promise<import("typeorm").UpdateResult>;
    addMembersService(userIds: string[], chatId: string): Promise<ChatMember[]>;
    removeMemberService(userId: string, chatId: string): Promise<ChatMember>;
    isAdminChat(userId: string, chatId: string): Promise<boolean>;
}
