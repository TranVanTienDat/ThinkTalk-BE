import { ConfigService } from '@nestjs/config';
import path from 'path';
import { DataSource } from 'typeorm';

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  url: configService.get('DATABASE_URL'),
  entities: [path.resolve(__dirname, '..') + '/**/*.entity{.ts,.js}'],
  migrations: ['migrations/**'],
  synchronize: false,
});
