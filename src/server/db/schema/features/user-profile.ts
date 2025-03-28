import { pgTable, text, integer, timestamp, boolean, json, index } from 'drizzle-orm/pg-core';
import { user } from '../auth-schema';
import { relations } from 'drizzle-orm';

// User profile extensions for nursing-specific information
export const nurseProfile = pgTable(
  'nurse_profile',
  {
    userId: text('user_id')
      .primaryKey()
      .references(() => user.id, { onDelete: 'cascade' }),
    specialty: text('specialty'),
    licenseNumber: text('license_number').unique(),
    licenseVerified: boolean('license_verified').default(false),
    hospitalAffiliation: text('hospital_affiliation'),
    yearsOfExperience: integer('years_of_experience'),
    education: text('education'),
    certifications: json('certifications'),
    bio: text('bio'),
    consentToMentorship: boolean('consent_to_mentorship').default(false),
    availableForShiftSwaps: boolean('available_for_shift_swaps').default(false),
    profileCompleteness: integer('profile_completeness').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    index('nurse_profile_specialty_idx').on(t.specialty),
    index('nurse_profile_hospital_idx').on(t.hospitalAffiliation),
  ],
);

export const nurseProfileRelations = relations(nurseProfile, ({ one }) => ({
  user: one(user, {
    fields: [nurseProfile.userId],
    references: [user.id],
  }),
}));

// Notifications
export const notification = pgTable(
  'notification',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    type: text('type').notNull(), // message, mention, thread_reply, shift_application, etc.
    title: text('title').notNull(),
    content: text('content'),
    isRead: boolean('is_read').default(false),
    linkUrl: text('link_url'),
    relatedId: text('related_id'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    index('notification_user_id_idx').on(t.userId),
    index('notification_is_read_idx').on(t.isRead),
    index('notification_created_at_idx').on(t.createdAt),
  ],
);

export const notificationRelations = relations(notification, ({ one }) => ({
  user: one(user, {
    fields: [notification.userId],
    references: [user.id],
  }),
}));

// User settings for notifications
export const userNotificationSettings = pgTable('user_notification_settings', {
  userId: text('user_id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  emailNotifications: boolean('email_notifications').default(true),
  smsNotifications: boolean('sms_notifications').default(false),
  pushNotifications: boolean('push_notifications').default(true),
  threadReplies: boolean('thread_replies').default(true),
  directMessages: boolean('direct_messages').default(true),
  mentorshipRequests: boolean('mentorship_requests').default(true),
  eventReminders: boolean('event_reminders').default(true),
  shiftApplications: boolean('shift_applications').default(true),
  resourceUpdates: boolean('resource_updates').default(true),
  policyUpdates: boolean('policy_updates').default(true),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userNotificationSettingsRelations = relations(userNotificationSettings, ({ one }) => ({
  user: one(user, {
    fields: [userNotificationSettings.userId],
    references: [user.id],
  }),
}));
