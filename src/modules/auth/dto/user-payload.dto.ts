import { ApiProperty } from '@nestjs/swagger';

export class UserPayload {
  @ApiProperty({ description: 'ID', example: 1 })
  id: string;

  @ApiProperty({ description: 'Email', example: '123@gmail.com' })
  email: string;
  @ApiProperty({ description: 'Name', example: 'Nguy A' })
  fullName: string;
}
