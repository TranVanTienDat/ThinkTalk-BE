import { PartialType } from '@nestjs/swagger';
import { Notification } from 'src/entities/notification.entity';

export class UpdateNotificationDto extends PartialType(Notification) {}
