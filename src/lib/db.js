// src/lib/db.js   (atau src/lib/db.ts kalau pakai TypeScript)
import mysql from 'mysql2/promise';

const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  
  // Best practices pool settings untuk Next.js / serverless
  waitForConnections: true,
  connectionLimit: 10,          // Mulai dari 10–15 untuk company profile (naikkan kalau traffic tinggi)
  maxIdle: 10,                  // Max idle connections (sama dengan connectionLimit biasanya)
  idleTimeout: 60000,           // 60 detik – tutup koneksi idle (cocok Vercel/serverless)
  queueLimit: 0,                // Unlimited queue (atau set 50 kalau mau batasi)
  
  // Optional: bantu stabilitas koneksi
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  
  // Optional: kalau pakai SSL (disarankan untuk production)
  // ssl: {
  //   rejectUnauthorized: true, // atau false kalau self-signed
  //   ca: process.env.DB_CA_CERT, // kalau ada cert
  // },
  
  // Optional: custom type casting kalau ada field BIT/boolean aneh
  typeCast: function (field, next) {
    if (field.type === 'BIT' && field.length === 1) {
      const bytes = field.buffer();
      return bytes ? bytes[0] === 1 : false;
    }
    return next();
  },
};

// Buat pool sekali saja (singleton pattern)
const pool = mysql.createPool(poolConfig);

// Export default supaya mudah di-import
export default pool;

// Optional: untuk debug di dev
if (process.env.NODE_ENV === 'development') {
  console.log('MySQL Pool dibuat dengan config:', {
    host: poolConfig.host,
    user: poolConfig.user,
    database: poolConfig.database,
    connectionLimit: poolConfig.connectionLimit,
  });
}