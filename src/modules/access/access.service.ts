import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Access } from '../../entities/access.entity';

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(Access)
    private accessRepo: Repository<Access>,
  ) {}
  create() {
    return 'This action adds a new access';
  }

  findAll() {
    return `This action returns all access`;
  }

  findOneService() {}

  async updateService(id: string, value: Partial<Access>) {
    const result = await this.accessRepo.update(id, value);
    return result;
  }

  remove(id: number) {
    return `This action removes a #${id} access`;
  }
}
