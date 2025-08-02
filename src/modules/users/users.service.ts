import {
  BadGatewayException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { verifyPassword } from '../../common/utils/security.util';
import { User } from '../../entities/user.entity';
import { BaseAuthDto, LoginDto } from '../auth/dto/auth.dto';
import { UserFilter } from './dto/filter.dto';
import { PageDto, PageMetaDto } from 'src/common/dto';
import { ResponsePageDto } from 'src/common/dto/response-page.dto';
import { plainToInstance } from 'class-transformer';
import { UserPayload } from '../auth/dto/user-payload.dto';
import { Chat, ChatStatus } from 'src/entities/chat.entity';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => ChatService))
    private chatService: ChatService,
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

  public async getUserWithChatPrivateService(
    filter: UserFilter,
    user: UserPayload,
  ) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (filter.search) {
      queryBuilder.andWhere(
        '(LOWER(user.fullName) LIKE LOWER(:search) OR LOWER(user.nickname) LIKE LOWER(:search))',
        { search: `%${filter.search}%` },
      );
    }

    // Lọc user khác current user
    queryBuilder.andWhere('user.id != :currentUserId', {
      currentUserId: user.id,
    });

    const [users, count] = await queryBuilder
      .take(filter.limit)
      .skip(filter.skip)
      .getManyAndCount();

    const newUsers = await Promise.all(
      users.map(async (item) => {
        const chatId = await this.chatService.findPrivateChatBetweenUsers(
          item.id,
          user,
        );
        return { ...item, ...chatId };
      }),
    );

    const pageMetaDto = new PageMetaDto({
      pageDto: filter.pageDto,
      total: count,
    });

    return new ResponsePageDto(
      newUsers.map((u) => plainToInstance(User, { ...u })),
      pageMetaDto,
    );
  }
}
