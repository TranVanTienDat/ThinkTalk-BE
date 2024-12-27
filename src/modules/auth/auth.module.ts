import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../../entities/user.entity';
import { UsersModule } from '../users/users.module';
import { Access } from '../../entities/access.entity';
import { Device } from '../../entities/device.entity';
import { AccessModule } from '../access/access.module';
import { DeviceModule } from '../device/device.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Access, Device]),
    UsersModule,
    AccessModule,
    DeviceModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
