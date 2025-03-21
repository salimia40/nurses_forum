import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/server/db';
import { phoneNumber, username, magicLink, emailOTP, admin } from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';
import { sendOTPSMS, sendMagicLinkEmail, sendOTPEmail } from '@/server/services/mock';

export const auth = betterAuth({
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  baseUrl: Bun.env.BASE_URL,
  secret: Bun.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    username(),
    phoneNumber({
      sendOTP: async ({ phoneNumber, code }) => {
        await sendOTPSMS({ phoneNumber, code });
      },
    }),
    magicLink({
      sendMagicLink: async ({ email, token, url }) => {
        await sendMagicLinkEmail({ email, token, url });
      },
    }),
    emailOTP({
      sendVerificationOnSignUp: true,
      async sendVerificationOTP({ email, otp, type }) {
        await sendOTPEmail({ email, otp, type });
      },
    }),
    admin(),
    passkey(),
  ],
});
