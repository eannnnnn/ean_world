import { ApiProperty } from '@nestjs/swagger';

export default class GetAccountResponse {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
