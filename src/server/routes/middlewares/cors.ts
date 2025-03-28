import { env } from '~/utils/env';
import { cors } from 'hono/cors';

export const corsMiddleware = cors({
  origin: env.BASE_URL,
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'],
  exposeHeaders: ['Content-Length', 'Authorization'],
  maxAge: 600,
  credentials: true,
});
