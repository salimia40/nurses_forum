import { env } from '../utils/env';
import { drizzle } from 'drizzle-orm/bun-sql';

export const db = drizzle(env.DATABASE_URL);
