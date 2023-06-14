import { Provider } from '@nestjs/common';
import { Pool } from 'pg';

// import { drizzle } from 'drizzle-orm/aws-data-api/pg';
import { sql } from 'drizzle-orm';
import { drizzle as drizzle_dev } from 'drizzle-orm/node-postgres';
import ConfigService from '../config/config.service';
import DrizzleService from './drizzle.service';

export default {
  provide: DrizzleService,
  inject: [ConfigService],
  async useFactory(configService: ConfigService) {
    const port = parseInt(configService.get('DB_PORT'));
    const tunnelPort = parseInt(configService.get('SSH_TUNNEL_PORT'));
    const user = configService.get('DB_USERNAME');
    const password = configService.get('DB_PASSWORD');
    const host = configService.get('DB_ENDPOINT');
    const database = configService.get('DB_DATABASE_NAME');

    const pool = new Pool({
      port: tunnelPort || port,
      user,
      password,
      host,
      database,
      max: 60,
      min: 1,
    });
    const db = drizzle_dev(pool, { logger: true });
    await db.execute(sql`SELECT 2`);
    return db;
  },
} as Provider;
