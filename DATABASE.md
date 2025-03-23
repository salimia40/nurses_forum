# Nurses Forum - Database Documentation

## Overview

The Nurses Forum database is structured around a modular design that supports various specialized features for healthcare professionals. The schema is organized into several interconnected modules that collectively provide a comprehensive platform for nurses to connect, share resources, and organize.

## Database Schema Organization

The database is organized into feature-specific schemas:

```text
src/server/db/schema/
├── auth-schema.ts        # Authentication-related tables (users, sessions)
├── features/
│   ├── forum.ts          # Discussion forums, threads, comments
│   ├── resources.ts      # Resource sharing (documents, protocols, research)
│   ├── messaging.ts      # Private messaging and anonymous support
│   ├── networking.ts     # Professional networking and mentorship
│   ├── shift-exchange.ts # Shift coverage and swaps
│   ├── policy-equipment.ts # Policy updates and equipment reviews
│   ├── user-profile.ts   # User profile extensions
│   ├── moderation.ts     # Content moderation
│   └── file-storage.ts   # File attachment and storage
└── index.ts              # Exports all schemas
```

## ID Generation

All entities in the system use a consistent ID generation pattern:

- Format: `XXX_[nanoid]` where `XXX` is a 3-letter identifier for the table
- Example: `usr_6EYKbh8JnKMw1z0Q2W3e4r`
- Implementation: `nanoid` package with a 21-character length providing 1% collision probability after 17 trillion IDs

## Core Schemas

### Authentication (auth-schema.ts)

#### user

- Primary user table storing authentication details and basic profile
- Key fields: `id`, `email`, `passwordHash`, `name`, `role`
- Connected to: All user-related entities in the system

#### session

- Tracks user sessions for authentication
- Key fields: `id`, `userId`, `expiresAt`

### Forum (forum.ts)

#### category

- Specialized forum categories (ICU, pediatric, geriatric, etc.)
- Key fields: `id`, `name`, `description`, `slug`, `icon`
- Features: Hierarchical structure with `parentId`, regional/hospital-specific flags

#### thread

- Discussion threads within categories
- Key fields: `id`, `title`, `content`, `categoryId`, `authorId`
- Features: Pinning, locking, view counting, follow tracking

#### comment

- Replies to threads or other comments
- Key fields: `id`, `content`, `threadId`, `authorId`, `parentId`
- Supports nested replies through self-referencing `parentId`

#### threadReaction / commentReaction

- User reactions to threads and comments (likes, helpful marks, etc.)
- Key fields: Combined primary key of `(threadId/commentId, userId, type)`

#### threadFollow / categoryFollow / userFollow

- Tracks which threads, categories, and users a user is following
- Key fields: `id`, `threadId/categoryId/followedId`, `userId/followerId`, `notificationsEnabled`
- Used for personalized feeds and notifications

### Resources (resources.ts)

Resources are implemented as extensions of threads, inheriting their core functionality while adding specialized fields.

#### resource

- Extends threads with document/resource specific metadata
- Key fields: `threadId` (primary key referencing thread), `type`, `url`, `hasAttachment`, `isVerified`
- Thread fields provide: title, content, author, category, etc.

#### resourceTag / resourceToTag

- Tagging system for resources
- Enables organization and discovery of resources by topic

### Messaging (messaging.ts)

#### conversation

- Container for private messages between users
- Key fields: `id`, `title`, `isGroup`, `isAnonymous`, `isPublic`, `supportType`
- Supports regular messaging and anonymous support

#### conversationParticipant

- Users participating in a conversation
- Key fields: Combined primary key of `(conversationId, userId)`
- Tracks admin status, read status, and participation state

#### anonymousIdentity

- Manages pseudonyms for anonymous support conversations
- Key fields: `id`, `conversationId`, `userId`, `pseudonym`
- Enables confidential discussions while maintaining consistency

#### message

- Individual messages within conversations
- Key fields: `id`, `content`, `conversationId`, `senderId`, `hasAttachments`

### File Storage (file-storage.ts)

#### file

- Tracks files uploaded to S3 storage
- Key fields: `id`, `filename`, `originalFilename`, `s3Key`, `mimeType`, `size`, `uploaderId`
- Metadata only - actual file content stored in S3

