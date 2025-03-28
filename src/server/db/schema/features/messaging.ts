import { pgTable, text, timestamp, boolean, index, primaryKey } from 'drizzle-orm/pg-core';
import { user } from '../auth-schema';

// Private messaging
export const conversation = pgTable(
  'conversation',
  {
    id: text('id').primaryKey(),
    title: text('title'),
    isGroup: boolean('is_group').default(false),
    isAnonymous: boolean('is_anonymous').default(false), // Flag for anonymous conversations
    isPublic: boolean('is_public').default(false), // Whether the conversation is publicly viewable
    supportType: text('support_type'), // For categorizing different types of anonymous support discussions
    createdById: text('created_by_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    lastMessageAt: timestamp('last_message_at').defaultNow().notNull(),
  },
  (t) => [
    index('conversation_created_by_id_idx').on(t.createdById),
    index('conversation_last_message_at_idx').on(t.lastMessageAt),
    index('conversation_is_anonymous_idx').on(t.isAnonymous), // Index for querying anonymous conversations
  ],
);

// Conversation participants
export const conversationParticipant = pgTable(
  'conversation_participant',
  {
    conversationId: text('conversation_id')
      .notNull()
      .references(() => conversation.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    isAdmin: boolean('is_admin').default(false),
    hasLeft: boolean('has_left').default(false),
    lastReadMessageId: text('last_read_message_id'),
  },
  (t) => [primaryKey({ columns: [t.conversationId, t.userId] })],
);

// Anonymous identity management for participants
export const anonymousIdentity = pgTable(
  'anonymous_identity',
  {
    conversationId: text('conversation_id')
      .notNull()
      .references(() => conversation.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    pseudonym: text('pseudonym').notNull(), // Consistent pseudonym for this user in this conversation
    avatarSeed: text('avatar_seed'), // Seed for generating consistent anonymous avatar
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.conversationId, t.userId] }),
    index('anonymous_identity_conversation_id_idx').on(t.conversationId),
  ],
);

// Messages in conversations
export const message = pgTable(
  'message',
  {
    id: text('id').primaryKey(),
    content: text('content').notNull(),
    conversationId: text('conversation_id')
      .notNull()
      .references(() => conversation.id, { onDelete: 'cascade' }),
    senderId: text('sender_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    hasAttachments: boolean('has_attachments').default(false), // Flag to quickly check if message has files
    isEdited: boolean('is_edited').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    index('message_conversation_id_idx').on(t.conversationId),
    index('message_sender_id_idx').on(t.senderId),
    index('message_created_at_idx').on(t.createdAt),
  ],
);
