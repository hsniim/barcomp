// app/api/events/[id]/route.js
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      console.log(`[GET /api/events/${id}] Event not found`);
      return Response.json({ 
        success: false,
        error: 'Event tidak ditemukan' 
      }, { status: 404 });
    }
    
    console.log(`[GET /api/events/${id}] Event found:`, rows[0].title);
    
    return Response.json({
      success: true,
      data: rows[0]
    });
    
  } catch (error) {
    console.error('[GET /api/events/:id] Error:', error);
    return Response.json({ 
      success: false,
      error: 'Server error' 
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const auth = await verifyToken();
  
  console.log('[PUT /api/events/:id] Auth result:', auth ? `User: ${auth.email}` : 'No auth');
  
  if (!auth || auth.role !== 'super_admin') {
    console.warn('[PUT /api/events/:id] Unauthorized attempt');
    return Response.json({ 
      success: false,
      error: 'Unauthorized' 
    }, { status: 401 });
  }

  const { id } = await params;
  
  try {
    const body = await request.json();
    
    // Validasi event exists
    const [existing] = await pool.query('SELECT id FROM events WHERE id = ?', [id]);
    if (existing.length === 0) {
      return Response.json({ 
        success: false,
        error: 'Event tidak ditemukan' 
      }, { status: 404 });
    }

    // Build update query dinamis
    const allowedFields = [
      'title', 'slug', 'description', 'cover_image', 'event_type',
      'location_type', 'location_venue', 'start_date', 'end_date',
      'tags', 'featured', 'status'
    ];
    
    const updates = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === 'tags' && body[field]) {
          updates[field] = JSON.stringify(body[field]);
        } else {
          updates[field] = body[field];
        }
      }
    }

    if (Object.keys(updates).length === 0) {
      return Response.json({ 
        success: false,
        error: 'Tidak ada field yang diupdate' 
      }, { status: 400 });
    }

    console.log('[PUT /api/events/:id] Updating event:', id, 'Fields:', Object.keys(updates));

    const [result] = await pool.query('UPDATE events SET ? WHERE id = ?', [updates, id]);
    
    console.log('[PUT /api/events/:id] ✅ Updated, affected rows:', result.affectedRows);
    
    return Response.json({ 
      success: true,
      message: 'Event berhasil diupdate'
    });
    
  } catch (error) {
    console.error('[PUT /api/events/:id] Error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return Response.json({ 
        success: false,
        error: 'Slug sudah digunakan' 
      }, { status: 409 });
    }
    
    return Response.json({ 
      success: false,
      error: 'Gagal update event' 
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = await verifyToken();
  
  console.log('[DELETE /api/events/:id] Auth result:', auth ? `User: ${auth.email}` : 'No auth');
  
  if (!auth || auth.role !== 'super_admin') {
    console.warn('[DELETE /api/events/:id] Unauthorized attempt');
    return Response.json({ 
      success: false,
      error: 'Unauthorized' 
    }, { status: 401 });
  }

  const { id } = await params;

  try {
    const [existing] = await pool.query('SELECT id, title FROM events WHERE id = ?', [id]);
    if (existing.length === 0) {
      return Response.json({ 
        success: false,
        error: 'Event tidak ditemukan' 
      }, { status: 404 });
    }

    console.log('[DELETE /api/events/:id] Deleting event:', existing[0].title);

    const [result] = await pool.query('DELETE FROM events WHERE id = ?', [id]);
    
    console.log('[DELETE /api/events/:id] ✅ Deleted, affected rows:', result.affectedRows);
    
    return Response.json({ 
      success: true,
      message: 'Event berhasil dihapus'
    });
    
  } catch (error) {
    console.error('[DELETE /api/events/:id] Error:', error);
    return Response.json({ 
      success: false,
      error: 'Gagal hapus event' 
    }, { status: 500 });
  }
}