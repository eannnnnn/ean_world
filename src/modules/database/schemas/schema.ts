import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const profile = pgTable(
  'profile',
  {
    id: serial('id').primaryKey().notNull(),
    userId: serial('user_id')
      .notNull()
      .references(() => account.id),
    imageId: serial('image_id').references(() => file.id),
    name: varchar('name').notNull(),
    uuid: uuid('uuid').defaultRandom().notNull(),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      uuidKey: uniqueIndex('profile_uuid_key').on(table.uuid),
    };
  },
);

export const feedReply = pgTable('feed_reply', {
  id: serial('id').primaryKey().notNull(),
  feedId: serial('feed_id')
    .notNull()
    .references(() => feed.id),
  userId: serial('user_id')
    .notNull()
    .references(() => account.id),
  contents: text('contents').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).defaultNow().notNull(),
});

export const file = pgTable(
  'file',
  {
    id: serial('id').primaryKey().notNull(),
    filePath: varchar('file_path').notNull(),
    hashName: varchar('hash_name').notNull(),
    extension: varchar('extension'),
    name: varchar('name'),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    uuid: uuid('uuid').defaultRandom().notNull(),
  },
  (table) => {
    return {
      uuidKey: uniqueIndex('file_uuid_key').on(table.uuid),
    };
  },
);

export const feed = pgTable(
  'feed',
  {
    id: serial('id').primaryKey().notNull(),
    userId: serial('user_id')
      .notNull()
      .references(() => account.id),
    contents: text('contents'),
    uuid: uuid('uuid').defaultRandom().notNull(),
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

export const account = pgTable(
  'account',
  {
    id: serial('id').primaryKey().notNull(),
    userId: varchar('user_id').notNull(),
    password: varchar('password').notNull(),
    uuid: uuid('uuid').defaultRandom().notNull(),
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
  feedId: serial('feed_id')
    .notNull()
    .references(() => feed.id),
  userId: serial('user_id')
    .notNull()
    .references(() => account.id),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
});

export const feedFiles = pgTable('feed_files', {
  feedId: serial('feed_id')
    .notNull()
    .references(() => feed.id),
  fileId: serial('file_id')
    .notNull()
    .references(() => file.id),
});
