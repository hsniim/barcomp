import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request, { params }) {
  const { id } = params;
  const [rows] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
  if (rows.length === 0) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(rows[0]);
}

export async function PUT(request, { params }) {
  const auth = verifyToken();
  if (!auth || auth.role !== 'super_admin') return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  const body = await request.json();

  // Update logic mirip POST, tapi pakai UPDATE query
  await pool.query('UPDATE articles SET ? WHERE id = ?', [body, id]);
  return Response.json({ success: true });
}

export async function DELETE(request, { params }) {
  const auth = verifyToken();
  if (!auth || auth.role !== 'super_admin') return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  await pool.query('DELETE FROM articles WHERE id = ?', [id]);
  return Response.json({ success: true });
}