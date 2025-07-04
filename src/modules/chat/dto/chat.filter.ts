import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { BaseFilter } from '../../../common/entities/base.filter';

export class ChatFilter extends BaseFilter {}
