/**
 * This is a helper script to check if environment variables are correctly set up.
 * It can be used during development or in CI/CD pipelines to validate the environment.
 */
import { env } from './env';

console.log('Environment validation successful!');
console.log('Environment variables:');
console.log({
  BETTER_AUTH_RP_ID: env.BETTER_AUTH_RP_ID,
  BETTER_AUTH_RP_NAME: env.BETTER_AUTH_RP_NAME,
  BASE_URL: env.BASE_URL,
  NODE_ENV: env.NODE_ENV,
  // Not printing the secret for security reasons
  BETTER_AUTH_SECRET: '[REDACTED]',
  // Not printing the database URL as it contains credentials
  DATABASE_URL: '[REDACTED]',
});
