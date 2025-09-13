import { forwardRef, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationConsumer } from './notification.processor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/entities/notification.entity';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from 'src/common/utils/constant.util';
import { ChatModule } from '../chat/chat.module';
import { NotificationGateway } from './notification.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    BullModule.registerQueue({
      name: QUEUES.NOTIFICATION_QUEUE,
      defaultJobOptions: {
        removeOnComplete: true, // Xóa job khi hoàn thành
        attempts: 3, // Số lần thử lại
        backoff: {
          type: 'exponential', // Kiểu backoff
          delay: 1000, // Thời gian delay giữa các lần thử
        },
      },
    }),
    forwardRef(() => ChatModule),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationConsumer,NotificationGateway],
  exports: [NotificationService,NotificationGateway],
})
export class NotificationModule {}
