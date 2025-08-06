import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from '../../entities/device.entity';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private deviceRepo: Repository<Device>,
  ) {}

  findAll() {
    return `This action returns all device`;
  }

  async findOneService(key: string, value: string) {
    const result = await this.deviceRepo.findOne({
      where: { [key]: value },
      relations: {
        access: true,
      },
    });
    return result;
  }

  async remove(device_token: string) {
    return await this.deviceRepo.delete({ device_token: device_token });
  }
}
