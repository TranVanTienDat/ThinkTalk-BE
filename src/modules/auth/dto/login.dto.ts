import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Email', example: '123@gmail.com' })
  @IsEmail()
  email: string;
  @ApiProperty({ description: 'Password', example: '12345' })
  @IsNotEmpty()
  password: string;
}
