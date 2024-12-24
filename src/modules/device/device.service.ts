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

  async findOneService(id: string) {
    const result = await this.deviceRepo.findOne({
      where: { id: id },
      relations: {
        access: true,
      },
    });
    return result;
  }

  remove(id: number) {
    return `This action removes a #${id} device`;
  }
}
