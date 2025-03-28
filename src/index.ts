import { serve } from 'bun';
import index from '@/frontend/index.html';
import app from '~/app';

import { env } from '~/utils/env';

/**
 * Serve the frontend and backend
 *
 * @description This is the main entry point for the server
 */
serve({
  routes: {
    // Serve index.html for all unmatched routes.
    '/*': index,
    '/api/*': (req) => app.fetch(req),
  },
  development: env.NODE_ENV !== 'production',
});

console.info(`Server is running on ${env.BASE_URL}`);
