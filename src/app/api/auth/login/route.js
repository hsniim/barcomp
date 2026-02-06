// app/api/auth/login/route.js
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken, setAuthCookie } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  console.log('=== MULAI PROSES LOGIN ===');

  try {
    const body = await request.json();
    console.log('Request body diterima:', JSON.stringify(body, null, 2));

    const { email, password, rememberMe } = body;

    if (!email || !password) {
      console.log('Validasi gagal: email atau password kosong');
      return NextResponse.json(
        { error: 'Email dan password harus diisi' },
        { status: 400 }
      );
    }

    console.log(`Mencari user dengan email: "${email}" dan status = "active"`);

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND status = "active"',
      [email]
    );

    console.log('Hasil query users:', {
      jumlah_row: rows.length,
      raw_rows: rows.length > 0 ? 'ada data' : 'kosong'
    });

    if (rows.length === 0) {
      console.log('User tidak ditemukan atau status bukan "active"');
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    const user = rows[0];
    console.log('User ditemukan:', {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      status: user.status,
      password_length: user.password ? user.password.length : 'tidak ada',
      password_starts_with: user.password ? user.password.substring(0, 7) : 'kosong'
    });

    console.log('Memulai verifikasi password (bcrypt.compare)...');
    const match = await bcrypt.compare(password, user.password);

    console.log('Hasil bcrypt.compare:', match);

    if (!match) {
      console.log('Password tidak cocok');
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    console.log('Password cocok! Melanjutkan generate token...');

    const token = signToken(user);
    console.log('Token berhasil dibuat (panjang):', token.length);

    console.log(`Set cookie dengan rememberMe = ${rememberMe}`);
    await setAuthCookie(token, rememberMe);

    console.log('Login sukses, mengembalikan response 200');

    return NextResponse.json({
      success: true,
      token: token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('ERROR saat proses login:', error);
    console.error('Stack trace:', error.stack);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  } finally {
    console.log('=== SELESAI PROSES LOGIN ===\n');
  }
}