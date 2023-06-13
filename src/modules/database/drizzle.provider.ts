import { Provider } from '@nestjs/common';
import { Pool } from 'pg';

// import { drizzle } from 'drizzle-orm/aws-data-api/pg';
import { sql } from 'drizzle-orm';
import { drizzle as drizzle_dev } from 'drizzle-orm/node-postgres';
import { sshTunnel } from '../libs/ssh-tunnel';
import ConfigService from '../config/config.service';

export default {
  provide: 'DRIZZLE_ORM',
  inject: [ConfigService],
  async useFactory(configService: ConfigService) {
    const port = parseInt(configService.get('DB_PORT'));
    const user = configService.get('DB_USERNAME');
    const password = configService.get('DB_PASSWORD');
    const host = configService.get('DB_ENDPOINT');
    const database = configService.get('DB_DATABASE_NAME');

    const tunnelPort = await sshTunnel({
      host,
      port,
      ssh: {
        username: configService.get('SSH_USERNAME'),
        password: configService.get('SSH_PASSWORD'),
        host: configService.get('SSH_HOST'),
        port: parseInt(configService.get('SSH_PORT')),
      },
    });

    const pool = new Pool({
      port: tunnelPort,
      user,
      password,
      host: 'localhost',
      database,
      max: 60,
      min: 1,
    });
    const db = drizzle_dev(pool, { logger: true });
    await db.execute(sql`SELECT 1`);
    return db;
  },
} as Provider;
