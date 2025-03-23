import { nanoid } from 'nanoid';

// Default size of 21 provides sufficient collision resistance
// (1% probability after 17 trillion IDs)
const DEFAULT_ID_SIZE = 21;

/**
 * Type definition for table identifiers
 * All identifiers must be exactly 3 characters
 */
export type TableIdentifier =
  | 'usr' // User
  | 'cat' // Category
  | 'thr' // Thread
  | 'cmt' // Comment
  | 'tag' // Resource Tag
  | 'mtr' // Mentorship
  | 'evt' // Event
  | 'cnv' // Conversation
  | 'msg' // Message
  | 'sft' // Shift
  | 'sap' // Shift Application
  | 'pol' // Policy Update
  | 'eqp' // Equipment Review
  | 'not' // Notification
  | 'rpt' // Report
  | 'fil' // File
  | 'att' // Attachment (unified)
  | 'fld' // Folder
  | 'ffd' // Folder File
  | 'ani' // Anonymous Identity
  | 'thf' // Thread Follow
  | 'ctf' // Category Follow
  | 'usf'; // User Follow

/**
 * Generates a unique ID using nanoid, prefixed with a table identifier
 * @param identifier A 3-letter identifier for the table/entity type
 * @param size The length of the nanoId part (default: 21)
 * @returns A unique string ID in the format [identifier]_[nanoId]
 */
export function generateId(identifier: TableIdentifier, size = DEFAULT_ID_SIZE): string {
  return `${identifier}_${nanoid(size)}`;
}

// Entity-specific ID generators
export const generateUserId = () => generateId('usr');
export const generateCategoryId = () => generateId('cat');
export const generateThreadId = () => generateId('thr');
export const generateCommentId = () => generateId('cmt');
export const generateResourceTagId = () => generateId('tag');
export const generateMentorshipId = () => generateId('mtr');
export const generateEventId = () => generateId('evt');
export const generateConversationId = () => generateId('cnv');
export const generateMessageId = () => generateId('msg');
export const generateShiftId = () => generateId('sft');
export const generateShiftApplicationId = () => generateId('sap');
export const generatePolicyUpdateId = () => generateId('pol');
export const generateEquipmentReviewId = () => generateId('eqp');
export const generateNotificationId = () => generateId('not');
export const generateReportId = () => generateId('rpt');

// File storage ID generators
export const generateFileId = () => generateId('fil');
export const generateAttachmentId = () => generateId('att');
export const generateFolderId = () => generateId('fld');
export const generateFolderFileId = () => generateId('ffd');

// Anonymous Support ID generators
export const generateAnonymousIdentityId = () => generateId('ani');

// Follow feature ID generators
export const generateThreadFollowId = () => generateId('thf');
export const generateCategoryFollowId = () => generateId('ctf');
export const generateUserFollowId = () => generateId('usf');
