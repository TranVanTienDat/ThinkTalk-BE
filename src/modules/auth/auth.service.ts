import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { getPasswordHash } from '../../common/utils/security.util';
import { Access } from '../../entities/access.entity';
import { Device } from '../../entities/device.entity';
import { User, UserStatus } from '../../entities/user.entity';
import { AccessService } from '../access/access.service';
import { UsersService } from '../users/users.service';
import { AuthDto, LoginDto } from './dto/auth.dto';
import { UserData } from './dto/user-data.dto';
import { UserPayload } from './dto/user-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private readonly userService: UsersService,
    private readonly accessService: AccessService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: AuthDto) {
    const { email, password, fullName, device_token, type } = registerDto;

    const isUser = await this.userService.findUserByEmailService(registerDto);
    if (isUser) {
      throw new BadRequestException('Email has existed!');
    }

    const hashedPassword = await getPasswordHash(password);

    let user: User;
    let accessToken: string;
    let refreshToken: string;
    await this.userRepo.manager.transaction(async (manager) => {
      user = manager.create(User, {
        email,
        password: hashedPassword,
        fullName,
      });
      await manager.save(user);

      if (!Object.keys(user))
        throw new BadGatewayException('Registered failed');

      accessToken = await this.generateAccessToken(user as any);
      refreshToken = await this.generateRefreshToken(user as any);

      const access = manager.create(Access, {
        user,
        refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Thời hạn 7 ngày
      });
      await manager.save(access);

      const device = manager.create(Device, {
        user,
        access,
        device_token,
        type,
      });

      await manager.save(device);
    });

    return {
      statusCode: 201,
      message: 'Register successfully!',
      user: plainToInstance(UserData, {
        ...user,
        accessToken,
        refreshToken,
      }),
    };
  }

  async login(userPayLoad: LoginDto) {
    const { device_token } = userPayLoad;
    const user = await this.userService.findUserService(userPayLoad);
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    const device = user.devices.find(
      (device) => device.device_token === device_token,
    );
    if (!device) {
      throw new NotFoundException('Not found device');
    }

    await this.accessService.updateService(device.access.id, { refreshToken });
    await this.userRepo.update(user.id, { status: UserStatus.ON });

    return {
      statusCode: 200,
      message: 'Login successfully !',
      user: plainToInstance(UserData, {
        ...user,
        accessToken,
        refreshToken,
      }),
    };
  }

  async logoutService(user: UserPayload): Promise<void> {
    await this.userRepo.update(user.id, { status: UserStatus.OFF });
  }

  async getMe(user: UserPayload) {
    const userExists = await this.userService.findUserByIdService(user.id);

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    return plainToInstance(UserData, userExists);
  }

  public async generateAccessToken(user: UserPayload): Promise<string> {
    const payload = {
      id: user.id,
      name: user.fullName,
      email: user.email,
    };
    const secret = this.configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT SECRET not defined');
    }

    const options: jwt.SignOptions = {
      algorithm: 'HS256',
      expiresIn: this.configService.get<string>(
        'JWT_ACCESS_EXPIRATION_TIME',
      ) as any,
    };

    const token = jwt.sign(payload, secret, options);

    return token;
  }

  public async generateRefreshToken(user: UserPayload): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
    };
    const secret = this.configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT SECRET not defined');
    }

    const options: jwt.SignOptions = {
      algorithm: 'HS256',
      expiresIn: this.configService.get<string>(
        'JWT_REFRESH_EXPIRATION_TIME',
      ) as any,
    };

    const token = jwt.sign(payload, secret, options);

    return token;
  }

  public async refreshToken(user: UserPayload) {
    try {
      const userExists = await this.userRepo.findOne({
        where: { email: user.email },
        withDeleted: false,
      });

      if (!userExists) {
        throw new NotFoundException('User not found');
      }

      console.log('userExists', userExists);
      // const env = process.env;
      // const payload = jwt.verify(userExists.token, `${env.JWT_SECRET}`, {
      //   algorithms: ['HS256'],
      // });

      // if (typeof payload === 'string') {
      //   throw new UnauthorizedException('Not allow');
      // }
      // const response = plainToInstance(UserData, userExists);

      // return new LoginDto(response, await this.generateAccessToken(response));
    } catch (err) {
      throw new UnauthorizedException('Not allow');
    }
  }
}
