import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageReadDto {
  @IsNotEmpty()
  @IsString()
  messageId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
