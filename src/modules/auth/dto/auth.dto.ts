import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsJSON, IsNotEmpty } from 'class-validator';

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

  @ApiProperty({
    description: 'Additional info as JSON object',
    example: { browser: 'chrome' },
  })
  @IsNotEmpty()
  info: Record<string, any>;

  @ApiProperty({ description: 'avatar', example: 'link' })
  avatar?: string;
}

export class LoginDto extends BaseAuthDto {
  @IsNotEmpty()
  info: Record<string, any>;
}

export class LogoutDto {
  @ApiProperty({ description: 'Device token', example: '32435ggbd5' })
  @IsNotEmpty()
  device_token: string;
}



export class LogInWithGoogleDto {
  @ApiProperty({ description: 'Token', example: '32435ggbd5' })
  @IsNotEmpty()
  token: string;

   @ApiProperty({
    description: 'Additional info as JSON object',
    example: { browser: 'chrome' },
  })
    @IsNotEmpty()
  info: Record<string, any>;

    @ApiProperty({ description: 'Type device', example: 'Mobile' })
    @IsNotEmpty()
    type: string;

  @ApiProperty({ description: 'Device token', example: '32435ggbd5' })
  @IsNotEmpty()
  device_token: string;
}