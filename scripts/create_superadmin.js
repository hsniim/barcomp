// scripts/create_superadmin.js
import 'dotenv/config';

import db from '../src/lib/db.js';
import bcrypt from 'bcryptjs';

async function createSuperAdmin() {
  console.log('DB_USER     :', process.env.DB_USER || 'TIDAK ADA');
  console.log('DB_NAME     :', process.env.DB_NAME || 'TIDAK ADA');

  // ... (kode cek env seperti sebelumnya jika mau)

  const email = 'barmin21@gmail.com';
  const plainPassword = 'barmin12'; // GANTI YA
  const fullName = 'Super Admin Barcomp';
  const avatar = '/images/superadmin_avatar.jpg';

  try {
    console.log('Memulai pembuatan super admin...');
    console.log('Email target:', email);

    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      console.log(`Super admin dengan email ${email} sudah ada. ID: ${existing[0].id}`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const [result] = await db.query(
      `INSERT INTO users (
        id, email, password, full_name, avatar, role, status
      ) VALUES (
        UUID(), ?, ?, ?, ?, 'super_admin', 'active'
      )`,
      [email, hashedPassword, fullName, avatar]
    );

    console.log('Super admin berhasil dibuat!');
    console.log('Email     :', email);
    console.log('Password  :', plainPassword); // ingat hapus setelah login
    console.log('Full Name :', fullName);
    console.log('ID        :', result.insertId);

    process.exit(0);  // ← KUNCI: keluar otomatis

  } catch (error) {
    console.error('Gagal membuat super admin:', error.message);
    if (error.code) console.error('Error code:', error.code);
    if (error.sqlMessage) console.error('SQL Message:', error.sqlMessage);
    process.exit(1);
  }
}

createSuperAdmin().catch((err) => {
  console.error('Error fatal:', err);
  process.exit(1);
});