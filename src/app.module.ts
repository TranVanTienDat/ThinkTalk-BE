import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './common/guard/jwt-auth.guard';
import { AccessModule } from './modules/access/access.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { DeviceModule } from './modules/device/device.module';
import { MessageReadModule } from './modules/message-read/message-read.module';
import { MessageModule } from './modules/message/message.module';
import { SeedModule } from './modules/seed/seed.module';
import { UsersModule } from './modules/users/users.module';
import { CacheCustomModule } from './common/cache-custom/cache-custom.module';
import { ConfigModule } from './common/config/config.module';
import { DatabaseModule } from './common/database/database.module';
import { NotificationModule } from './notification/notification.module';
import { BullModule } from '@nestjs/bullmq';
import { QUEUES } from './common/utils/constant.util';

@Module({
  imports: [
    ConfigModule,
    CacheCustomModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          url: configService.get<string>('REDIS_URL') ?? 'localhost:6000',
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: QUEUES.MSG_QUEUE,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    ChatModule,
    AccessModule,
    DeviceModule,
    SeedModule,
    MessageModule,
    MessageReadModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: WsAuthGuard,
    // },
  ],
})
export class AppModule {}
