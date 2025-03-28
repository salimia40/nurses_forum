import { createFactory } from 'hono/factory';
import { auth } from '~/auth';
import type { thread } from '~/db/schema';
// hono env type
type Env = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
    thread: typeof thread.$inferSelect | null;
  };
};

export const factory = createFactory<Env>();
