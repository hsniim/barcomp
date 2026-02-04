// src/lib/prisma.js
import { PrismaClient } from '@prisma/client';
import { createPool } from 'mariadb';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const globalForPrisma = globalThis || global;

const pool = createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'barcomp_admindb',
  password: 'password_kamu_di_sini',  // ganti dengan password asli
  database: 'barcomp_db',
  connectionLimit: 10,
  connectTimeout: 30000,
  acquireTimeout: 30000,
  allowPublicKeyRetrieval: true,
  ssl: false
});

const adapter = new PrismaMariaDb(pool);

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ adapter, log: ['error'] });
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