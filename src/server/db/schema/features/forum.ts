import { pgTable, text, integer, timestamp, boolean, index, primaryKey } from 'drizzle-orm/pg-core';
import { user } from '../auth-schema';
import { relations } from 'drizzle-orm';

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

export const categoryRelations = relations(category, ({ one, many }) => ({
  parent: one(category, {
    fields: [category.parentId],
    references: [category.id],
  }),
  subcategories: many(category),
  threads: many(thread),
  followers: many(categoryFollow),
}));

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

export const threadRelations = relations(thread, ({ one, many }) => ({
  category: one(category, {
    fields: [thread.categoryId],
    references: [category.id],
  }),
  author: one(user, {
    fields: [thread.authorId],
    references: [user.id],
  }),
  comments: many(comment),
  reactions: many(threadReaction),
  followers: many(threadFollow),
}));

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

export const commentRelations = relations(comment, ({ one, many }) => ({
  thread: one(thread, {
    fields: [comment.threadId],
    references: [thread.id],
  }),
  author: one(user, {
    fields: [comment.authorId],
    references: [user.id],
  }),
  parent: one(comment, {
    fields: [comment.parentId],
    references: [comment.id],
  }),
  replies: many(comment, { relationName: 'replies' }),
  reactions: many(commentReaction),
}));

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

export const threadReactionRelations = relations(threadReaction, ({ one }) => ({
  thread: one(thread, {
    fields: [threadReaction.threadId],
    references: [thread.id],
  }),
  user: one(user, {
    fields: [threadReaction.userId],
    references: [user.id],
  }),
}));

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

export const commentReactionRelations = relations(commentReaction, ({ one }) => ({
  comment: one(comment, {
    fields: [commentReaction.commentId],
    references: [comment.id],
  }),
  user: one(user, {
    fields: [commentReaction.userId],
    references: [user.id],
  }),
}));

// User follows for threads - tracks which threads a user is following
export const threadFollow = pgTable(
  'thread_follow',
  {
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

export const threadFollowRelations = relations(threadFollow, ({ one }) => ({
  thread: one(thread, {
    fields: [threadFollow.threadId],
    references: [thread.id],
  }),
  user: one(user, {
    fields: [threadFollow.userId],
    references: [user.id],
  }),
}));

// User follows for categories - tracks which categories a user is following
export const categoryFollow = pgTable(
  'category_follow',
  {
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

export const categoryFollowRelations = relations(categoryFollow, ({ one }) => ({
  category: one(category, {
    fields: [categoryFollow.categoryId],
    references: [category.id],
  }),
  user: one(user, {
    fields: [categoryFollow.userId],
    references: [user.id],
  }),
}));

// User follows for other users - tracks which users a user is following
export const userFollow = pgTable(
  'user_follow',
  {
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

export const userFollowRelations = relations(userFollow, ({ one }) => ({
  followed: one(user, {
    fields: [userFollow.followedId],
    references: [user.id],
    relationName: 'followed',
  }),
  follower: one(user, {
    fields: [userFollow.followerId],
    references: [user.id],
    relationName: 'follower',
  }),
}));
