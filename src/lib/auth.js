// lib/auth.js
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SECRET = process.env.JWT_SECRET || 'super-secret-key-ganti-di-env';

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

// Versi utama & direkomendasikan (untuk route handlers & server components)
// Tidak perlu parameter request lagi
export async function verifyToken() {
  try {
    const cookieStore = await cookies();           // ← wajib await di Next.js 15+
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      console.log('[verifyToken] Token tidak ditemukan di cookies');
      return null;
    }

    console.log('[verifyToken] Token ditemukan, verifying...');
    const decoded = jwt.verify(token, SECRET);

    if (!decoded?.role) {
      console.warn('[verifyToken] Token valid tapi role tidak ditemukan');
    }

    console.log('[verifyToken] Token valid untuk:', decoded.email || decoded.id);
    return decoded;
  } catch (err) {
    console.error('[verifyToken] Token verification failed:', err.name, err.message);  // Log error spesifik (e.g., TokenExpiredError)
    return null;
  }
}

// Versi untuk middleware atau manual token passing (sync)
export function verifyTokenSync(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    console.error('[verifyTokenSync] Token verification failed:', err.message);
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
      sameSite: 'lax',
      maxAge: maxAgeSeconds,
      path: '/',
    });

    console.log(`[setAuthCookie] auth_token diset (maxAge: ${maxAgeSeconds}s)`);
  } catch (error) {
    console.error('[setAuthCookie] Error:', error);
    throw error;
  }
}

export async function clearAuthCookie() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
    console.log('[clearAuthCookie] auth_token dihapus');
  } catch (error) {
    console.error('[clearAuthCookie] Error:', error);
  }
}