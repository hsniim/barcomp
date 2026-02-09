// app/api/auth/me/route.js
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    // Tidak perlu parameter request lagi
    const user = await verifyToken();   // ← await karena async

    if (!user) {
      return NextResponse.json(
        { 
          authenticated: false,
          message: 'Tidak ada token atau token tidak valid' 
        }, 
        { status: 401 }
      );
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName || user.full_name,
      role: user.role,
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