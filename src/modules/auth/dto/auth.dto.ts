import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class BaseAuthDto {
  @ApiProperty({ description: 'Email', example: '123@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password', example: '12345' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Type device', example: 'Mobile' })
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Device token', example: '32435ggbd5' })
  @IsNotEmpty()
  device_token: string;
}

export class AuthDto extends BaseAuthDto {
  @ApiProperty({ description: 'Fullname', example: 'Nguyen Van A' })
  @IsNotEmpty()
  fullName: string;
}

export class LoginDto extends BaseAuthDto {}
