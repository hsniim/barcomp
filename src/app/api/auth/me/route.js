// app/api/auth/me/route.js
import { verifyToken } from '@/lib/auth';

export async function GET() {
  const user = await verifyToken();   // ← await di sini
  if (!user) {
    return Response.json({ authenticated: false }, { status: 401 });
  }
  return Response.json({ authenticated: true, user });
}