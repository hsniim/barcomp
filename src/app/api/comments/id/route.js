// app/api/comments/[id]/route.js
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function PUT(request, { params }) {
  const auth = await verifyToken();  // Perbaikan: await, tanpa request
  if (!auth || auth.role !== 'super_admin') {
    console.log('[PUT /api/comments/[id]] Unauthorized access attempt');
    return Response.json({ error: 'Unauthorized - Hanya super admin yang diizinkan' }, { status: 401 });
  }

  const { id } = params;
  let { status } = await request.json();

  // Validasi status yang diperbolehkan
  const allowedStatuses = ['pending', 'approved', 'spam'];
  if (!allowedStatuses.includes(status)) {
    console.log(`[PUT /api/comments/${id}] Invalid status: ${status}`);
    return Response.json({ error: 'Status tidak valid' }, { status: 400 });
  }

  try {
    const [result] = await pool.query(
      'UPDATE comments SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      console.log(`[PUT /api/comments/${id}] Comment not found`);
      return Response.json({ error: 'Komentar tidak ditemukan' }, { status: 404 });
    }

    console.log(`[PUT /api/comments/${id}] Status updated to ${status}`);
    return Response.json({ success: true, message: `Status diubah menjadi ${status}` });
  } catch (error) {
    console.error(`[PUT /api/comments/${id}] Error updating comment status:`, error);
    return Response.json({ error: 'Gagal mengubah status komentar' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = await verifyToken();  // Perbaikan: await, tanpa request
  if (!auth || auth.role !== 'super_admin') {
    console.log('[DELETE /api/comments/[id]] Unauthorized access attempt');
    return Response.json({ error: 'Unauthorized - Hanya super admin yang diizinkan' }, { status: 401 });
  }

  const { id } = params;

  try {
    const [result] = await pool.query('DELETE FROM comments WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      console.log(`[DELETE /api/comments/${id}] Comment not found`);
      return Response.json({ error: 'Komentar tidak ditemukan' }, { status: 404 });
    }

    console.log(`[DELETE /api/comments/${id}] Comment deleted`);
    return Response.json({ success: true, message: 'Komentar berhasil dihapus' });
  } catch (error) {
    console.error(`[DELETE /api/comments/${id}] Error deleting comment:`, error);
    return Response.json({ error: 'Gagal menghapus komentar' }, { status: 500 });
  }
}