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
import {
  AuthDto,
  LoginDto,
  LogInWithGoogleDto,
  LogoutDto,
} from './dto/auth.dto';
import { UserData } from './dto/user-data.dto';
import { UserPayload } from './dto/user-payload.dto';
import { v4 as uuidv4 } from 'uuid';
import { DeviceService } from '../device/device.service';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Access)
    private accessRepo: Repository<Access>,

    private readonly userService: UsersService,
    private readonly deviceService: DeviceService,
    private readonly accessService: AccessService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: AuthDto) {
    const { email, password, fullName, device_token, type, info, avatar } =
      registerDto;
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
        avatar: avatar || `https://i.pravatar.cc/150?u=${uuidv4()}`,
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
        info,
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
    const { device_token, info } = userPayLoad;

    const user = await this.userService.findUserService(userPayLoad);
    const oldDevice = user.devices.find(
      (device) => device.device_token === device_token,
    );

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    if (oldDevice) {
      await this.accessService.updateService(oldDevice.access.id, {
        refreshToken,
      });
    } else {
      await this.accessRepo.manager.transaction(async (manager) => {
        const access = manager.create(Access, {
          user,
          refreshToken,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        await manager.save(access);

        const device = manager.create(Device, {
          user,
          access,
          device_token,
          type: userPayLoad.type,
          info,
        });
        await manager.save(device);
      });
    }

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

  async loginGoogle(body: LogInWithGoogleDto) {
    try {
      const { device_token, info, token, type } = body;
      const client = new OAuth2Client();
      const account = await client.verifyIdToken({ idToken: token });
      const payload = account.getPayload();
      const user = await this.userService.findUserByEmailService({
        email: payload.email,
      });

      if (!user) {
        const registerInfo: AuthDto = {
          device_token,
          email: payload.email,
          fullName: payload.name,
          password: payload.email,
          type,
          info,
        };
        return await this.register(registerInfo);
      }

      const oldDevice = user.devices.find(
        (device) => device.device_token === device_token,
      );

      const accessToken = await this.generateAccessToken(user);
      const refreshToken = await this.generateRefreshToken(user);

      if (oldDevice) {
        await this.accessService.updateService(oldDevice.access.id, {
          refreshToken,
        });
      } else {
        await this.accessRepo.manager.transaction(async (manager) => {
          const access = manager.create(Access, {
            user,
            refreshToken,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
          await manager.save(access);

          const device = manager.create(Device, {
            user,
            access,
            device_token,
            type,
            info,
          });
          await manager.save(device);
        });
      }

      return {
        statusCode: 200,
        message: 'Login successfully !',
        user: plainToInstance(UserData, {
          ...user,
          accessToken,
          refreshToken,
        }),
      };
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  async logoutService(logout: LogoutDto) {
    const { device_token } = logout;
    const device = await this.deviceService.findOneService(
      'device_token',
      device_token,
    );
    if (!device) throw new BadRequestException('Logout not successfully');

    await this.accessRepo.delete({ id: device.access.id });
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
