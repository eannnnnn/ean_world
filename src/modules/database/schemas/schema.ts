import {
  bigint,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const account = pgTable(
  'account',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
    userId: varchar('user_id').notNull(),
    password: varchar('password').notNull(),
    uuid: uuid('uuid').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      userIdKey: uniqueIndex('account_user_id_key').on(table.userId),
      uuidKey: uniqueIndex('account_uuid_key').on(table.uuid),
    };
  },
);

export const feedReactions = pgTable('feed_reactions', {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  feedId: bigint('feed_id', { mode: 'number' })
    .notNull()
    .references(() => feed.id),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  userId: bigint('user_id', { mode: 'number' })
    .notNull()
    .references(() => account.id),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
});

export const file = pgTable('file', {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
  filePath: varchar('file_path').notNull(),
  hashName: varchar('hash_name').notNull(),
  extension: varchar('extension'),
  name: varchar('name'),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
});

export const feedFiles = pgTable('feed_files', {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  feedId: bigint('feed_id', { mode: 'number' })
    .notNull()
    .references(() => feed.id),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  fileId: bigint('file_id', { mode: 'number' })
    .notNull()
    .references(() => file.id),
});

export const profile = pgTable('profile', {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  userId: bigint('user_id', { mode: 'number' })
    .notNull()
    .references(() => account.id),
  name: varchar('name').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  imageId: bigint('image_id', { mode: 'number' })
    .notNull()
    .references(() => file.id),
});

export const feed = pgTable(
  'feed',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    userId: bigint('user_id', { mode: 'number' })
      .notNull()
      .references(() => account.id),
    contents: text('contents'),
    uuid: uuid('uuid').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      uuidKey: uniqueIndex('feed_uuid_key').on(table.uuid),
    };
  },
);
