import { createAuthClient } from 'better-auth/react';
import {
  usernameClient,
  phoneNumberClient,
  magicLinkClient,
  emailOTPClient,
  passkeyClient,
  adminClient,
  inferAdditionalFields,
} from 'better-auth/client/plugins';
import { auth } from '@/server/auth';

export const authClient = createAuthClient({
  plugins: [
    usernameClient(),
    phoneNumberClient(),
    magicLinkClient(),
    emailOTPClient(),
    passkeyClient(),
    adminClient(),
    inferAdditionalFields<typeof auth>(),
  ],
});
