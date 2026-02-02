// prisma.config.ts  (atau prisma/prisma.config.ts kalau di subfolder prisma)
import 'dotenv/config';  // <-- ini WAJIB untuk load .env

import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',  // path relatif dari root project ke schema

  migrations: {
    path: 'prisma/migrations',     // kalau pakai migrate, sesuaikan path ini
    // seed: 'tsx prisma/seed.ts', // optional kalau ada seed script
  },

  datasource: {
    url: env('DATABASE_URL'),      // pakai env() biar type-safe & throw kalau missing
  },
});