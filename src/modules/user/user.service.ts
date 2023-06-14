import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import DrizzleService from '../database/drizzle.service';

@Injectable()
export default class UserService {
  constructor(private readonly databaseService: DrizzleService) {}

  async signIn() {
    return this.databaseService.execute(sql`SELECT 1`);
  }
}
