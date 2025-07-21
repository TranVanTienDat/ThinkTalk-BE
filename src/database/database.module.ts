import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          url: configService.get('DATABASE_URL'),
          entities: [path.resolve(__dirname, '..') + '/**/*.entity{.ts,.js}'],
          autoLoadEntities: true,
          synchronize: true,
          ssl: false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
