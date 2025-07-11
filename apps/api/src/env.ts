import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    /* Shared */
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    BASE_DOMAIN: z.string().min(1),

    /* Database */
    DATABASE_URL: z.string().min(1),

    /* Better Auth */
    BETTER_AUTH_SECRET: z.string().min(12),

    /* Google OAuth */
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),

    /* GitHub OAuth */
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),

    /* Avelin Zero JWT */
    AUTH_JWT_SECRET: z.string().min(1),

    /* Avelin microservice URLs */
    API_URL: z.string().url(),
    APP_URL: z.string().url(),
    API_PORT: z.coerce.number().default(4000),

    /* Avelin Sync */
    HOCUSPOCUS_WEBHOOK_SECRET: z.string().min(1),

    /* Cloudflare R2 */
    R2_ENDPOINT: z.string().min(1),
    R2_ACCESS_KEY_ID: z.string().min(1),
    R2_SECRET_ACCESS_KEY: z.string().min(1),
    R2_BUCKET_NAME: z.string().min(1),
    ASSETS_URL: z.string().url(),

    POSTHOG_KEY: z.string().min(1),

    /* Resend */
    RESEND_API_KEY: z.string().min(1),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: process.env,

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,

  // Tell the library to skip validation if condition is true.
  skipValidation: !!process.env.CI,
})
