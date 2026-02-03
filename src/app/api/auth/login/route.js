// src/app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    // PERBAIKAN DI SINI: users, bukan user!!!
    const user = await prisma.users.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Check status aktif
    if (user.status !== 'active') {
      return NextResponse.json(
        { error: 'Akun Anda tidak aktif atau diblokir' },
        { status: 403 }
      );
    }

    // Generate token
    const token = generateToken(user, rememberMe ? '30d' : '1d');

    // Update last login
    await prisma.users.update({
      where: { id: user.id },
      data: {
        last_login_at: new Date(),
        last_login_ip: request.headers.get('x-forwarded-for') || 'unknown',
        login_count: user.login_count ? user.login_count + 1 : 1
      }
    });

    // Create session (pastikan modelnya juga benar, kalau di schema namanya sessions)
    await prisma.sessions.create({
      data: {
        user_id: user.id,
        session_token: token,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent'),
        expires_at: new Date(Date.now() + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000)
      }
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        username: user.username,
        avatar: user.avatar,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}