import { auth } from '@/server/auth';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { trimTrailingSlash } from 'hono/trailing-slash';
import { compress } from 'hono/compress';

import { env } from '@/server/utils/env';
import { authMiddleware } from './routes/middlewares/auth';
import { factory } from './routes/__base';

const app = factory
  .createApp({ strict: true })
  .basePath('/api')
  .use(
    '*',
    cors({
      origin: env.BASE_URL,
      allowHeaders: ['Content-Type', 'Authorization'],
      allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'],
      exposeHeaders: ['Content-Length', 'Authorization'],
      maxAge: 600,
      credentials: true,
    }),
  )
  .use(secureHeaders())
  .use(trimTrailingSlash())
  .use(compress())
  .use(authMiddleware);

app.on(['POST', 'GET'], '/auth/**', (c) => auth.handler(c.req.raw));

app.get('/hi', (c) => c.text('Hello Bun!'));

export default app;
