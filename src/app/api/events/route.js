// app/api/events/route.js
// UPDATED: Menambahkan dukungan query ?slug= untuk halaman detail
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug'); // untuk single event by slug
    const status = searchParams.get('status'); // 'upcoming', 'ongoing', 'completed'
    
    console.log('[GET /api/events] Query params:', { slug, status });

    // Build WHERE clause
    const conditions = [];
    const params = [];

    // Filter by slug (untuk detail page)
    if (slug) {
      conditions.push('slug = ?');
      params.push(slug);
    }

    // Filter by status
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    } else if (!slug) {
      // Default: hanya upcoming dan ongoing jika tidak ada slug
      conditions.push('status IN (?, ?)');
      params.push('upcoming', 'ongoing');
    }

    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}` 
      : '';

    const query = `SELECT * FROM events ${whereClause} ORDER BY start_date ASC`;
    const [rows] = await pool.query(query, params);
    
    console.log(`[GET /api/events] Found ${rows.length} events`);
    
    // ✅ FIX: Return with success wrapper untuk konsistensi dengan frontend
    return Response.json({
      success: true,
      data: rows,
      total: rows.length
    });
    
  } catch (error) {
    console.error('[GET /api/events] Error:', error);
    return Response.json({ 
      success: false,
      error: 'Gagal mengambil data events' 
    }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await verifyToken();
  
  console.log('[POST /api/events] Auth result:', auth ? `User: ${auth.email}, Role: ${auth.role}` : 'No auth');
  
  if (!auth || auth.role !== 'super_admin') {
    console.warn('[POST /api/events] Unauthorized attempt:', { auth });
    return Response.json({ 
      success: false,
      error: 'Unauthorized' 
    }, { status: 401 });
  }

  try {
    const {
      title, slug, description, cover_image, event_type,
      location_type, location_venue, start_date, end_date,
      tags, featured, status
    } = await request.json();

    // Validasi input dasar
    if (!title || !slug || !description || !cover_image || !event_type || !location_type || !start_date || !end_date) {
      return Response.json({ 
        success: false,
        error: 'Field required tidak lengkap' 
      }, { status: 400 });
    }

    console.log('[POST /api/events] Creating event:', { title, slug, event_type });

    // Generate UUID
    const { v4: uuidv4 } = await import('uuid');
    const eventId = uuidv4();

    console.log('[POST /api/events] Generated UUID:', eventId);

    const [result] = await pool.query(
      `INSERT INTO events (
        id, title, slug, description, cover_image, event_type, location_type,
        location_venue, start_date, end_date, tags, featured, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        eventId,
        title, 
        slug, 
        description, 
        cover_image, 
        event_type, 
        location_type,
        location_venue || null, 
        start_date, 
        end_date, 
        JSON.stringify(tags || []), 
        featured || false, 
        status || 'upcoming'
      ]
    );

    console.log('[POST /api/events] ✅ Event created successfully');
    console.log('[POST /api/events] - UUID:', eventId);
    console.log('[POST /api/events] - Affected rows:', result.affectedRows);

    if (result.affectedRows === 0) {
      throw new Error('Insert failed - no rows affected');
    }

    return Response.json({ 
      success: true, 
      id: eventId,
      message: 'Event berhasil dibuat'
    }, { status: 201 });

  } catch (error) {
    console.error('[POST /api/events] Error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return Response.json({ 
        success: false,
        error: 'Slug sudah digunakan, silakan gunakan slug lain' 
      }, { status: 409 });
    }
    
    return Response.json({ 
      success: false,
      error: error.message || 'Gagal membuat event' 
    }, { status: 500 });
  }
}