import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcrypt';
import { eq } from 'drizzle-orm';
import BadRequestException from 'src/errors/bad-request.exception';
import { ErrorCode } from 'src/errors/error.const';
import ConfigService from '../config/config.service';
import DrizzleService from '../database/drizzle.service';
import { account, profile } from '../database/schemas/schema';
import CreateAccountDTO from './dtos/create-account.dto';
import SignInAccountDTO from './dtos/sign-in-account.dto';
@Injectable()
export default class AccountService {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  /**
   * 내 정보 조회
   * @param id 유저 아이디
   */
  async getAccount(id: number) {
    const [data] = await this.drizzle
      .select({
        userId: account.userId,
        name: profile.name,
        uuid: account.uuid,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      })
      .from(account)
      .leftJoin(profile, eq(account.id, profile.userId))
      .where(eq(account.id, id));

    return data;
  }

  /** 로그인 */
  async signIn({ password, userId }: SignInAccountDTO) {
    const [data] = await this.drizzle
      .select()
      .from(account)
      .where(eq(account.userId, userId));

    if (!data) throw new BadRequestException(ErrorCode.PASSWORD_NOT_MATCHED);

    const isMatched = await compare(password, data.password);
    if (!isMatched)
      throw new BadRequestException(ErrorCode.PASSWORD_NOT_MATCHED);

    const token = this.jwtService.sign({ id: data.id });
    return token;
  }

  /** 회원가입 */
  async signUp(createAccountDTO: CreateAccountDTO) {
    const rows = await this.drizzle
      .select({
        userId: account.userId,
      })
      .from(account)
      .where(eq(account.userId, createAccountDTO.userId));

    if (rows.length > 0) {
      throw new BadRequestException(ErrorCode.EXISTED_ACCOUNT);
    }

    const salt = await genSalt(
      parseInt(this.config.get('SALT_ROUNDS') || '10'),
    );
    const encryptPassword = await hash(createAccountDTO.password, salt);

    await this.drizzle.transaction(async (tx) => {
      const [{ userId }] = await tx
        .insert(account)
        .values({
          userId: createAccountDTO.userId,
          password: encryptPassword,
        })
        .returning({
          userId: account.id,
        });
      await tx.insert(profile).values({
        userId,
        imageId: null,
        name: createAccountDTO.name,
      });
    });
  }
}
