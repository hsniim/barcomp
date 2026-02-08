// app/api/comments/route.js
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const auth = await verifyToken();  // Async, tanpa parameter – benar dari auth.js
    if (!auth || auth.role !== 'super_admin') {
      console.log('[GET /api/comments] Unauthorized access attempt');
      return Response.json({ error: 'Unauthorized - Hanya super admin yang diizinkan' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const article_id = searchParams.get('article_id');

    if (!article_id) {
      console.log('[GET /api/comments] Missing article_id');
      return Response.json({ error: 'Missing article_id parameter' }, { status: 400 });
    }

    // Query comments berdasarkan article_id, urut descending created_at
    const [rows] = await pool.query(
      'SELECT * FROM comments WHERE article_id = ? ORDER BY created_at DESC',
      [article_id]
    );

    console.log(`[GET /api/comments] Fetched ${rows.length} comments for article_id: ${article_id}`);
    return Response.json({ success: true, data: rows });
  } catch (error) {
    console.error('[GET /api/comments] Error:', error.message);
    return Response.json({ error: 'Gagal memuat komentar' }, { status: 500 });
  }
}