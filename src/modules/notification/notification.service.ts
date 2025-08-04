import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { NotificationJobName, QUEUES } from 'src/common/utils/constant.util';
import { Queue } from 'bullmq';

@Injectable()
export class NotificationService {
  constructor(
    @InjectQueue(QUEUES.NOTIFICATION_QUEUE) private NotificationQueue: Queue,
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

  findAll() {
    return `This action returns all notification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
