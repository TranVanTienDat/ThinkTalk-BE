import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { NotificationJobName, QUEUES } from 'src/common/utils/constant.util';
import { Queue } from 'bullmq';
import { NotificationFilter } from './dto/notification.filter.dto';
import { UserPayload } from '../auth/dto/user-payload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/entities/notification.entity';
import { Repository } from 'typeorm';
import { PageMetaDto } from 'src/common/dto';
import { ResponsePageDto } from 'src/common/dto/response-page.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class NotificationService {
  constructor(
    @InjectQueue(QUEUES.NOTIFICATION_QUEUE) private NotificationQueue: Queue,
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
  ) {}

  async create(notification: CreateNotificationDto) {
    await this.NotificationQueue.add(
      NotificationJobName.GROUP_CREATED,
      {
        ...notification,
      },
      {
        priority: 1,
      },
    );
  }

  async findAll(filter: NotificationFilter, user: UserPayload) {
    const queryBuilder =
      this.notificationRepo.createQueryBuilder('notification');

    queryBuilder
      .where('notification.receiverId = :userId', { userId: user.id })
      .orderBy(`notification.${filter.orderBy}`, filter.order)
      .skip(filter.skip)
      .take(filter.limit);

    if (filter.search) {
      queryBuilder.andWhere('LOWER(notification.message) LIKE LOWER(:search)', {
        search: `%${filter.search}%`,
      });
    }

    const [notifications, notificationCount] =
      await queryBuilder.getManyAndCount();

    const pageMetaDto = new PageMetaDto({
      pageDto: filter.pageDto,
      total: notificationCount,
    });

    return new ResponsePageDto(notifications, pageMetaDto);
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    const notification = await this.notificationRepo.findOneBy({ id });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    await this.notificationRepo.update(id, updateNotificationDto);
    return await this.notificationRepo.findOneBy({ id });
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
