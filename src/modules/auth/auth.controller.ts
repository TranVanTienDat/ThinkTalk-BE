import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto } from './dto/auth.dto';
import { UserData } from './dto/user-data.dto';
import { UserAuth } from '../../common/decorators/auth-user.decorator';
import { UserPayload } from './dto/user-payload.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Register' })
  @ApiResponse({ status: HttpStatus.CREATED, type: UserData })
  @Post('register')
  async register(@Body() userData: AuthDto): Promise<any> {
    return this.authService.register(userData);
  }
  @Public()
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: HttpStatus.OK, type: UserData })
  @Post('login')
  async login(@Body() userData: LoginDto): Promise<any> {
    return this.authService.login(userData);
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: HttpStatus.OK })
  @ApiBearerAuth()
  @Post('logout')
  async logout(@UserAuth() userData: UserPayload): Promise<void> {
    return this.authService.logoutService(userData);
  }

  @ApiOperation({ summary: 'Get me' })
  @ApiResponse({ status: HttpStatus.OK, type: UserData })
  @ApiBearerAuth()
  @Get('get-me')
  async getMe(@UserAuth() userData: UserPayload) {
    return this.authService.getMe(userData);
  }
}
