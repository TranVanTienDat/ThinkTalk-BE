import { IsEmail, IsNotEmpty } from 'class-validator';

export class authDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  fullName: string;
}
