// app/api/articles/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSuperAdmin } from '@/lib/auth';
import { generateSlug } from '@/lib/utils';

// GET - List articles (already exists, this is reference)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const category = searchParams.get('category');
  const status = searchParams.get('status') || 'published';
  const featured = searchParams.get('featured');
  const search = searchParams.get('search');

  const skip = (page - 1) * limit;

  const where = {
    status,
    ...(category && { category }),
    ...(featured !== undefined && { featured: featured === 'true' }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    })
  };

  try {
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              fullName: true,
              username: true,
              avatar: true,
              role: true
            }
          }
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.article.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get articles error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

// POST - Create new article (Super Admin only)
export async function POST(request) {
  // Check authentication and authorization
  const { user, error } = requireSuperAdmin(request);
  if (error) return error;

  try {
    const body = await request.json();
    const {
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      category,
      tags,
      status,
      featured,
      publishedAt,
      metaTitle,
      metaDescription,
      metaKeywords
    } = body;

    // Validation
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const finalSlug = slug || generateSlug(title);

    // Check if slug already exists
    const existingArticle = await prisma.article.findUnique({
      where: { slug: finalSlug }
    });

    if (existingArticle) {
      return NextResponse.json(
        { success: false, error: 'Article with this slug already exists' },
        { status: 400 }
      );
    }

    // Create article
    const article = await prisma.article.create({
      data: {
        title,
        slug: finalSlug,
        content,
        excerpt: excerpt || content.substring(0, 200),
        featuredImage: featuredImage || null,
        category: category || 'Uncategorized',
        tags: tags || [],
        status: status || 'draft',
        featured: featured || false,
        publishedAt: status === 'published' ? (publishedAt || new Date()) : null,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt,
        metaKeywords: metaKeywords || [],
        authorId: user.id,
        viewCount: 0,
        likeCount: 0,
        commentCount: 0
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatar: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Article created successfully',
      article
    }, { status: 201 });

  } catch (error) {
    console.error('Create article error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create article' },
      { status: 500 }
    );
  }
}