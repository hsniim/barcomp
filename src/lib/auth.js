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
    expiresIn: expiresInSeconds,  // JWT akan expire sesuai pilihan
  });
}

// Untuk server components / route handlers (async)
export async function verifyToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return null;

    try {
      return jwt.verify(token, SECRET);
    } catch (err) {
      console.error('Token verification failed:', err);
      return null;
    }
  } catch (error) {
    console.error('Error accessing cookies:', error);
    return null;
  }
}

// Untuk middleware (sync version)
export function verifyTokenSync(token) {
  if (!token) return null;

  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    console.error('Token verification failed (sync):', err);
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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: maxAgeSeconds,           // Cookie expire sesuai pilihan
      path: '/',
    });

    console.log(`Cookie auth_token di-set dengan maxAge: ${maxAgeSeconds} detik (${rememberMe ? '30 hari' : '24 jam'})`);
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