import { pgTable, text, date, integer, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { user } from '../auth-schema';
import { relations } from 'drizzle-orm';

// Policy updates
export const policyUpdate = pgTable(
  'policy_update',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    authorId: text('author_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    hospital: text('hospital'),
    region: text('region'),
    effectiveDate: date('effective_date'),
    hasAttachments: boolean('has_attachments').default(false), // Flag for policy documents
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    index('policy_update_author_id_idx').on(t.authorId),
    index('policy_update_hospital_idx').on(t.hospital),
    index('policy_update_region_idx').on(t.region),
    index('policy_update_effective_date_idx').on(t.effectiveDate),
  ],
);

export const policyUpdateRelations = relations(policyUpdate, ({ one }) => ({
  author: one(user, {
    fields: [policyUpdate.authorId],
    references: [user.id],
  }),
}));

// Equipment/resource reviews
export const equipmentReview = pgTable(
  'equipment_review',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    category: text('category').notNull(),
    description: text('description'),
    authorId: text('author_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(),
    review: text('review').notNull(),
    pros: text('pros'),
    cons: text('cons'),
    hasImages: boolean('has_images').default(false), // Flag for equipment images
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    index('equipment_review_author_id_idx').on(t.authorId),
    index('equipment_review_category_idx').on(t.category),
    index('equipment_review_rating_idx').on(t.rating),
  ],
);

export const equipmentReviewRelations = relations(equipmentReview, ({ one }) => ({
  author: one(user, {
    fields: [equipmentReview.authorId],
    references: [user.id],
  }),
}));
