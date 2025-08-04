import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bullmq';
import { NotificationJobName, QUEUES } from 'src/common/utils/constant.util';
import { Notification } from 'src/entities/notification.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ChatWebsocketGateway } from '../chat/chat.gateway';
import { ResponseDataWs } from 'src/common/types';
import { Chat } from 'src/entities/chat.entity';

@Processor(QUEUES.NOTIFICATION_QUEUE)
export class NotificationConsumer extends WorkerHost {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly chatSocket: ChatWebsocketGateway,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case NotificationJobName.GROUP_CREATED: {
        const payload = job.data as CreateNotificationDto<Partial<Chat>>;

        const ntf = await this.createNtf({ ...payload });

        const res: ResponseDataWs = {
          status: 'success',
          data: payload,
          message: 'Notice of creation of successful groups!',
        };

        this.chatSocket.notifyGroupMembers(
          `group-${payload.data.id}`,
          res,
          this.chatSocket.server,
          'notification',
        );
      }

      case 'concatenate': {
        break;
      }
    }
  }

  private async createNtf(data: CreateNotificationDto) {
    try {
      const dataMapping = data.receiverIds.map((item) => ({
        data: data.data,
        isRead: false,
        message: data.message,
        actor: data.actor,
        target: data.target,
        receiverId: { id: item },
        type: data.type,
      }));

      const queryBuilder =
        this.notificationRepo.createQueryBuilder('notification');

      return await queryBuilder
        .insert()
        .into(Notification)
        .values(dataMapping)
        .execute();
    } catch (error) {
      console.log('error', error);
    }
  }
}
