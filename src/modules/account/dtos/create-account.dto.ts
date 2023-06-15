import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';

export default class CreateAccountDTO {
  @IsString()
  @ApiProperty({
    description: '유저 이름',
    default: 'test',
  })
  name: string;

  @IsString()
  @MinLength(4)
  @ApiProperty({
    minLength: 4,
    description: '로그인 ID',
    default: 'test',
  })
  userId: string;

  @IsString()
  @Matches(
    /(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[₩\]^_`{|}~])(?=.*[a-z])[a-zA-Z\d!"#$%&'()*+,\-./:;<=>?@[₩\]^_`{|}~]{8,20}$/g,
  )
  @ApiProperty({
    description: '로그인 비밀번호',
    pattern: `(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[₩\]^_\`{|}~])(?=.*[a-z])[a-zA-Z\d!"#$%&'()*+,\-./:;<=>?@[₩\]^_\`{|}~]{8,20}$`,
    default: '!Q2w3e4r',
  })
  password: string;
}
