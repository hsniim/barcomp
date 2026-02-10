// app/api/gallery/route.js
// FIXED: Category filtering di server-side
// FIXED: Proper response format dengan success flag
// FIXED: Better error handling dan logging

import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

// ============================================================================
// GET - List gallery dengan filtering
// ============================================================================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query params
    const category = searchParams.get('category'); // 'teknologi', 'kantor', dll
    const featured = searchParams.get('featured'); // 'true' untuk featured only
    const eventId = searchParams.get('event_id'); // filter by event
    
    console.log('[GET /api/gallery] Query params:', { category, featured, eventId });

    // Build WHERE clause
    const conditions = ['deleted_at IS NULL']; // CRITICAL: Always filter soft-deleted
    const params = [];

    // Filter by category
    if (category && category !== 'all') {
      conditions.push('category = ?');
      params.push(category);
    }

    // Filter featured
    if (featured === 'true') {
      conditions.push('featured = 1');
    }

    // Filter by event
    if (eventId) {
      conditions.push('event_id = ?');
      params.push(eventId);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    // Count total
    const countQuery = `SELECT COUNT(*) as total FROM gallery ${whereClause}`;
    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0]?.total || 0;

    // Fetch gallery items
    const dataQuery = `
      SELECT * FROM gallery 
      ${whereClause}
      ORDER BY display_order ASC, created_at DESC
    `;
    
    const [rows] = await pool.query(dataQuery, params);
    
    console.log(`[GET /api/gallery] Found ${rows.length} active items (total: ${total})`);
    
    // FIXED: Return format yang konsisten dengan articles
    return NextResponse.json({
      success: true,
      data: rows,
      total: total
    });
  } catch (error) {
    console.error('[GET /api/gallery] Error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Gagal mengambil gallery',
      details: error.message 
    }, { status: 500 });
  }
}

// ============================================================================
// POST - Create gallery item
// ============================================================================
export async function POST(request) {
  console.log('[Gallery POST] Creating new gallery item');
  
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
    if (!title?.trim() || !image_url?.trim()) {
      console.error('[Gallery POST] Missing required fields');
      return NextResponse.json({ 
        error: 'Title dan image_url wajib diisi' 
      }, { status: 400 });
    }

    // FIXED: category default to NULL, lowercase untuk ENUM
    const categoryValue = category ? category.toLowerCase() : null;
    
    // Validate category if provided
    const validCategories = [
      'teknologi', 'kesehatan', 'finansial', 'bisnis', 
      'inovasi', 'karir', 'keberlanjutan', 'lainnya', 'kantor', 'acara'
    ];
    
    if (categoryValue && !validCategories.includes(categoryValue)) {
      console.error('[Gallery POST] Invalid category:', categoryValue);
      return NextResponse.json({ 
        error: `Kategori tidak valid: ${categoryValue}. Pilih: ${validCategories.join(', ')}` 
      }, { status: 400 });
    }

    const [result] = await pool.query(
      `INSERT INTO gallery (
        title, description, image_url, thumbnail_url, category, tags,
        event_id, captured_at, featured, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(), 
        description?.trim() || null, 
        image_url.trim(), 
        thumbnail_url?.trim() || null,
        categoryValue,
        JSON.stringify(tags || []), 
        event_id || null,
        captured_at || new Date(),
        featured ? 1 : 0, 
        display_order || 0
      ]
    );

    console.log('[Gallery POST] Success, inserted ID:', result.insertId);

    return NextResponse.json({ 
      success: true, 
      id: result.insertId,
      message: 'Gallery item created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('[Gallery POST] Error:', error);
    console.error('[Gallery POST] SQL Error:', error.sqlMessage);
    
    return NextResponse.json({ 
      success: false,
      error: 'Gagal membuat gallery item',
      details: error.sqlMessage || error.message
    }, { status: 500 });
  }
}