import type { MiddlewareHandler } from 'hono';
import { db } from '~/db';
import { thread } from '~/db/schema';
import { eq } from 'drizzle-orm';
import { factory } from '~/routes/__base';
import type { User } from '~/utils/types';
import { AppError, ErrorCode } from '~/utils/errors';
import { some, every } from 'hono/combine';

// Define the user type to avoid type errors

/**
 * Ensure user is authenticated
 */
export const requireAuth: MiddlewareHandler = async (c, next) => {
  const user = c.get('user') as User | undefined;

  if (!user) {
    throw new AppError(ErrorCode.UNAUTHORIZED);
  }

  await next();
};

/**
 * Ensure user is an admin
 */
const _requireAdmin: MiddlewareHandler = async (c, next) => {
  const user = c.get('user') as User | undefined;

  if (user?.role !== 'admin') {
    throw new AppError(ErrorCode.FORBIDDEN);
  }

  await next();
};

export const requireAdmin = every(requireAuth, _requireAdmin);

/**
 * Ensure thread exists
 */
export const requireThread: MiddlewareHandler = factory.createMiddleware(async (c, next) => {
  const id = c.req.param('id');

  if (!id) {
    throw new AppError(ErrorCode.BAD_REQUEST);
  }

  const existingThread = await db.query.thread.findFirst({
    where: eq(thread.id, id),
  });

  if (!existingThread) {
    throw new AppError(ErrorCode.NOT_FOUND);
  }

  c.set('thread', existingThread);

  await next();
});

/**
 * Ensure user is either the author of the thread
 */

const _requireThreadOwner: MiddlewareHandler = factory.createMiddleware(async (c, next) => {
  const user = c.get('user') as User | undefined;
  const thread = c.get('thread');

  if (thread?.authorId !== user?.id) {
    throw new AppError(ErrorCode.FORBIDDEN);
  }

  await next();
});

export const requireThreadOwner = every(requireAuth, requireThread, _requireThreadOwner);

/**
 * Ensure user is either the author of the thread or an admin
 */

const _requireThreadOwnerOrAdmin: MiddlewareHandler = some(_requireThreadOwner, _requireAdmin);

export const requireThreadOwnerOrAdmin = every(
  requireAuth,
  requireThread,
  _requireThreadOwnerOrAdmin,
);

export const requireThreadAndAdmin = every(requireAuth, requireThread, _requireAdmin);
