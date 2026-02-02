// test-db.js
// Test koneksi Prisma 7 dengan adapter-mariadb (untuk MySQL/MariaDB)

require('dotenv').config({ path: '.env', override: true });  // FORCE load .env dari root

const { PrismaClient } = require('../src/generated/prisma/client.js');  // pakai .ts kalau file generated memang .ts
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

console.log('Mulai test koneksi Prisma dengan adapter MariaDB/MySQL...');
console.log('Current working directory:', process.cwd());
console.log('DATABASE_URL dari env (setelah dotenv):', process.env.DATABASE_URL || 'KOSONG - env tidak ter-load!');

async function main() {
  let prisma;
  let adapter;

  try {
    // 1. Buat adapter
    adapter = new PrismaMariaDb({
      // Pakai connectionString dari env (normalnya ini yang dipakai)
      connectionString: process.env.DATABASE_URL,

      // Opsional: kalau env masih kosong, uncomment bagian ini dan isi manual
       host: 'localhost',
       port: 3306,
       user: 'barcomp_admindb',
       password: 'Splashy3',
       database: 'barcomp_db',

      connectionLimit: 5,
      acquireTimeout: 60000,      // 60 detik timeout ambil koneksi (lebih panjang)
      waitForConnections: true,
      queueLimit: 0,
    });

    console.log('Adapter dibuat dengan connectionString:', process.env.DATABASE_URL ? 'ADA' : 'KOSONG');

    // 2. Test koneksi manual dari adapter
    console.log('Mencoba connect manual ke DB...');
    await adapter.connect();
    console.log('✅ Adapter berhasil connect manual!');

    // 3. Buat PrismaClient
    prisma = new PrismaClient({
      adapter,
      log: ['query', 'info', 'warn', 'error'],
    });

    console.log('✅ PrismaClient berhasil dibuat');

    // 4. Test query sederhana
    console.log('Mencoba query test: SELECT 1');
    const testQuery = await prisma.$queryRaw`SELECT 1 AS test`;
    console.log('✅ Koneksi database berhasil! Hasil query:', testQuery);

  } catch (error) {
    console.error('❌ ERROR saat koneksi atau query:');
    console.error(error);

    if (error.meta?.driverAdapterError) {
      console.error('Detail error dari adapter:', error.meta.driverAdapterError);
    }
    if (error.code) {
      console.error('Kode error Prisma:', error.code);
    }
    if (error.message && error.message.includes('Access denied')) {
      console.error('Kemungkinan besar: username / password salah atau env tidak terbaca.');
    }
  } finally {
    if (adapter) {
      try {
        await adapter.disconnect?.();
        console.log('Adapter disconnected.');
      } catch (e) {
        console.log('Adapter disconnect gagal:', e);
      }
    }
    if (prisma) {
      await prisma.$disconnect();
      console.log('Prisma disconnected.');
    }
  }
}

main().catch((e) => {
  console.error('Main error:', e);
  process.exit(1);
});