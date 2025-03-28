import { pgTable, text, date, time, timestamp, index } from 'drizzle-orm/pg-core';
import { user } from '../auth-schema';
import { relations } from 'drizzle-orm';

// Shift exchange platform
export const shift = pgTable(
  'shift',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    date: date('date').notNull(),
    startTime: time('start_time').notNull(),
    endTime: time('end_time').notNull(),
    location: text('location').notNull(),
    department: text('department').notNull(),
    type: text('type').notNull(), // offering, requesting
    status: text('status').notNull(), // open, filled, canceled, expired
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    index('shift_user_id_idx').on(t.userId),
    index('shift_date_idx').on(t.date),
    index('shift_status_idx').on(t.status),
    index('shift_department_idx').on(t.department),
  ],
);

export const shiftRelations = relations(shift, ({ one, many }) => ({
  user: one(user, {
    fields: [shift.userId],
    references: [user.id],
  }),
  applications: many(shiftApplication),
}));

// Shift applications
export const shiftApplication = pgTable(
  'shift_application',
  {
    id: text('id').primaryKey(),
    shiftId: text('shift_id')
      .notNull()
      .references(() => shift.id, { onDelete: 'cascade' }),
    applicantId: text('applicant_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    status: text('status').notNull(), // pending, accepted, rejected
    message: text('message'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    index('shift_application_shift_id_idx').on(t.shiftId),
    index('shift_application_applicant_id_idx').on(t.applicantId),
    index('shift_application_status_idx').on(t.status),
  ],
);

export const shiftApplicationRelations = relations(shiftApplication, ({ one }) => ({
  shift: one(shift, {
    fields: [shiftApplication.shiftId],
    references: [shift.id],
  }),
  applicant: one(user, {
    fields: [shiftApplication.applicantId],
    references: [user.id],
  }),
}));
