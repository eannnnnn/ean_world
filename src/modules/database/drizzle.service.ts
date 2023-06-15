import { Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

type IDrizzleService = NodePgDatabase<Record<string, never>>;

@Injectable()
export default class DrizzleService implements IDrizzleService {
  public declare _: IDrizzleService['_'];
  public declare $with: IDrizzleService['$with'];
  public declare with: IDrizzleService['with'];
  public declare select: IDrizzleService['select'];
  public declare update: IDrizzleService['update'];
  public declare insert: IDrizzleService['insert'];
  public declare delete: IDrizzleService['delete'];
  public declare refreshMaterializedView: IDrizzleService['refreshMaterializedView'];
  public declare transaction: IDrizzleService['transaction'];
  public declare execute: IDrizzleService['execute'];
  public declare query: IDrizzleService['query'];
}
