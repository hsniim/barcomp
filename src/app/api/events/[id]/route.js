// app/api/events/[id]/route.js
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
    if (rows.length === 0) {
      return Response.json({ error: 'Event tidak ditemukan' }, { status: 404 });
    }
    return Response.json(rows[0]);
  } catch (error) {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const auth = verifyToken();
  if (!auth || auth.role !== 'super_admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const body = await request.json();

  try {
    // Update hanya field yang dikirim (simple way)
    await pool.query('UPDATE events SET ? WHERE id = ?', [body, id]);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Gagal update event' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = verifyToken();
  if (!auth || auth.role !== 'super_admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    await pool.query('DELETE FROM events WHERE id = ?', [id]);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Gagal hapus event' }, { status: 500 });
  }
}