#### attachment

- Unified system for attaching files to any entity in the system
- Key fields: `id`, `fileId`, `entityType`, `entityId`, `isPrimary`, `displayOrder`
- Polymorphic design allows any entity to have file attachments

#### folder / folderFile

- Virtual folder organization for files
- Enables users to organize files in a hierarchical structure

### Shift Exchange (shift-exchange.ts)

#### shift

- Posted shifts available for coverage or swap
- Key fields: `id`, `title`, `description`, `hospitalId`, `departmentId`, `startTime`, `endTime`

#### shiftApplication

- Requests to cover or swap shifts
- Key fields: `id`, `shiftId`, `applicantId`, `status`, `message`

### Policy & Equipment (policy-equipment.ts)

#### policyUpdate

- Hospital or regional policy updates
- Key fields: `id`, `title`, `content`, `authorId`, `hospital`, `region`, `effectiveDate`

#### equipmentReview

- Reviews of medical equipment and tools
- Key fields: `id`, `name`, `category`, `description`, `authorId`, `rating`, `review`

### Networking (networking.ts)

#### mentorship

- Mentor-mentee relationships
- Key fields: `id`, `mentorId`, `menteeId`, `status`, `focusArea`

#### event

- Professional development events and gatherings
- Key fields: `id`, `title`, `description`, `organizedById`, `startTime`, `endTime`, `location`

### User Profile (user-profile.ts)

#### profile

- Extended user profile information
- Key fields: `userId`, `bio`, `specialization`, `experience`, `education`, `certifications`

#### profileView

- Tracks profile views for analytics
- Key fields: `id`, `profileId`, `viewerId`, `viewedAt`

### Moderation (moderation.ts)

#### report

- User-submitted reports of inappropriate content
- Key fields: `id`, `reporterUserId`, `entityType`, `entityId`, `reason`, `status`

#### modAction

- Actions taken by moderators
- Key fields: `id`, `modUserId`, `entityType`, `entityId`, `action`, `reason`

## Key Relationships

1. **Users & Content**:

   - Users create threads, comments, resources, messages
   - Users can follow other users, threads, and categories

2. **Forums & Resources**:

   - Resources extend threads (one-to-one)
   - Threads belong to categories (many-to-one)
   - Comments belong to threads (many-to-one)

3. **Files & Attachments**:

   - Any entity can have multiple file attachments
   - Files can be organized in virtual folders

4. **Messaging & Support**:
   - Conversations have multiple participants
   - Anonymous support uses the same conversation system with identity protection

## Design Patterns

1. **Extension Tables**:

   - Resources extend threads through a foreign key relationship
   - Profile extends users with additional fields

2. **Unified Attachments**:

   - Single attachment table handles file relationships for all entities
   - Polymorphic design using entityType + entityId pattern

3. **Follow System**:

   - Consistent pattern for following different entity types
   - Enables personalized content discovery and notifications

4. **Anonymous Support**:
   - Built on the messaging infrastructure with additional privacy layers
   - Preserves consistent pseudonyms within conversations

## Notes on Data Integrity

1. **Cascading Deletes**:

   - Most child records use `onDelete: 'cascade'` to maintain referential integrity
   - Some relationships use `onDelete: 'set null'` where appropriate

2. **Indexing Strategy**:

   - Foreign keys are indexed for query performance
   - Additional indexes on frequently queried fields
   - Compound indexes for common query patterns

3. **Timestamps**:
   - Most entities include `createdAt` and `updatedAt` fields
   - Activity timestamps for features like "last active" indicators

## Database Migration and Seeding

The database uses Drizzle ORM with migrations to manage schema changes:

- Migrations are stored in `src/server/db/migrations/`
- Each migration is versioned and can be applied or rolled back
- Seed data for testing and development is available in `src/server/db/seed/`

## Entity Relationships Diagram

```text
User
├── creates → Thread
│   └── extends → Resource
├── posts → Comment
├── sends → Message
├── uploads → File
├── follows → User/Thread/Category
├── participates → Conversation
└── has → Profile

Thread
├── belongs to → Category
├── has many → Comments
└── has many → Reactions

File
└── attached to → Any Entity (via Attachment)

Conversation
├── has many → Messages
└── has many → Participants
```
