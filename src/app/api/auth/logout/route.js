// app/api/auth/logout/route.js
import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    // Hapus cookie auth_token
    await clearAuthCookie();

    // Buat response JSON + pastikan cookie benar-benar dihapus di header Set-Cookie
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Berhasil logout' 
      },
      { status: 200 }
    );

    // Tambahan: eksplisit hapus cookie di response header (best practice)
    // Ini membantu jika clearAuthCookie gagal di beberapa environment
    response.cookies.delete('auth_token', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    // Optional: bisa tambah header untuk instruksikan client refresh atau clear localStorage
    // response.headers.set('x-logout-success', 'true');

    return response;

  } catch (error) {
    console.error('Logout error:', error);

    return NextResponse.json(
      { 
        success: false, 
        message: 'Gagal logout, silakan coba lagi',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}