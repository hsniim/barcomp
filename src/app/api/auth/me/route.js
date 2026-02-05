import { verifyToken } from '@/lib/auth';

export async function GET() {
  const user = verifyToken();
  if (!user) {
    return Response.json({ authenticated: false }, { status: 401 });
  }
  return Response.json({ authenticated: true, user });
}