import { Hono } from 'hono';

const app = new Hono({ strict: true }).basePath('/api');
app.get('/hi', (c) => c.text('Hello Bun!'));

export default app;
