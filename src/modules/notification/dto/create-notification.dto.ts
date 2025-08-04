import { Optional } from '@nestjs/common';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { NotificationJobType } from 'src/common/utils/constant.util';

export class CreateNotificationDto<T = any> {
  @IsEnum(NotificationJobType)
  @Optional()
  type: NotificationJobType;

  @IsString()
  actor?: string;

  @IsString()
  target?: string;

  @IsString()
  @IsNotEmpty()
  data: T;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  @IsArray()
  receiverIds: string[];
}
