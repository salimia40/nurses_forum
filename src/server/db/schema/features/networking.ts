import {
  pgTable,
  text,
  date,
  integer,
  timestamp,
  boolean,
  index,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { user } from '../auth-schema';

// Mentorship relationships
export const mentorship = pgTable(
  'mentorship',
  {
    id: text('id').primaryKey(),
    mentorId: text('mentor_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    menteeId: text('mentee_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    status: text('status').notNull(), // pending, active, completed, rejected
    specialtyFocus: text('specialty_focus'),
    notes: text('notes'),
    startDate: date('start_date'),
    endDate: date('end_date'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    index('mentorship_mentor_id_idx').on(t.mentorId),
    index('mentorship_mentee_id_idx').on(t.menteeId),
    index('mentorship_status_idx').on(t.status),
  ],
);

// Events calendar
export const event = pgTable(
  'event',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    location: text('location'),
    startDateTime: timestamp('start_date_time').notNull(),
    endDateTime: timestamp('end_date_time').notNull(),
    organizerId: text('organizer_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    type: text('type').notNull(), // professional_development, meetup, continuing_education, etc.
    isOnline: boolean('is_online').default(false),
    meetingUrl: text('meeting_url'),
    maxParticipants: integer('max_participants'),
    imageUrl: text('image_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    index('event_organizer_id_idx').on(t.organizerId),
    index('event_start_date_time_idx').on(t.startDateTime),
    index('event_type_idx').on(t.type),
  ],
);

// Event participants
export const eventParticipant = pgTable(
  'event_participant',
  {
    eventId: text('event_id')
      .notNull()
      .references(() => event.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    status: text('status').notNull(), // registered, attended, canceled
    registeredAt: timestamp('registered_at').defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.eventId, t.userId] }),
    index('event_participant_status_idx').on(t.status),
  ],
);
