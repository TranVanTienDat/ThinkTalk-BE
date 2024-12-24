import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      cache: true,
      expandVariables: true,
    }),
  ],
})
export class ConfigModule {}
