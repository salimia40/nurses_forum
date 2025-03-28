import { Hono } from 'hono';
import { auth } from '@/server/auth';
import { cors } from 'hono/cors';
import { env } from '@/server/utils/env';

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>({ strict: true }).basePath('/api');

app.use(
  '*',
  cors({
    origin: env.BASE_URL,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'],
    exposeHeaders: ['Content-Length', 'Authorization'],
    maxAge: 600,
    credentials: true,
  }),
);

app.use('*', async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set('user', null);
    c.set('session', null);
    return next();
  }

  c.set('user', session.user);
  c.set('session', session.session);
  return next();
});

app.on(['POST', 'GET'], '/auth/**', (c) => auth.handler(c.req.raw));

app.get('/hi', (c) => c.text('Hello Bun!'));

export default app;
