import { SQL, and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { db } from '~/db';
import { comment, thread, category, threadReaction } from '~/db/schema';
import { AppError, ErrorCode } from '~/utils/errors';
import { generateThreadId } from '~/utils/id-generator';

export interface ThreadFilter {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  authorId?: string;
  sortBy?: keyof typeof thread.$inferSelect;
  sortOrder?: 'asc' | 'desc';
  excludePinned?: boolean;
}

export class ThreadService {
  /**
   * Get a list of threads with pagination and filters
   */
  async getThreads(filter: ThreadFilter = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      categoryId,
      authorId,
      sortBy = 'lastActivityAt',
      sortOrder = 'desc',
      excludePinned,
    } = filter;

    const offset = (page - 1) * limit;

    // Build conditions for WHERE clause
    const whereConditions: SQL<unknown>[] = [];

    if (search) {
      whereConditions.push(
        or(
          ilike(thread.title, `%${search}%`),
          ilike(thread.content, `%${search}%`),
        ) as SQL<unknown>,
      );
    }

    if (categoryId) {
      whereConditions.push(eq(thread.categoryId, categoryId));
    }

    if (authorId) {
      whereConditions.push(eq(thread.authorId, authorId));
    }

    // Only include non-pinned threads if excludePinned is true
    if (excludePinned) {
      whereConditions.push(eq(thread.isPinned, false));
    }

    const baseQuery = db
      .select({
        id: thread.id,
        title: thread.title,
        content: thread.content,
        authorId: thread.authorId,
        categoryId: thread.categoryId,
        isPinned: thread.isPinned,
        isLocked: thread.isLocked,
        viewCount: thread.viewCount,
        createdAt: thread.createdAt,
        updatedAt: thread.updatedAt,
        lastActivityAt: thread.lastActivityAt,
      })
      .from(thread)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(thread)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const total = countResult[0]?.count || 0;

    // Get paginated threads
    const result = await baseQuery
      .orderBy(
        sortBy === 'createdAt'
          ? sortOrder === 'asc'
            ? asc(thread.createdAt)
            : desc(thread.createdAt)
          : sortBy === 'lastActivityAt'
            ? sortOrder === 'asc'
              ? asc(thread.lastActivityAt)
              : desc(thread.lastActivityAt)
            : sortBy === 'title'
              ? sortOrder === 'asc'
                ? asc(thread.title)
                : desc(thread.title)
              : sortBy === 'viewCount'
                ? sortOrder === 'asc'
                  ? asc(thread.viewCount)
                  : desc(thread.viewCount)
                : desc(thread.lastActivityAt),
      )
      // Add secondary sort by pinned status (pinned first)
      .limit(limit)
      .offset(offset);

    return {
      data: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Create a new thread
   */
  async createThread(data: {
    title: string;
    content: string;
    categoryId: string;
    authorId: string;
  }) {
    // Validate category exists
    const _category = await db.query.category.findFirst({
      where: eq(category.id, data.categoryId),
    });

    if (!_category) {
      throw new AppError(ErrorCode.CATEGORY_NOT_FOUND);
    }

    // Create thread
    const [newThread] = await db
      .insert(thread)
      .values({
        id: generateThreadId(),
        title: data.title,
        content: data.content,
        categoryId: data.categoryId,
        authorId: data.authorId,
        isPinned: false,
        isLocked: false,
        viewCount: 0,
        lastActivityAt: new Date(),
      })
      .returning();

    return newThread;
  }

  /**
   * Get a thread by ID with related data
   */
  async getThreadById(id: string) {
    // Get thread details
    const threadData = await db.query.thread.findFirst({
      where: eq(thread.id, id),
      with: {
        author: {
          columns: {
            id: true,
            username: true,
            profileImage: true,
            createdAt: true,
          },
        },
        category: true,
      },
    });

    if (!threadData) {
      throw new AppError(ErrorCode.THREAD_NOT_FOUND);
    }

    // Increment view count
    await db
      .update(thread)
      .set({
        viewCount: threadData.viewCount + 1,
      })
      .where(eq(thread.id, id));

    // Get comments count
    const commentsCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(comment)
      .where(eq(comment.threadId, id));

    const commentsCount = commentsCountResult[0]?.count || 0;

    // Get reactions count by type
    const reactionsCount = await db
      .select({
        type: threadReaction.type,
        count: sql<number>`count(*)`,
      })
      .from(threadReaction)
      .where(eq(threadReaction.threadId, id))
      .groupBy(threadReaction.type);

    return {
      ...threadData,
      commentsCount,
      reactions: reactionsCount.reduce(
        (acc, curr) => ({
          ...acc,
          [curr.type]: curr.count,
        }),
        {},
      ),
    };
  }

  /**
   * Check if a thread exists
   */
  private async checkThreadExists(id: string) {
    const threadData = await db.query.thread.findFirst({
      where: eq(thread.id, id),
      columns: {
        id: true,
      },
    });

    if (!threadData) {
      throw new AppError(ErrorCode.THREAD_NOT_FOUND);
    }

    return threadData;
  }

  /**
   * Update a thread
   */
  async updateThread(
    id: string,
    data: Partial<{
      title: string;
      content: string;
      categoryId: string;
      isPinned: boolean;
      isLocked: boolean;
    }>,
  ) {
    // Check if thread exists
    await this.checkThreadExists(id);

    // Check if category exists if provided
    if (data.categoryId) {
      const _category = await db.query.category.findFirst({
        where: eq(category.id, data.categoryId),
      });

      if (!_category) {
        throw new AppError(ErrorCode.CATEGORY_NOT_FOUND);
      }
    }

    // Update thread
    const [updatedThread] = await db
      .update(thread)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(thread.id, id))
      .returning();

    return updatedThread;
  }

  /**
   * Delete a thread
   */
  async deleteThread(id: string) {
    // Check if thread exists
    await this.checkThreadExists(id);

    // Delete thread
    await db.delete(thread).where(eq(thread.id, id));

    return true;
  }

  /**
   * Toggle pin status
   */
  async togglePinStatus(id: string) {
    // Get current thread
    const threadData = await db.query.thread.findFirst({
      where: eq(thread.id, id),
    });

    if (!threadData) {
      throw new AppError(ErrorCode.THREAD_NOT_FOUND);
    }

    // Toggle isPinned
    const [updatedThread] = await db
      .update(thread)
      .set({
        isPinned: !threadData.isPinned,
        updatedAt: new Date(),
      })
      .where(eq(thread.id, id))
      .returning();

    return updatedThread;
  }

  /**
   * Toggle lock status
   */
  async toggleLockStatus(id: string) {
    // Get current thread
    const threadData = await db.query.thread.findFirst({
      where: eq(thread.id, id),
    });

    if (!threadData) {
      throw new AppError(ErrorCode.THREAD_NOT_FOUND);
    }

    // Toggle isLocked
    const [updatedThread] = await db
      .update(thread)
      .set({
        isLocked: !threadData.isLocked,
        updatedAt: new Date(),
      })
      .where(eq(thread.id, id))
      .returning();

    return updatedThread;
  }
}

export const threadService = new ThreadService();
