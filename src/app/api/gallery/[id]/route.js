// app/api/gallery/[id]/route.js
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request, { params }) {
  const { id } = params;
  const [rows] = await pool.query('SELECT * FROM gallery WHERE id = ?', [id]);
  if (rows.length === 0) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(rows[0]);
}

export async function PUT(request, { params }) {
  const auth = verifyToken();
  if (!auth || auth.role !== 'super_admin') return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  const body = await request.json();

  try {
    await pool.query('UPDATE gallery SET ? WHERE id = ?', [body, id]);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Gagal update' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = verifyToken();
  if (!auth || auth.role !== 'super_admin') return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  await pool.query('DELETE FROM gallery WHERE id = ?', [id]);
  return Response.json({ success: true });
}