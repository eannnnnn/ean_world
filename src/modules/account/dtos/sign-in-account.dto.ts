import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class SignInAccountDTO {
  @IsString()
  @ApiProperty({
    default: 'test',
    description: '로그인 ID',
  })
  userId: string;

  @IsString()
  @ApiProperty({
    default: '!Q2w3e4r',
    description: '로그인 비밀번호',
  })
  password: string;
}
