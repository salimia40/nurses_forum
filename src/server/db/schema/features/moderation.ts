import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';
import { user } from '../auth-schema';
import { relations } from 'drizzle-orm';

// User reports (for moderation)
export const userReport = pgTable(
  'user_report',
  {
    id: text('id').primaryKey(),
    reporterId: text('reporter_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    reportedUserId: text('reported_user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    reason: text('reason').notNull(),
    details: text('details'),
    status: text('status').notNull(), // pending, reviewed, dismissed, action_taken
    moderatorId: text('moderator_id').references(() => user.id, { onDelete: 'set null' }),
    moderatorNotes: text('moderator_notes'),
    resolution: text('resolution'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    index('user_report_reporter_id_idx').on(t.reporterId),
    index('user_report_reported_user_id_idx').on(t.reportedUserId),
    index('user_report_status_idx').on(t.status),
  ],
);

export const userReportRelations = relations(userReport, ({ one }) => ({
  reporter: one(user, {
    fields: [userReport.reporterId],
    references: [user.id],
    relationName: 'reporter',
  }),
  reportedUser: one(user, {
    fields: [userReport.reportedUserId],
    references: [user.id],
    relationName: 'reportedUser',
  }),
  moderator: one(user, {
    fields: [userReport.moderatorId],
    references: [user.id],
    relationName: 'moderator',
  }),
}));

// Content reports (for threads, comments, resources, etc.)
export const contentReport = pgTable(
  'content_report',
  {
    id: text('id').primaryKey(),
    reporterId: text('reporter_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    contentType: text('content_type').notNull(), // thread, comment, resource, etc.
    contentId: text('content_id').notNull(),
    reason: text('reason').notNull(),
    details: text('details'),
    status: text('status').notNull(), // pending, reviewed, dismissed, action_taken
    moderatorId: text('moderator_id').references(() => user.id, { onDelete: 'set null' }),
    moderatorNotes: text('moderator_notes'),
    resolution: text('resolution'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    index('content_report_reporter_id_idx').on(t.reporterId),
    index('content_report_content_type_id_idx').on(t.contentType, t.contentId),
    index('content_report_status_idx').on(t.status),
  ],
);

export const contentReportRelations = relations(contentReport, ({ one }) => ({
  reporter: one(user, {
    fields: [contentReport.reporterId],
    references: [user.id],
  }),
  moderator: one(user, {
    fields: [contentReport.moderatorId],
    references: [user.id],
  }),
}));
