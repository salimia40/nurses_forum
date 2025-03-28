import { env } from '../utils/env';
import { drizzle } from 'drizzle-orm/bun-sql';
import * as schema from './schema';

export const db = drizzle(env.DATABASE_URL, { schema });
