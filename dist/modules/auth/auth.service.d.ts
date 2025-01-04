import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { authDto } from './dto/auth.dto';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private userRepository;
    private readonly jwtService;
    private readonly configService;
    constructor(userRepository: Repository<User>, jwtService: JwtService, configService: ConfigService);
    register(registerDto: authDto): Promise<{
        accessToken: string;
        email: string;
        fullName: string;
        nickname: string;
        avatar: string;
        status: import("../../entities/user.entity").UserStatus;
        messages: import("../../entities").Message[];
        chatMembers: import("../../entities/chatMember.entity").ChatMember[];
        notifications: import("../../entities/notification.entity").Notification[];
        messageStatus: import("../../entities/messageStatus.entity").MessageStatus[];
        devices: import("../../entities/devices.entity").Device[];
        id: string;
        deletedAt: Date;
        statusCode: number;
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        email: string;
        fullName: string;
        nickname: string;
        avatar: string;
        status: import("../../entities/user.entity").UserStatus;
        messages: import("../../entities").Message[];
        chatMembers: import("../../entities/chatMember.entity").ChatMember[];
        notifications: import("../../entities/notification.entity").Notification[];
        messageStatus: import("../../entities/messageStatus.entity").MessageStatus[];
        devices: import("../../entities/devices.entity").Device[];
        id: string;
        deletedAt: Date;
        statusCode: number;
        message: string;
    }>;
}
