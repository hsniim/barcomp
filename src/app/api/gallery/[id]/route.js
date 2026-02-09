// app/api/gallery/[id]/route.js
// FIXED: Soft delete implementation (UPDATE deleted_at instead of DELETE)
// FIXED: Filter deleted_at IS NULL in GET
// FIXED: Proper await verifyToken()
// FIXED: Better error handling and logging
// FIXED: Validate category on UPDATE

import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    console.log('[Gallery GET by ID]', id);
    
    // FIXED: Filter soft-deleted items
    const [rows] = await pool.query(
      'SELECT * FROM gallery WHERE id = ? AND deleted_at IS NULL', 
      [id]
    );
    
    if (rows.length === 0) {
      console.log('[Gallery GET by ID] Not found:', id);
      return NextResponse.json({ error: 'Gallery item tidak ditemukan' }, { status: 404 });
    }
    
    console.log('[Gallery GET by ID] Found:', rows[0].title);
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('[Gallery GET by ID] Error:', error);
    return NextResponse.json({ 
      error: 'Gagal mengambil data',
      details: error.message 
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  console.log('[Gallery PUT] Update request');
  
  // FIXED: Proper await for verifyToken()
  const auth = await verifyToken();
  
  if (!auth || auth.role !== 'super_admin') {
    console.log('[Gallery PUT] Unauthorized:', auth);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    
    console.log('[Gallery PUT] Updating ID:', id, 'with data:', {
      title: body.title,
      category: body.category,
      hasImage: !!body.image_url
    });

    // Validate category if provided
    if (body.category) {
      const validCategories = [
        'teknologi', 'kesehatan', 'finansial', 'bisnis', 
        'inovasi', 'karir', 'keberlanjutan', 'lainnya', 'kantor', 'acara'
      ];
      
      if (!validCategories.includes(body.category)) {
        console.error('[Gallery PUT] Invalid category:', body.category);
        return NextResponse.json({ 
          error: `Kategori tidak valid: ${body.category}` 
        }, { status: 400 });
      }
    }

    // Build UPDATE query dynamically to only update provided fields
    const updates = [];
    const values = [];

    const allowedFields = [
      'title', 'description', 'image_url', 'thumbnail_url', 
      'category', 'tags', 'event_id', 'captured_at', 
      'featured', 'display_order'
    ];

    for (const field of allowedFields) {
      if (body.hasOwnProperty(field)) {
        updates.push(`${field} = ?`);
        
        // Handle JSON fields
        if (field === 'tags' && body[field]) {
          values.push(JSON.stringify(body[field]));
        } 
        // Handle boolean
        else if (field === 'featured') {
          values.push(body[field] ? 1 : 0);
        }
        // Handle null for optional fields
        else if (body[field] === null || body[field] === undefined) {
          values.push(null);
        }
        else {
          values.push(body[field]);
        }
      }
    }

    if (updates.length === 0) {
      console.log('[Gallery PUT] No fields to update');
      return NextResponse.json({ 
        error: 'Tidak ada field yang diupdate' 
      }, { status: 400 });
    }

    values.push(id);
    const query = `UPDATE gallery SET ${updates.join(', ')} WHERE id = ? AND deleted_at IS NULL`;
    
    console.log('[Gallery PUT] Query:', query);
    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      console.log('[Gallery PUT] No rows updated (not found or deleted)');
      return NextResponse.json({ 
        error: 'Gallery item tidak ditemukan atau sudah dihapus' 
      }, { status: 404 });
    }

    console.log('[Gallery PUT] Success');
    return NextResponse.json({ 
      success: true,
      message: 'Gallery item updated successfully'
    });
  } catch (error) {
    console.error('[Gallery PUT] Error:', error);
    console.error('[Gallery PUT] SQL Error:', error.sqlMessage);
    
    return NextResponse.json({ 
      error: 'Gagal update gallery item',
      details: error.sqlMessage || error.message
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  console.log('[Gallery DELETE] Soft delete request');
  
  // FIXED: Proper await for verifyToken()
  const auth = await verifyToken();
  
  if (!auth || auth.role !== 'super_admin') {
    console.log('[Gallery DELETE] Unauthorized:', auth);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    console.log('[Gallery DELETE] Soft deleting ID:', id);

    // FIXED: Soft delete instead of hard delete
    const [result] = await pool.query(
      'UPDATE gallery SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [id]
    );

    if (result.affectedRows === 0) {
      console.log('[Gallery DELETE] Not found or already deleted:', id);
      return NextResponse.json({ 
        error: 'Gallery item tidak ditemukan atau sudah dihapus' 
      }, { status: 404 });
    }

    console.log('[Gallery DELETE] Success');
    return NextResponse.json({ 
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    console.error('[Gallery DELETE] Error:', error);
    return NextResponse.json({ 
      error: 'Gagal menghapus gallery item',
      details: error.message
    }, { status: 500 });
  }
}