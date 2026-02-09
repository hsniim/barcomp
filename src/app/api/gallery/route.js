// app/api/gallery/route.js
// FIXED: Soft delete implementation (filter deleted_at IS NULL)
// FIXED: Default category to NULL instead of 'general' (matches schema)
// FIXED: Proper await verifyToken()
// FIXED: Better error logging
// FIXED: Handle thumbnail_url as optional

import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('[Gallery GET] Fetching active gallery items');
    
    // FIXED: Filter soft-deleted items
    const [rows] = await pool.query(
      'SELECT * FROM gallery WHERE deleted_at IS NULL ORDER BY display_order ASC, created_at DESC'
    );
    
    console.log(`[Gallery GET] Found ${rows.length} active items`);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('[Gallery GET] Error:', error);
    return NextResponse.json({ 
      error: 'Gagal mengambil gallery',
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST(request) {
  console.log('[Gallery POST] Creating new gallery item');
  
  // FIXED: Proper await for verifyToken()
  const auth = await verifyToken();
  
  if (!auth || auth.role !== 'super_admin') {
    console.log('[Gallery POST] Unauthorized:', auth);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log('[Gallery POST] Received data:', {
      title: body.title,
      category: body.category,
      hasImage: !!body.image_url,
      hasThumbnail: !!body.thumbnail_url
    });

    const {
      title, 
      description, 
      image_url, 
      thumbnail_url,
      category, 
      tags, 
      event_id, 
      captured_at,
      featured, 
      display_order
    } = body;

    // Validation
    if (!title || !image_url) {
      console.error('[Gallery POST] Missing required fields');
      return NextResponse.json({ 
        error: 'Title dan image_url wajib diisi' 
      }, { status: 400 });
    }

    // FIXED: category default to NULL (not 'general'), matches schema
    const categoryValue = category || null;
    
    // Validate category if provided
    const validCategories = [
      'teknologi', 'kesehatan', 'finansial', 'bisnis', 
      'inovasi', 'karir', 'keberlanjutan', 'lainnya', 'kantor', 'acara'
    ];
    
    if (categoryValue && !validCategories.includes(categoryValue)) {
      console.error('[Gallery POST] Invalid category:', categoryValue);
      return NextResponse.json({ 
        error: `Kategori tidak valid: ${categoryValue}` 
      }, { status: 400 });
    }

    const [result] = await pool.query(
      `INSERT INTO gallery (
        title, description, image_url, thumbnail_url, category, tags,
        event_id, captured_at, featured, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, 
        description || null, 
        image_url, 
        thumbnail_url || null, // FIXED: Handle null thumbnail
        categoryValue, // FIXED: Use null instead of 'general'
        JSON.stringify(tags || []), 
        event_id || null,
        captured_at || new Date(), // Default to now if not provided
        featured ? 1 : 0, 
        display_order || 0
      ]
    );

    console.log('[Gallery POST] Success, inserted ID:', result.insertId);

    return NextResponse.json({ 
      success: true, 
      id: result.insertId,
      message: 'Gallery item created successfully'
    });
  } catch (error) {
    console.error('[Gallery POST] Error:', error);
    console.error('[Gallery POST] SQL Error Code:', error.code);
    console.error('[Gallery POST] SQL Error Message:', error.sqlMessage);
    
    return NextResponse.json({ 
      error: 'Gagal membuat gallery item',
      details: error.sqlMessage || error.message
    }, { status: 500 });
  }
}