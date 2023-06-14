import { Controller, Get } from '@nestjs/common';
import UserService from './user.service';

@Controller('/user')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async signIn() {
    return this.userService.signIn();
  }
}
