import { serve } from 'bun';
import index from './index.html';
import app from './server';
serve({
  routes: {
    // Serve index.html for all unmatched routes.
    '/*': index,
    '/api/*': (req) => app.fetch(req),
  },
  development: process.env.NODE_ENV !== 'production',
});
