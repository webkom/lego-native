import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  EXPO_PUBLIC_API_URL: z.string().url(),
  EXPO_PUBLIC_TURNSTILE_BASE_URL: z.string().url(),
  EXPO_PUBLIC_TURNSTILE_SITE_KEY: z.string(),
  EXPO_PUBLIC_TURNSTILE_SIZE: z.enum(['normal', 'compact']),
  EXPO_PUBLIC_FRONTEND_URL: z.string().url(),
});

// Validate the environment variables
let parsedEnv;
try {
  parsedEnv = envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
    EXPO_PUBLIC_TURNSTILE_BASE_URL: process.env.EXPO_PUBLIC_TURNSTILE_BASE_URL,
    EXPO_PUBLIC_TURNSTILE_SITE_KEY: process.env.EXPO_PUBLIC_TURNSTILE_SITE_KEY,
    EXPO_PUBLIC_TURNSTILE_SIZE: process.env.EXPO_PUBLIC_TURNSTILE_SIZE,
    EXPO_PUBLIC_FRONTEND_URL: process.env.EXPO_PUBLIC_FRONTEND_URL,
  });
} catch (e) {
  throw new Error(`Invalid environment variables: ${e}`);
}

export default parsedEnv as z.infer<typeof envSchema>;
