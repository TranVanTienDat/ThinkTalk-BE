import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from './config/config.module';
import { ChatModule } from './modules/chat/chat.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guard/jwt-auth.guard';
import { AccessModule } from './modules/access/access.module';
import { DeviceModule } from './modules/device/device.module';
import { SeedModule } from './modules/seed/seed.module';
import { WsAuthGuard } from './common/guard/ws-auth.guard';
import { MessageModule } from './modules/message/message.module';
import { MessageReadModule } from './modules/message-read/message-read.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
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
