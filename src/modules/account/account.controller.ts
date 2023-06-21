import { Body } from '@nestjs/common';
import { ErrorCode } from 'src/errors/error.const';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from 'src/open-api/api-response.decorator';
import { AppController } from 'src/open-api/app-controller.decorator';
import { AppJwtGuard } from 'src/open-api/app-guard.decorator';
import { AppGet, AppPost } from 'src/open-api/app-method.decorator';
import { User } from './account.decorator';
import AccountService from './account.service';
import CreateAccountDTO from './dtos/create-account.dto';
import JwtUser from './dtos/jwt-user.dto';
import SignInAccountDTO from './dtos/sign-in-account.dto';
import GetAccountResponse from './response/get-account.response';

@AppController('/account', 'account - 회원정보')
export default class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @AppJwtGuard
  @AppGet('/', '내 정보')
  @ApiOkResponse('내 정보 조회 성공', GetAccountResponse)
  async getAccount(@User() user: JwtUser) {
    return await this.accountService.getAccount(user.id);
  }

  @AppPost('/sign-in', '로그인')
  @ApiOkResponse('로그인 성공시', String)
  @ApiBadRequestResponse([ErrorCode.PASSWORD_NOT_MATCHED, '로그인 실패 시'])
  async signIn(@Body() data: SignInAccountDTO) {
    return await this.accountService.signIn(data);
  }

  @AppPost('/sign-up', '회원가입')
  @ApiCreatedResponse('회원가입 성공')
  @ApiBadRequestResponse([ErrorCode.EXISTED_ACCOUNT, '중복된 계정이 있는 경우'])
  async signUp(@Body() account: CreateAccountDTO) {
    return await this.accountService.signUp(account);
  }
}
