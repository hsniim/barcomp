import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function PUT(request, { params }) {
  const auth = verifyToken();
  if (!auth || auth.role !== 'super_admin') return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  const { status } = await request.json(); // 'approved' atau 'spam'

  await pool.query('UPDATE comments SET status = ? WHERE id = ?', [status, id]);
  return Response.json({ success: true });
}