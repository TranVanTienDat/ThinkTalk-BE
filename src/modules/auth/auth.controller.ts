import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { authDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() userData: authDto): Promise<any> {
    return this.authService.register(userData);
  }
  @Public()
  @Post('login')
  async login(@Body() userData: LoginDto): Promise<any> {
    return this.authService.login(userData);
  }
}
