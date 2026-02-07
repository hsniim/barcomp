import pool from '@/lib/db';

export async function POST(request) {
  try {
    const { article_id, name, email, content } = await request.json();

    await pool.query(
      'INSERT INTO comments (article_id, name, email, content) VALUES (?, ?, ?, ?)',
      [article_id, name, email, content]
    );

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Gagal kirim komentar' }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const article_id = searchParams.get('article_id');

  if (!article_id) return Response.json({ error: 'article_id required' }, { status: 400 });

  const [rows] = await pool.query(
    'SELECT * FROM comments WHERE article_id = ? AND status = "approved" ORDER BY created_at DESC',
    [article_id]
  );
  return Response.json(rows);
}