import { Body } from '@nestjs/common';
import { ErrorCode } from 'src/errors/error.const';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from 'src/open-api/api-response.decorator';
import { AppController } from 'src/open-api/app-controller.decorator';
import { AppGet, AppPost } from 'src/open-api/app-method.decorator';
import AccountService from './account.service';
import CreateAccountDTO from './dtos/create-account.dto';
import SignInAccountDTO from './dtos/sign-in-account.dto';
import { AppJwtGuard } from 'src/open-api/app-guard.decorator';
import { User } from './account.decorator';
import JwtUser from './dtos/jwt-user.dto';
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
  @ApiBadRequestResponse(
    '계정이 없거나, 비밀번호가 틀린경우',
    ErrorCode.PASSWORD_NOT_MATCHED,
  )
  async signIn(@Body() data: SignInAccountDTO) {
    return await this.accountService.signIn(data);
  }

  @AppPost('/sign-up', '회원가입')
  @ApiCreatedResponse('회원가입 성공')
  @ApiBadRequestResponse('중복된 ID가 존재하는 경우', ErrorCode.EXISTED_ACCOUNT)
  async signUp(@Body() account: CreateAccountDTO) {
    return await this.accountService.signUp(account);
  }
}
