import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { verifyPassword } from '../../common/utils/security.util';
import { User } from '../../entities/user.entity';
import { BaseAuthDto, LoginDto } from '../auth/dto/auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public getRepository(): Repository<User> {
    return this.userRepository;
  }

  public async findUserByEmailService(value: Partial<BaseAuthDto>) {
    const user = await this.userRepository.findOne({
      where: { email: value.email },
      withDeleted: false,
    });

    return user;
  }

  public async findUserByIdService(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: false,
    });

    return user;
  }

  public async findUserService(value: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: value.email },
      relations: {
        devices: {
          access: true,
        },
        access: true,
      },
      withDeleted: false,
    });

    if (!user) {
      throw new NotFoundException('Not found user');
    }
    if (user.password) {
      const isMatch = await verifyPassword(value.password, user.password);

      if (!isMatch) {
        throw new BadGatewayException('Wrong password');
      }
    }

    return user;
  }
}
