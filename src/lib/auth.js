// lib/auth.js
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SECRET = process.env.JWT_SECRET || 'super-secret-key-ganti-di-env'; // Ganti di .env!

export function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '7d' });
}

export function verifyToken() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}

export function setAuthCookie(token) {
  cookies().set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 hari
    path: '/',
  });
}

export function clearAuthCookie() {
  cookies().delete('auth_token');
}