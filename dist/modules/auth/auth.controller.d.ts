import { AuthService } from './auth.service';
import { authDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(userData: authDto): Promise<any>;
    login(userData: LoginDto): Promise<any>;
}
