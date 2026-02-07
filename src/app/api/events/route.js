// app/api/events/route.js
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    // Public: tampilkan upcoming & ongoing saja, atau semua tergantung kebutuhan
    const [rows] = await pool.query(
      `SELECT * FROM events 
       WHERE status IN ('upcoming', 'ongoing') 
       ORDER BY start_date ASC`
    );
    return Response.json(rows);
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Gagal mengambil data events' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = verifyToken();
  if (!auth || auth.role !== 'super_admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const {
      title, slug, description, cover_image, event_type,
      location_type, location_venue, start_date, end_date,
      tags, featured, status
    } = await request.json();

    const [result] = await pool.query(
      `INSERT INTO events (
        title, slug, description, cover_image, event_type, location_type,
        location_venue, start_date, end_date, tags, featured, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, slug, description, cover_image, event_type, location_type,
        location_venue, start_date, end_date, JSON.stringify(tags || []), featured, status || 'upcoming'
      ]
    );

    return Response.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error(error);
    return Response.json({ error: error.message || 'Gagal membuat event' }, { status: 500 });
  }
} 