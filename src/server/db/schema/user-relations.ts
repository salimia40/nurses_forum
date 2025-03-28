import { relations } from 'drizzle-orm';
import { user, session, account, passkey } from './auth-schema';
import { nurseProfile, notification, userNotificationSettings } from './features/user-profile';
import {
  thread,
  comment,
  threadReaction,
  commentReaction,
  threadFollow,
  categoryFollow,
  userFollow,
} from './features/forum';
import {
  conversation,
  message,
  conversationParticipant,
  anonymousIdentity,
} from './features/messaging';
import { file, folder, attachment } from './features/file-storage';
import { policyUpdate, equipmentReview } from './features/policy-equipment';
import { userReport, contentReport } from './features/moderation';
import { shift, shiftApplication } from './features/shift-exchange';
import { mentorship, event, eventParticipant } from './features/networking';

// Define user relations in a separate file to avoid modifying the generated auth-schema.ts
export const userRelations = relations(user, ({ one, many }) => ({
  // Auth relations
  sessions: many(session),
  accounts: many(account),
  passkeys: many(passkey),

  // User profile relations
  nurseProfile: one(nurseProfile),
  notificationSettings: one(userNotificationSettings),
  notifications: many(notification),

  // Forum relations
  authoredThreads: many(thread, { relationName: 'author' }),
  authoredComments: many(comment, { relationName: 'author' }),
  threadReactions: many(threadReaction),
  commentReactions: many(commentReaction),
  followedThreads: many(threadFollow),
  followedCategories: many(categoryFollow),
  followers: many(userFollow, { relationName: 'followed' }),
  following: many(userFollow, { relationName: 'follower' }),

  // Messaging relations
  createdConversations: many(conversation, { relationName: 'creator' }),
  participatedConversations: many(conversationParticipant),
  sentMessages: many(message, { relationName: 'sender' }),
  anonymousIdentities: many(anonymousIdentity),

  // File storage relations
  uploadedFiles: many(file, { relationName: 'uploader' }),
  addedAttachments: many(attachment, { relationName: 'addedBy' }),
  ownedFolders: many(folder, { relationName: 'owner' }),

  // Policy and equipment relations
  policyUpdates: many(policyUpdate),
  equipmentReviews: many(equipmentReview),

  // Moderation relations
  reportedUsers: many(userReport, { relationName: 'reporter' }),
  reportedByUsers: many(userReport, { relationName: 'reportedUser' }),
  moderatedUserReports: many(userReport, { relationName: 'moderator' }),
  reportedContent: many(contentReport, { relationName: 'reporter' }),
  moderatedContentReports: many(contentReport, { relationName: 'moderator' }),

  // Shift exchange relations
  shifts: many(shift),
  shiftApplications: many(shiftApplication, { relationName: 'applicant' }),

  // Networking relations
  mentorships: many(mentorship, { relationName: 'mentor' }),
  menteeships: many(mentorship, { relationName: 'mentee' }),
  organizedEvents: many(event, { relationName: 'organizer' }),
  eventParticipations: many(eventParticipant),
}));

// Auth related entity relations
export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const passkeyRelations = relations(passkey, ({ one }) => ({
  user: one(user, {
    fields: [passkey.userId],
    references: [user.id],
  }),
}));
