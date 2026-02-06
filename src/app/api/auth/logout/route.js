// app/api/auth/logout/route.js
import { clearAuthCookie } from '@/lib/auth';

export async function POST() {
  // Hapus cookie → sekarang harus di-await
  await clearAuthCookie();

  return Response.json({ success: true, message: 'Berhasil logout' });
}