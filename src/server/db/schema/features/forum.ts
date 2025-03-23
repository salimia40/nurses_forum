import { pgTable, text, integer, timestamp, boolean, index, primaryKey } from 'drizzle-orm/pg-core';
import { user } from '../auth-schema';

// Specialized categories for forums (ICU, pediatric, geriatric, etc.)
export const category = pgTable(
  'category',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    slug: text('slug').notNull().unique(),
    icon: text('icon'),
    isRegional: boolean('is_regional').default(false),
    hospitalSpecific: boolean('hospital_specific').default(false),
    parentId: text('parent_id').references(() => category.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [index('category_slug_idx').on(t.slug)],
);

// Threads in forum categories
export const thread = pgTable(
  'thread',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    categoryId: text('category_id')
      .notNull()
      .references(() => category.id, { onDelete: 'cascade' }),
    authorId: text('author_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    isPinned: boolean('is_pinned').default(false),
    isLocked: boolean('is_locked').default(false),
    viewCount: integer('view_count').default(0).notNull(),
    followCount: integer('follow_count').default(0).notNull(), // Count of users following this thread
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    lastActivityAt: timestamp('last_activity_at').defaultNow().notNull(),
  },
  (t) => [
    index('thread_category_id_idx').on(t.categoryId),
    index('thread_author_id_idx').on(t.authorId),
    index('thread_last_activity_idx').on(t.lastActivityAt),
  ],
);

// Comments/replies to threads
export const comment = pgTable(
  'comment',
  {
    id: text('id').primaryKey(),
    content: text('content').notNull(),
    threadId: text('thread_id')
      .notNull()
      .references(() => thread.id, { onDelete: 'cascade' }),
    authorId: text('author_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    parentId: text('parent_id').references(() => comment.id, { onDelete: 'set null' }),
    isEdited: boolean('is_edited').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    index('comment_thread_id_idx').on(t.threadId),
    index('comment_author_id_idx').on(t.authorId),
    index('comment_parent_id_idx').on(t.parentId),
  ],
);

// Thread reactions (likes, helpful, etc.)
export const threadReaction = pgTable(
  'thread_reaction',
  {
    threadId: text('thread_id')
      .notNull()
      .references(() => thread.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    type: text('type').notNull(), // like, helpful, insightful, etc.
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.threadId, t.userId, t.type] })],
);

// Comment reactions
export const commentReaction = pgTable(
  'comment_reaction',
  {
    commentId: text('comment_id')
      .notNull()
      .references(() => comment.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    type: text('type').notNull(), // like, helpful, insightful, etc.
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.commentId, t.userId, t.type] })],
);

// User follows for threads - tracks which threads a user is following
export const threadFollow = pgTable(
  'thread_follow',
  {
    id: text('id').primaryKey(),
    threadId: text('thread_id')
      .notNull()
      .references(() => thread.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    notificationsEnabled: boolean('notifications_enabled').default(true),
    followedAt: timestamp('followed_at').defaultNow().notNull(),
  },
  (t) => [
    index('thread_follow_thread_id_idx').on(t.threadId),
    index('thread_follow_user_id_idx').on(t.userId),
    primaryKey({ columns: [t.threadId, t.userId] }),
  ],
);

// User follows for categories - tracks which categories a user is following
export const categoryFollow = pgTable(
  'category_follow',
  {
    id: text('id').primaryKey(),
    categoryId: text('category_id')
      .notNull()
      .references(() => category.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    notificationsEnabled: boolean('notifications_enabled').default(true),
    followedAt: timestamp('followed_at').defaultNow().notNull(),
  },
  (t) => [
    index('category_follow_category_id_idx').on(t.categoryId),
    index('category_follow_user_id_idx').on(t.userId),
    primaryKey({ columns: [t.categoryId, t.userId] }),
  ],
);

// User follows for other users - tracks which users a user is following
export const userFollow = pgTable(
  'user_follow',
  {
    id: text('id').primaryKey(),
    followedId: text('followed_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    followerId: text('follower_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    notificationsEnabled: boolean('notifications_enabled').default(true),
    followedAt: timestamp('followed_at').defaultNow().notNull(),
  },
  (t) => [
    index('user_follow_followed_id_idx').on(t.followedId),
    index('user_follow_follower_id_idx').on(t.followerId),
    primaryKey({ columns: [t.followedId, t.followerId] }),
  ],
);
