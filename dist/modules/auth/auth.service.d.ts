import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { AccessService } from '../access/access.service';
import { UsersService } from '../users/users.service';
import { AuthDto, LoginDto } from './dto/auth.dto';
import { UserData } from './dto/user-data.dto';
import { UserPayload } from './dto/user-payload.dto';
export declare class AuthService {
    private userRepo;
    private readonly userService;
    private readonly accessService;
    private readonly configService;
    constructor(userRepo: Repository<User>, userService: UsersService, accessService: AccessService, configService: ConfigService);
    register(registerDto: AuthDto): Promise<{
        statusCode: number;
        message: string;
        user: UserData;
    }>;
    login(userPayLoad: LoginDto): Promise<{
        statusCode: number;
        message: string;
        user: UserData;
    }>;
    logoutService(user: UserPayload): Promise<void>;
    getMe(user: UserPayload): Promise<UserData>;
    generateAccessToken(user: UserPayload): Promise<string>;
    generateRefreshToken(user: UserPayload): Promise<string>;
    refreshToken(user: UserPayload): Promise<void>;
}
