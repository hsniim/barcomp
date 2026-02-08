import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';

export async function PUT(request) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    
    if (!payload || payload.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const userId = payload.userId;
    const body = await request.json();
    const { full_name, email, avatar, current_password, new_password } = body;

    // Validasi
    if (!full_name || !email) {
      return NextResponse.json(
        { error: 'Nama lengkap dan email harus diisi' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      // Get current user data
      const [users] = await connection.query(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return NextResponse.json(
          { error: 'User tidak ditemukan' },
          { status: 404 }
        );
      }

      const currentUser = users[0];

      // Check if email is already used by another user
      const [emailCheck] = await connection.query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, userId]
      );

      if (emailCheck.length > 0) {
        return NextResponse.json(
          { error: 'Email sudah digunakan' },
          { status: 400 }
        );
      }

      // Jika ingin update password
      let hashedPassword = currentUser.password;
      if (new_password) {
        // Validasi password lama
        if (!current_password) {
          return NextResponse.json(
            { error: 'Password lama harus diisi' },
            { status: 400 }
          );
        }

        const isPasswordValid = await bcrypt.compare(current_password, currentUser.password);
        
        if (!isPasswordValid) {
          return NextResponse.json(
            { error: 'Password lama tidak sesuai' },
            { status: 400 }
          );
        }

        if (new_password.length < 6) {
          return NextResponse.json(
            { error: 'Password baru minimal 6 karakter' },
            { status: 400 }
          );
        }

        // Hash password baru
        hashedPassword = await bcrypt.hash(new_password, 10);
      }

      // Update user
      await connection.query(
        `UPDATE users 
         SET full_name = ?, 
             email = ?, 
             avatar = ?,
             password = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [full_name, email, avatar || currentUser.avatar, hashedPassword, userId]
      );

      // Get updated user data
      const [updatedUsers] = await connection.query(
        'SELECT id, email, full_name, avatar, role, status, created_at, updated_at FROM users WHERE id = ?',
        [userId]
      );

      return NextResponse.json({
        success: true,
        message: 'Profil berhasil diperbarui',
        user: updatedUsers[0]
      });

    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Gagal update profil' },
      { status: 500 }
    );
  }
}