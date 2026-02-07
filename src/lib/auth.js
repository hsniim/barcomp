// lib/auth.js
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SECRET = process.env.JWT_SECRET || 'super-secret-key-ganti-di-env';

// Durasi default dan remember me (dalam detik)
const DEFAULT_EXPIRY_SECONDS = 24 * 60 * 60;          // 24 jam
const REMEMBER_ME_EXPIRY_SECONDS = 30 * 24 * 60 * 60; // 30 hari

export function signToken(user, rememberMe = false) {
  const expiresInSeconds = rememberMe ? REMEMBER_ME_EXPIRY_SECONDS : DEFAULT_EXPIRY_SECONDS;

  return jwt.sign({ 
    id: user.id, 
    role: user.role, 
    email: user.email,
    fullName: user.full_name || user.fullName || 'Admin'
  }, SECRET, {
    expiresIn: expiresInSeconds,
  });
}

// Versi untuk route handlers (menerima request)
export function verifyToken(request) {
  try {
    // Ambil token dari cookie via request.headers
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) return null;

    const tokenMatch = cookieHeader.match(/auth_token=([^;]*)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token) return null;

    return jwt.verify(token, SECRET);
  } catch (err) {
    console.error('Token verification failed in route handler:', err.message);
    return null;
  }
}

// Versi lama (untuk server components / pages yang pakai cookies())
export async function verifyTokenFromCookies() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return null;

    return jwt.verify(token, SECRET);
  } catch (err) {
    console.error('Token verification failed (cookies):', err.message);
    return null;
  }
}

// Untuk middleware atau tempat lain yang sync
export function verifyTokenSync(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    console.error('Token verification failed (sync):', err.message);
    return null;
  }
}

export async function setAuthCookie(token, rememberMe = false) {
  try {
    const cookieStore = await cookies();
    const maxAgeSeconds = rememberMe 
      ? REMEMBER_ME_EXPIRY_SECONDS 
      : DEFAULT_EXPIRY_SECONDS;

    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',  // false di dev untuk localhost
      sameSite: 'lax',                                // 'lax' untuk mendukung redirect
      maxAge: maxAgeSeconds,
      path: '/',
    });

    console.log(`Cookie auth_token diset dengan maxAge: ${maxAgeSeconds} detik`);
  } catch (error) {
    console.error('Error setting auth cookie:', error);
    throw error;
  }
}

export async function clearAuthCookie() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
  } catch (error) {
    console.error('Error clearing auth cookie:', error);
  }
}