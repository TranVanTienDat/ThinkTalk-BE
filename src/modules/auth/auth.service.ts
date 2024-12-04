import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { authDto } from './dto/auth.dto';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: authDto) {
    const { email, password, fullName } = registerDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (user) {
      throw new BadRequestException('Email has existed!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      fullName,
    });

    await this.userRepository.save(newUser);
    const payload = { email: newUser.email, sub: newUser.id };
    const secret = this.configService.get<string>('JWT_SECRET');
    const accessToken = await this.jwtService.signAsync(payload, {
      secret,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: hashed, created_at, updated_at, ...result } = newUser;

    return {
      statusCode: 200,
      message: 'Register successfully !',
      ...result,
      accessToken,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('Username is incorrect!');
    }
    if (!bcrypt.compare(password, user.password))
      throw new BadRequestException('Password is incorrect!');

    const payload = { email: user.email, sub: user.id };
    const secret = this.configService.get<string>('JWT_SECRET');
    const accessToken = await this.jwtService.signAsync(payload, {
      secret,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: hashed, created_at, updated_at, ...result } = user;

    return {
      statusCode: 200,
      message: 'Login successfully !',
      ...result,
      accessToken,
    };
  }
}
