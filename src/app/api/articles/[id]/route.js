// app/api/articles/[id]/route.js
// FIXED: Proper async/await, auth handling, logging, dan error responses

import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// ============================================================================
// GET - Fetch single article by ID
// FIXED: Added await verifyToken(), proper error handling, detailed logging
// ============================================================================
export async function GET(request, { params }) {
  try {
    const { id } = await params; // FIXED: await params di Next.js 15+
    
    console.log(`[GET /api/articles/${id}] Request received`);

    // IMPROVED: Verify auth untuk admin routes (opsional: bisa skip jika public)
    // Jika article harus bisa diakses publik, hapus block ini
    const user = await verifyToken(); // FIXED: Added await
    
    if (!user) {
      console.log(`[GET /api/articles/${id}] Unauthorized - No valid token`);
      return NextResponse.json(
        { error: 'Unauthorized - Token tidak valid atau tidak ada' },
        { status: 401 }
      );
    }

    console.log(`[GET /api/articles/${id}] Auth OK, fetching from DB...`);

    // FIXED: Query dengan error handling
    const [rows] = await pool.query(
      'SELECT * FROM articles WHERE id = ?',
      [id]
    );

    console.log(`[GET /api/articles/${id}] Query result: ${rows.length} row(s)`);

    if (rows.length === 0) {
      console.log(`[GET /api/articles/${id}] Article not found in DB`);
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    const article = rows[0];

    // IMPROVED: Transform data untuk konsistensi field names
    const responseData = {
      ...article,
      cover_image_url: article.cover_image, // FIXED: Map cover_image → cover_image_url
      // Parse JSON fields jika ada
      tags: typeof article.tags === 'string' ? JSON.parse(article.tags) : article.tags,
    };

    console.log(`[GET /api/articles/${id}] Success, returning article:`, responseData.title);
    
    return NextResponse.json(responseData);

  } catch (error) {
    console.error(`[GET /api/articles/[id]] Error:`, error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// PUT - Update article
// FIXED: Proper async/await, validation, field mapping
// ============================================================================
export async function PUT(request, { params }) {
  try {
    const { id } = await params; // FIXED: await params
    
    console.log(`[PUT /api/articles/${id}] Request received`);

    // FIXED: Proper auth check
    const user = await verifyToken();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden - Hanya super_admin yang diizinkan' },
        { status: 403 }
      );
    }

    const body = await request.json();
    console.log(`[PUT /api/articles/${id}] Body received:`, Object.keys(body));

    // IMPROVED: Validasi field wajib
    const {
      title,
      slug,
      excerpt = '',
      content,
      cover_image_url, // FIXED: Accept both names
      cover_image,
      category,
      tags = [],
      featured = false,
      status // FIXED: Get status from body (don't default to draft!)
    } = body;

    // FIXED: Map cover_image_url → cover_image untuk DB
    const coverImageValue = cover_image_url || cover_image;

    if (!title?.trim() || !slug?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'Field wajib tidak lengkap (title, slug, content)' },
        { status: 400 }
      );
    }

    // IMPROVED: Build update query dengan field yang benar
    const updateData = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      cover_image: coverImageValue?.trim() || null, // FIXED: Use correct DB field name
      category: category?.trim() || null,
      tags: JSON.stringify(tags),
      featured: featured ? 1 : 0,
      status: status || 'published', // FIXED: Preserve status, default to published
      updated_at: new Date(),
    };

    console.log(`[PUT /api/articles/${id}] Updating with data:`, {
      ...updateData,
      content: '(hidden)',
    });

    await pool.query(
      'UPDATE articles SET ? WHERE id = ?',
      [updateData, id]
    );

    console.log(`[PUT /api/articles/${id}] Update successful`);

    return NextResponse.json({
      success: true,
      message: 'Article updated successfully',
    });

  } catch (error) {
    console.error(`[PUT /api/articles/${id}] Error:`, error);
    return NextResponse.json(
      { error: 'Failed to update article: ' + error.message },
      { status: 500 }
    );
  }
}

// ============================================================================
// DELETE - Delete article
// FIXED: Proper async/await, auth
// ============================================================================
export async function DELETE(request, { params }) {
  try {
    const { id } = await params; // FIXED: await params
    
    console.log(`[DELETE /api/articles/${id}] Request received`);

    const user = await verifyToken(); // FIXED: Added await
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    await pool.query('DELETE FROM articles WHERE id = ?', [id]);
    
    console.log(`[DELETE /api/articles/${id}] Delete successful`);

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully',
    });

  } catch (error) {
    console.error(`[DELETE /api/articles/${id}] Error:`, error);
    return NextResponse.json(
      { error: 'Failed to delete article: ' + error.message },
      { status: 500 }
    );
  }
}