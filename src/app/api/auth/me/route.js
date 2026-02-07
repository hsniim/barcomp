// app/api/auth/me/route.js
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Pass request ke verifyToken agar bisa membaca cookies dari header
    const user = await verifyToken(request);

    if (!user) {
      return NextResponse.json(
        { 
          authenticated: false,
          message: 'Tidak ada token atau token tidak valid' 
        }, 
        { status: 401 }
      );
    }

    // Optional: tambahkan informasi minimal user yang aman untuk dikirim ke client
    const safeUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName || user.full_name,
      role: user.role,
      // JANGAN kirim data sensitif seperti password hash dll
    };

    return NextResponse.json({
      authenticated: true,
      user: safeUser
    }, { status: 200 });

  } catch (error) {
    console.error('Error di /api/auth/me:', error.message);
    
    return NextResponse.json(
      { 
        authenticated: false,
        message: 'Terjadi kesalahan server saat verifikasi',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, 
      { status: 500 }
    );
  }
}