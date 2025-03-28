import { auth } from '@/server/auth';
import { secureHeaders } from 'hono/secure-headers';
import { trimTrailingSlash } from 'hono/trailing-slash';

import { authMiddleware } from './routes/middlewares/auth';
import { factory } from './routes/__base';
import thread from './routes/thread';
import category from './routes/category';
import { AppError } from './utils/errors';
import { HTTPException } from 'hono/http-exception';
import { corsMiddleware } from './routes/middlewares/cors';

const app = factory
  .createApp({ strict: true })
  .basePath('/api')
  .use(corsMiddleware)
  .use(secureHeaders())
  .use(trimTrailingSlash())
  .onError((err, c) => {
    if (err instanceof AppError) {
      return c.json({ error: err.message }, err.status);
    } else if (err instanceof HTTPException) {
      return c.json({ error: err.message }, err.status);
    } else {
      return c.json({ error: 'خطایی در اجرای عملیات رخ داد' }, 500);
    }
  })
  .use(authMiddleware);

app.on(['POST', 'GET'], '/auth/**', (c) => auth.handler(c.req.raw));

app.route('/thread', thread);
app.route('/category', category);

export default app;
