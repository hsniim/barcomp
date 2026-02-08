// app/api/articles/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM articles WHERE status = "published" ORDER BY published_at DESC'
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('[GET /api/articles] Database error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil daftar artikel' },
      { status: 500 }
    );
  }
}

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

    // Log body untuk debug (hapus setelah fix)
    console.log('[POST /api/articles] Body diterima:', JSON.stringify(body, null, 2));

    const {
      title,
      slug,
      excerpt = '',
      content,
      cover_image_url,       // ← nama field yang dikirim dari client setelah upload
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

    // Pastikan category sesuai ENUM (opsional, tapi bagus untuk integritas)
    const validCategories = [
      'teknologi', 'kesehatan', 'finansial', 'bisnis',
      'inovasi', 'karir', 'keberlanjutan', 'lainnya'
    ];
    if (category && !validCategories.includes(category)) {
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
        cover_image_url.trim(),     // ← disimpan ke kolom cover_image
        category.trim() || null,
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