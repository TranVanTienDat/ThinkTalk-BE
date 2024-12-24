import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../common/entities/base.entity';

export class UserData extends BaseEntity {
  @ApiProperty({ description: 'Email', example: '123@gmail.com' })
  email: string;
  @ApiProperty({ description: 'Password', example: '12345' })
  @Exclude()
  password: string;

  @ApiProperty({ description: 'devices', example: {} })
  @Exclude()
  devices: string;

  @ApiProperty({ description: 'access', example: {} })
  @Exclude()
  access: string;

  @ApiProperty({ description: 'fullname', example: 'Nguyen Van A' })
  fullName: string;

  @ApiProperty({ description: 'nickname', example: 'CHIKAWWA' })
  nickname: string;

  @ApiProperty({ description: 'avatar', example: 'link' })
  avatar: string;

  @ApiProperty({
    description: 'access token',
    example:
      'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJERUZBVUxUX0lTU1VFUiIsImlhdCI6MTYzMTEwNDMzNCwicm9sZSI6InJlc3RyaWN0ZWQifQ.o2HcQBBpx-EJMcUFiqmAiD_jZ5J92gRDOyhybT9FakE',
  })
  public readonly accessToken: string;

  @ApiProperty({
    description: 'refresh token',
    example:
      'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJERUZBVUxUX0lTU1VFUiIsImlhdCI6MTYzMTEwNDMzNCwicm9sZSI6InJlc3RyaWN0ZWQifQ.o2HcQBBpx-EJMcUFiqmAiD_jZ5J92gRDOyhybT9FakE',
  })
  public readonly refreshToken: string;
}
