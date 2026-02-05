import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  const [rows] = await pool.query(
    'SELECT * FROM articles WHERE status = "published" ORDER BY published_at DESC'
  );
  return Response.json(rows);
}

export async function POST(request) {
  const auth = verifyToken();
  if (!auth || auth.role !== 'super_admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, slug, excerpt, content, cover_image, category, tags, featured } = await request.json();

    const [result] = await pool.query(
      'INSERT INTO articles (title, slug, excerpt, content, cover_image, category, tags, featured, status, published_at, author_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, "published", NOW(), ?)',
      [title, slug, excerpt, content, cover_image, category, JSON.stringify(tags), featured, auth.id]
    );

    return Response.json({ success: true, id: result.insertId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}