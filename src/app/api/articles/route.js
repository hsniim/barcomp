// app/api/articles/route.js
// FIXED: Query params handling, pagination, proper response format for public pages
// FIXED: Server-side filtering untuk status, category, search
// FIXED: Return {success, data, total, page, limit} untuk client compatibility

import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// ============================================================================
// GET - List articles dengan filtering & pagination
// ============================================================================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query params
    const status = searchParams.get('status'); // 'published', 'draft', atau null (all)
    const category = searchParams.get('category'); // 'teknologi', 'kesehatan', dll
    const search = searchParams.get('search'); // keyword search
    const featured = searchParams.get('featured'); // 'true' untuk featured only
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '9', 10);
    
    console.log('[GET /api/articles] Query params:', {
      status, category, search, featured, page, limit
    });

    // Build WHERE clause dengan parameterized queries (prevent SQL injection)
    const conditions = [];
    const params = [];

    // Filter by status (untuk public pages: published only)
    if (status) {
      conditions.push('status = ?');
      params.push(status);
      
      // CRITICAL: Hanya show published yang sudah lewat published_at
      if (status === 'published') {
        conditions.push('(published_at IS NULL OR published_at <= NOW())');
      }
    }

    // Filter by category
    if (category && category !== 'all') {
      conditions.push('category = ?');
      params.push(category);
    }

    // Search by title, excerpt, atau content
    if (search && search.trim()) {
      conditions.push('(title LIKE ? OR excerpt LIKE ? OR content LIKE ?)');
      const searchPattern = `%${search.trim()}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    // Filter featured
    if (featured === 'true') {
      conditions.push('featured = 1');
    }

    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}` 
      : '';

    // Count total untuk pagination
    const countQuery = `SELECT COUNT(*) as total FROM articles ${whereClause}`;
    const [countResult] = await pool.query(countQuery, params);
    const total = countResult[0]?.total || 0;

    console.log(`[GET /api/articles] Total matching articles: ${total}`);

    // Fetch articles dengan pagination
    const offset = (page - 1) * limit;
    const dataQuery = `
      SELECT * FROM articles 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const [rows] = await pool.query(dataQuery, [...params, limit, offset]);

    console.log(`[GET /api/articles] Returned ${rows.length} articles (page ${page})`);

    // FIXED: Return format yang diexpect client
    return NextResponse.json({
      success: true,
      data: rows,
      total: total,
      page: page,
      limit: limit,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('[GET /api/articles] Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Gagal mengambil daftar artikel',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST - Create article (existing code - minimal changes)
// ============================================================================
export async function POST(request) {
  try {
    const user = await verifyToken();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized - Token tidak valid atau tidak ada' }, { status: 401 });
    }

    if (user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden - Hanya super_admin yang diizinkan' }, { status: 403 });
    }

    const body = await request.json();

    console.log('[POST /api/articles] Body diterima:', JSON.stringify(body, null, 2));

    const {
      title,
      slug,
      excerpt = '',
      content,
      cover_image_url,
      category,
      tags = [],
      featured = false,
    } = body;

    // Validasi field wajib
    if (!title?.trim() ||
        !slug?.trim() ||
        !content?.trim() ||
        !cover_image_url?.trim() ||
        !category?.trim()) {
      return NextResponse.json(
        {
          error: 'Field wajib tidak lengkap atau kosong',
          missing: [
            !title?.trim() && 'title',
            !slug?.trim() && 'slug',
            !content?.trim() && 'content',
            !cover_image_url?.trim() && 'cover_image_url',
            !category?.trim() && 'category'
          ].filter(Boolean)
        },
        { status: 400 }
      );
    }

    // Validasi category sesuai ENUM
    const validCategories = [
      'teknologi', 'kesehatan', 'finansial', 'bisnis',
      'inovasi', 'karir', 'keberlanjutan', 'lainnya'
    ];
    if (category && !validCategories.includes(category.toLowerCase())) {
      return NextResponse.json(
        { error: `Category tidak valid. Pilih salah satu: ${validCategories.join(', ')}` },
        { status: 400 }
      );
    }

    // Insert sesuai schema
    const [result] = await pool.query(
      `INSERT INTO articles 
        (id, title, slug, excerpt, content, cover_image, category, tags, featured, status, published_at, author_id)
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, 'published', NOW(), ?)`,
      [
        title.trim(),
        slug.trim(),
        excerpt.trim(),
        content.trim(),
        cover_image_url.trim(),
        category.trim().toLowerCase(), // FIXED: Ensure lowercase untuk ENUM
        JSON.stringify(tags),
        featured ? 1 : 0,
        user.id
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Artikel berhasil dipublikasikan',
        id: result.insertId,
        slug: slug.trim()
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/articles] Error:', error.message || error);
    return NextResponse.json(
      { error: 'Gagal membuat artikel: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}