import { Body } from '@nestjs/common';
import { ErrorCode } from 'src/errors/error.const';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
} from 'src/open-api/api-response.decorator';
import { AppController } from 'src/open-api/app-controller.decorator';
import { AppPost } from 'src/open-api/app-method.decorator';
import AccountService from './account.service';
import CreateAccountDTO from './dtos/create-account.dto';
import SignInAccountDTO from './dtos/sign-in-account.dto';

@AppController('/account', 'account - 회원정보')
export default class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @AppPost('/sign-in', '로그인')
  @ApiCreatedResponse('로그인 성공시', String)
  async signIn(@Body() data: SignInAccountDTO) {
    return await this.accountService.signIn(data);
  }

  @AppPost('/sign-up', '회원가입')
  @ApiCreatedResponse('회원가입 성공')
  @ApiBadRequestResponse('에러 발생시', ErrorCode.EXISTED_ACCOUNT)
  async signUp(@Body() account: CreateAccountDTO) {
    return await this.accountService.signUp(account);
  }
}
