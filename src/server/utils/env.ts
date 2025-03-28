import { z } from 'zod';

/**
 * Validate and export environment variables with Zod
 * This ensures type safety for our environment variables
 *
 * To use in any server-side file:
 * import { env } from '@/server/utils/env';
 *
 * The imported 'env' object is fully typed and validated.
 */

// Define schema for environment variables
const envSchema = z.object({
  // Authentication related variables
  BETTER_AUTH_SECRET: z.string().min(16, 'BETTER_AUTH_SECRET must be at least 16 characters long'),
  BETTER_AUTH_RP_ID: z.string().min(1, 'BETTER_AUTH_RP_ID cannot be empty'),
  BETTER_AUTH_RP_NAME: z.string().min(1, 'BETTER_AUTH_RP_NAME cannot be empty'),

  // App URLs
  BASE_URL: z.string().url('BASE_URL must be a valid URL'),

  // Database connection
  DATABASE_URL: z
    .string()
    .startsWith('postgresql://', 'DATABASE_URL must be a valid PostgreSQL connection string'),

  // Optional variables with defaults
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Add any other environment variables your application needs
});

// Function to validate environment
function validateEnv() {
  // First ensure required env variables are defined
  const requiredEnvVars = [
    'BETTER_AUTH_SECRET',
    'BETTER_AUTH_RP_ID',
    'BETTER_AUTH_RP_NAME',
    'BASE_URL',
    'DATABASE_URL',
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !(envVar in process.env) || process.env[envVar]?.trim() === '',
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}\n` +
        `Please check your .env file or environment configuration.`,
    );
  }

  try {
    // Parse and validate with Zod
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n');

      throw new Error(
        `Environment validation failed:\n${errorMessage}\n` +
          `Please check your .env file or environment configuration.`,
      );
    }
    throw error;
  }
}

/**
 * Validated environment variables
 * This object is fully typed and all values have been validated according to the schema
 */
export const env = validateEnv();

/**
 * Type export for the validated environment
 * You can use this type for any functions that need access to environment variables
 */
export type Env = z.infer<typeof envSchema>;
