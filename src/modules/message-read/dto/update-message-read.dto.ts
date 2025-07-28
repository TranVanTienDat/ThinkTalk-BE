import { PartialType } from '@nestjs/swagger';
import { CreateMessageReadDto } from './create-message-read.dto';

export class UpdateMessageReadDto extends PartialType(CreateMessageReadDto) {}
