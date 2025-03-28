import { factory } from './__base';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { createInsertSchema } from 'drizzle-zod';
import { thread } from '../db/schema';
import { threadService } from '~/services';
import {
  requireAuth,
  requireThreadOwnerOrAdmin,
  requireThread,
  requireThreadAndAdmin,
} from './middlewares';
import type { User } from '~/utils/types';
import { AppError, ErrorCode } from '../utils/errors';

const app = factory.createApp({ strict: true });

// Create Zod schemas for thread validation
const threadInsertSchema = createInsertSchema(thread, {
  // Override id to make it optional (we'll generate it)
  id: z.string().optional(),
  // Override authorId to be validated but not required in the request body
  authorId: z.string().optional(),
});

const threadUpdateSchema = z.object({
  title: z.string().min(5).max(100).optional(),
  content: z.string().min(10).optional(),
  isPinned: z.boolean().optional(),
  isLocked: z.boolean().optional(),
});

// Query parameters for pagination and search
const threadListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['createdAt', 'lastActivityAt', 'title', 'viewCount']).default('lastActivityAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  searchQuery: z.string().optional(),
  categoryId: z.string().optional(),
  authorId: z.string().optional(),
  excludePinned: z.coerce.boolean().optional(),
});

app
  .get('/', zValidator('query', threadListQuerySchema), async (c) => {
    try {
      const query = c.req.valid('query');
      const result = await threadService.getThreads(query);

      return c.json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error('Error fetching threads:', error);

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  })
  .post('/', requireAuth, zValidator('json', threadInsertSchema), async (c) => {
    try {
      const body = c.req.valid('json');
      const user = c.get('user') as User;

      const newThread = await threadService.createThread({
        title: body.title,
        content: body.content,
        categoryId: body.categoryId,
        authorId: user.id,
      });

      return c.json(
        {
          success: true,
          message: 'تاپیک با موفقیت ایجاد شد',
          data: newThread,
        },
        201,
      );
    } catch (error) {
      console.error('Error creating thread:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  })
  .get('/:id', requireThread, async (c) => {
    try {
      const { id } = c.req.param();

      const result = await threadService.getThreadById(id);
      return c.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error fetching thread:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  })
  .put('/:id', requireThreadOwnerOrAdmin, zValidator('json', threadUpdateSchema), async (c) => {
    try {
      const body = c.req.valid('json');
      const { id } = c.req.param();

      const updatedThread = await threadService.updateThread(id, body);

      return c.json({
        success: true,
        message: 'تاپیک با موفقیت به‌روزرسانی شد',
        data: updatedThread,
      });
    } catch (error) {
      console.error('Error updating thread:', error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  })

  .delete('/:id', requireThreadOwnerOrAdmin, async (c) => {
    try {
      const { id } = c.req.param();

      await threadService.deleteThread(id);

      return c.json({
        success: true,
        message: 'تاپیک با موفقیت حذف شد',
      });
    } catch (error) {
      console.error('Error deleting thread:', error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  })
  .patch('/:id/pin', requireThreadAndAdmin, async (c) => {
    try {
      const { id } = c.req.param();

      const updatedThread = await threadService.togglePinStatus(id);

      return c.json({
        success: true,
        message: updatedThread.isPinned ? 'تاپیک سنجاق شد' : 'سنجاق تاپیک برداشته شد',
        data: updatedThread,
      });
    } catch (error) {
      console.error('Error toggling pin status:', error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  })

  .patch('/:id/lock', requireThreadAndAdmin, async (c) => {
    try {
      const { id } = c.req.param();

      const updatedThread = await threadService.toggleLockStatus(id);

      return c.json({
        success: true,
        message: updatedThread.isLocked ? 'تاپیک قفل شد' : 'قفل تاپیک برداشته شد',
        data: updatedThread,
      });
    } catch (error) {
      console.error('Error toggling lock status:', error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  });

export default app;
