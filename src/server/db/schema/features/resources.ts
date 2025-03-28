import { pgTable, text, timestamp, boolean, index, primaryKey } from 'drizzle-orm/pg-core';
import { thread } from './forum';
import { relations } from 'drizzle-orm';

/**
 * Resource extension for threads
 * This extends the thread model with additional resource-specific metadata
 * Resources are essentially specialized threads with extra fields for document/resource information
 */
export const resource = pgTable(
  'resource',
  {
    threadId: text('thread_id')
      .primaryKey()
      .references(() => thread.id, { onDelete: 'cascade' }),
    type: text('type').notNull(), // document, guideline, protocol, research, etc.
    url: text('url'), // For external resources
    hasAttachment: boolean('has_attachment').default(false), // Flag to indicate if resource has files
    isVerified: boolean('is_verified').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [index('resource_type_idx').on(t.type)],
);

export const resourceRelations = relations(resource, ({ one, many }) => ({
  thread: one(thread, {
    fields: [resource.threadId],
    references: [thread.id],
  }),
  tags: many(resourceToTag),
}));

// Resource tags
export const resourceTag = pgTable(
  'resource_tag',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('resource_tag_name_idx').on(t.name)],
);

export const resourceTagRelations = relations(resourceTag, ({ many }) => ({
  resources: many(resourceToTag),
}));

// Resource to tag mapping
export const resourceToTag = pgTable(
  'resource_to_tag',
  {
    resourceId: text('resource_id')
      .notNull()
      .references(() => resource.threadId, { onDelete: 'cascade' }),
    tagId: text('tag_id')
      .notNull()
      .references(() => resourceTag.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.resourceId, t.tagId] })],
);

export const resourceToTagRelations = relations(resourceToTag, ({ one }) => ({
  resource: one(resource, {
    fields: [resourceToTag.resourceId],
    references: [resource.threadId],
  }),
  tag: one(resourceTag, {
    fields: [resourceToTag.tagId],
    references: [resourceTag.id],
  }),
}));
