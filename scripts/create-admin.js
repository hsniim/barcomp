// scripts/create-admin.js
require('dotenv').config();  // load .env

const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const bcrypt = require('bcryptjs');

async function main() {
  console.log('DATABASE_URL dari env:', process.env.DATABASE_URL ? 'ADA' : 'TIDAK ADA');

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL tidak ditemukan di .env!');
  }

  console.log('Membuat adapter...');
  let adapter;
  try {
    adapter = new PrismaMariaDb({
      url: connectionString,
      acquireTimeout: 30000,  // 30 detik (default 10s)
      connectTimeout: 30000,
      connectionLimit: 5,
      host: 'localhost',
      port: 3306,
      user: 'barcomp_admindb',
      password: 'Splashy3',  // tulis password asli di sini (tanpa encode)
      database: 'barcomp_db'
      });
    console.log('Adapter berhasil dibuat.');
  } catch (err) {
    console.error('Gagal membuat adapter:', err);
    throw err;
  }

  console.log('Membuat PrismaClient...');
  let prisma;
  try {
    prisma = new PrismaClient({
      adapter,
      log: ['query', 'info', 'warn', 'error'],
    });
    console.log('PrismaClient berhasil dibuat.');
  } catch (err) {
    console.error('Gagal instantiate PrismaClient:', err);
    throw err;
  }

  try {
    console.log('Membuat Super Admin...');

    const hashedPassword = await bcrypt.hash('barmin07pw', 12);

    const admin = await prisma.users.create({
      data: {
        email: 'barmin21@gmail.com',
        username: 'barmin',
        password: hashedPassword,
        full_name: 'Barcomp Admin',
        role: 'super_admin',
        status: 'active',
        email_verified: true,
        avatar: '/images/default-avatar.jpg',
      },
    });

    console.log('✅ Super Admin berhasil dibuat!');
    console.log(admin);
  } catch (error) {
    console.error('❌ Gagal membuat admin:', error);
    if (error.code) console.log('Error code Prisma:', error.code);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
      console.log('Disconnected Prisma.');
    }
  }
}

main().catch(e => {
  console.error('Error fatal:', e);
  process.exit(1);
});