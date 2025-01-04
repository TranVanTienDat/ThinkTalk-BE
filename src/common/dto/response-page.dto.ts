import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from './meta.dto';

export class ResponsePageDto<T> {
  @ApiProperty()
  public readonly data: T[];

  @ApiProperty()
  public readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    (this.data = data), (this.meta = meta);
  }
}
