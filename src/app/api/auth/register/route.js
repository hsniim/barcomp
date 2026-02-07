import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();

    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    // Check if username exists
    if (body.username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username: body.username }
      });

      if (existingUsername) {
        return NextResponse.json(
          { error: 'Username sudah digunakan' },
          { status: 400 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        fullName: body.fullName,
        username: body.username,
        phone: body.phone,
        company: body.company,
        jobTitle: body.jobTitle,
        city: body.city,
        newsletterSubscribed: body.newsletterSubscribed || true,
        role: 'user',
        status: 'active', // Change to 'inactive' if email verification required
        emailVerified: true // Change to false if email verification required
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Registrasi berhasil!'
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat registrasi' },
      { status: 500 }
    );
  }
}