import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import db from '@/server/db';
import { phoneNumber, username, magicLink, emailOTP, admin } from 'better-auth/plugins';

export const auth = betterAuth({
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
      sendOTP: ({ phoneNumber, code }, request) => {
        //TODO: Implement sending OTP code via SMS
      },
    }),
    magicLink({
      sendMagicLink: async ({ email, token, url }, request) => {
        //TODO: send email to user
      },
    }),
    emailOTP({
      sendVerificationOnSignUp: true,
      async sendVerificationOTP({ email, otp, type }) {
        // Implement the sendVerificationOTP method to send the OTP to the user's email address
      },
    }),
    admin(),
  ],
});
