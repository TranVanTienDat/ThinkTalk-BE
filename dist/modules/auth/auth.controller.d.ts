import { AuthService } from './auth.service';
import { AuthDto, LoginDto } from './dto/auth.dto';
import { UserData } from './dto/user-data.dto';
import { UserPayload } from './dto/user-payload.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(userData: AuthDto): Promise<any>;
    login(userData: LoginDto): Promise<any>;
    logout(userData: UserPayload): Promise<void>;
    getMe(userData: UserPayload): Promise<UserData>;
}
