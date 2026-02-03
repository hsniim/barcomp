// src/lib/prisma.js
import { PrismaClient } from '@prisma/client';
import { createPool } from 'mariadb';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';  // ← ini yang benar!

const globalForPrisma = globalThis;  // lebih aman di Next.js / browser-like env

// Connection pool dari DATABASE_URL di .env
const pool = createPool({
  uri: process.env.DATABASE_URL,
  connectionLimit: 10,
  connectTimeout: 15000
});

const adapter = new PrismaMariaDb(pool);

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    adapter,
    log: ['error'],
  });
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = globalForPrisma.prisma;
}

export { prisma };