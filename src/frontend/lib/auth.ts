import { createAuthClient } from 'better-auth/react';
import {
  usernameClient,
  phoneNumberClient,
  magicLinkClient,
  emailOTPClient,
  passkeyClient,
  adminClient,
} from 'better-auth/client/plugins';
export const authClient = createAuthClient({
  plugins: [
    usernameClient(),
    phoneNumberClient(),
    magicLinkClient(),
    emailOTPClient(),
    passkeyClient(),
    adminClient(),
  ],
});
