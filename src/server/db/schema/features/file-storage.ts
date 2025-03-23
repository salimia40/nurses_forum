import { pgTable, text, integer, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { user } from '../auth-schema';

// File storage schema for the Nurses Forum application
// This schema defines tables for tracking files stored in S3

/**
 * File table - Tracks files uploaded to S3
 * This maintains metadata about files while the actual content is stored in S3
 */
export const file = pgTable(
  'file',
  {
    id: text('id').primaryKey(),
    filename: text('filename').notNull(),
    originalFilename: text('original_filename').notNull(),
    mimeType: text('mime_type').notNull(),
    extension: text('extension'),
    size: integer('size').notNull(), // File size in bytes
    uploaderId: text('uploader_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    isPublic: boolean('is_public').default(false), // Whether the file is publicly accessible
    url: text('url'), // Public URL if file is accessible
    uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
    lastAccessedAt: timestamp('last_accessed_at'),
    expiresAt: timestamp('expires_at'), // For temporary files
    metadata: text('metadata'), // Additional JSON metadata (stringified)
  },
  (t) => [
    index('file_uploader_id_idx').on(t.uploaderId),
    index('file_uploaded_at_idx').on(t.uploadedAt),
    index('file_mime_type_idx').on(t.mimeType),
  ],
);

/**
 * Unified attachment table - Links files to various entities throughout the application
 * This allows tracking which files are associated with any type of entity in the system
 * (messages, resources, policies, equipment reviews, threads, comments, etc.)
 */
export const attachment = pgTable(
  'attachment',
  {
    id: text('id').primaryKey(),
    fileId: text('file_id')
      .notNull()
      .references(() => file.id, { onDelete: 'cascade' }),
    entityType: text('entity_type').notNull(), // 'message', 'resource', 'policy', 'equipment', 'thread', 'comment', etc.
    entityId: text('entity_id').notNull(), // ID of the parent entity
    isPrimary: boolean('is_primary').default(false), // Whether this is the primary/featured attachment
    displayOrder: integer('display_order').default(0), // For controlling display order of multiple files
    relationshipType: text('relationship_type'), // Optional: 'avatar', 'thumbnail', 'document', 'image', etc.
    caption: text('caption'), // Optional caption/description for the attachment
    addedAt: timestamp('added_at').defaultNow().notNull(),
    addedById: text('added_by_id').references(() => user.id, { onDelete: 'set null' }), // Who added this attachment if different from uploader
  },
  (t) => [
    index('attachment_file_id_idx').on(t.fileId),
    index('attachment_entity_idx').on(t.entityType, t.entityId),
    index('attachment_is_primary_idx').on(t.isPrimary),
    index('attachment_added_at_idx').on(t.addedAt),
    index('attachment_relationship_type_idx').on(t.relationshipType),
  ],
);

/**
 * Folder table - For organizing files in virtual folders
 * This is for UI organization and doesn't necessarily reflect S3 structure
 */
export const folder = pgTable(
  'folder',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    path: text('path').notNull(),
    ownerId: text('owner_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    parentId: text('parent_id').references(() => folder.id, { onDelete: 'cascade' }),
    isShared: boolean('is_shared').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    index('folder_owner_id_idx').on(t.ownerId),
    index('folder_parent_id_idx').on(t.parentId),
    index('folder_path_idx').on(t.path),
  ],
);

/**
 * Folder file relationship table - Tracks which files are in which folders
 */
export const folderFile = pgTable(
  'folder_file',
  {
    id: text('id').primaryKey(),
    folderId: text('folder_id')
      .notNull()
      .references(() => folder.id, { onDelete: 'cascade' }),
    fileId: text('file_id')
      .notNull()
      .references(() => file.id, { onDelete: 'cascade' }),
    addedAt: timestamp('added_at').defaultNow().notNull(),
  },
  (t) => [
    index('folder_file_folder_id_idx').on(t.folderId),
    index('folder_file_file_id_idx').on(t.fileId),
  ],
);
