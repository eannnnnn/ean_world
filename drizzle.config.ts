import type { Config } from 'drizzle-kit';

import { config } from 'dotenv';

config({
  path: '.env',
});

config({
  path: '.env.tunnel',
});

export default {
  schema: './src/modules/database/schemas/*',
  out: './drizzle',
  breakpoints: true,
  database: process.env.DB_DATABASE_NAME,
  host: process.env.DB_ENDPOINT,
  port: parseInt(process.env.SSH_TUNNEL_PORT || process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
} satisfies Config;
