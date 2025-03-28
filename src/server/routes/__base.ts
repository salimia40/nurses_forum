import { createFactory } from 'hono/factory';
import { auth } from '~/auth';

// hono env type
type Env = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};

export const factory = createFactory<Env>();
