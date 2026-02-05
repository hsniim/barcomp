// app/api/gallery/route.js
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM gallery ORDER BY display_order ASC, created_at DESC'
    );
    return Response.json(rows);
  } catch (error) {
    return Response.json({ error: 'Gagal mengambil gallery' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = verifyToken();
  if (!auth || auth.role !== 'super_admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const {
      title, description, image_url, thumbnail_url,
      category, tags, event_id, captured_at,
      featured, display_order
    } = await request.json();

    const [result] = await pool.query(
      `INSERT INTO gallery (
        title, description, image_url, thumbnail_url, category, tags,
        event_id, captured_at, featured, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, description || null, image_url, thumbnail_url || null,
        category || 'general', JSON.stringify(tags || []), event_id || null,
        captured_at || null, featured || false, display_order || 0
      ]
    );

    return Response.json({ success: true, id: result.insertId });
  } catch (error) {
    return Response.json({ error: 'Gagal upload foto' }, { status: 500 });
  }
}