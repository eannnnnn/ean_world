import { Injectable } from '@nestjs/common';

import { NodePgDatabase } from 'drizzle-orm/node-postgres';

type IDrizzleService = NodePgDatabase<Record<string, never>>;

@Injectable()
export default class DrizzleService implements IDrizzleService {
  _: any;
  query: any;
  $with: any;
  with: any;
  select: any;
  update: any;
  insert: any;
  delete: any;
  refreshMaterializedView: any;
  execute: any;
  transaction: any;
}
