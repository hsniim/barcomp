require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const adapter = new PrismaMariaDb({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

console.log('Model yang tersedia:', Object.keys(prisma).filter(key => /^[a-z]/.test(key)));  // filter model lowercase

prisma.$disconnect();