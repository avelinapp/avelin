import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  client: {
    /* Avelin microservice URLs */
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_SYNC_URL: z.string().url(),
    NEXT_PUBLIC_ZERO_URL: z.string().url(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
    /* Runtime info */
    NEXT_PUBLIC_RUNTIME: z.enum(['node', 'bun']),
    NEXT_PUBLIC_BUN_VERSION: z
      .string()
      .optional()
      .refine((v) => {
        if (process.env.NODE_ENV !== 'production') return true

        const RUNTIME = process.env.NEXT_PUBLIC_RUNTIME as 'node' | 'bun'
        if (RUNTIME === 'node') return true
        return v && v.length > 0
      }, "You must provide a Bun version if you're running on Bun."),
    NEXT_PUBLIC_NODE_VERSION: z
      .string()
      .optional()
      .refine((v) => {
        if (process.env.NODE_ENV !== 'production') return true

        const RUNTIME = process.env.NEXT_PUBLIC_RUNTIME as 'node' | 'bun'
        if (RUNTIME === 'bun') return true
        return v && v.length > 0
      }, "You must provide a Node version if you're running on Node."),
  },

  server: {
    DATABASE_URL: z.string().url().min(1),
    API_URL: z.string().url(),
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    /* Runtime info */
    RUNTIME: z.enum(['node', 'bun']),
    BUN_VERSION: z
      .string()
      .optional()
      .refine((v) => {
        if (process.env.NODE_ENV !== 'production') return true

        const RUNTIME = process.env.RUNTIME as 'node' | 'bun'
        if (RUNTIME === 'node') return true
        return v && v.length > 0
      }, "You must provide a Bun version if you're running on Bun."),
    NODE_VERSION: z
      .string()
      .optional()
      .refine((v) => {
        if (process.env.NODE_ENV !== 'production') return true

        const RUNTIME = process.env.RUNTIME as 'node' | 'bun'
        if (RUNTIME === 'bun') return true
        return v && v.length > 0
      }, "You must provide a Node version if you're running on Node."),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: {
    /* Client */
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SYNC_URL: process.env.NEXT_PUBLIC_SYNC_URL,
    NEXT_PUBLIC_ZERO_URL: process.env.NEXT_PUBLIC_ZERO_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_RUNTIME: process.env.NEXT_PUBLIC_RUNTIME,
    NEXT_PUBLIC_BUN_VERSION: process.env.NEXT_PUBLIC_BUN_VERSION,
    NEXT_PUBLIC_NODE_VERSION: process.env.NEXT_PUBLIC_NODE_VERSION,
    /* Server */
    DATABASE_URL: process.env.DATABASE_URL,
    API_URL: process.env.API_URL,
    NODE_ENV: process.env.NODE_ENV,
    RUNTIME: process.env.RUNTIME,
    BUN_VERSION: process.env.BUN_VERSION,
    NODE_VERSION: process.env.NODE_VERSION,
  },

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
