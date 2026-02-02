// app/api/gallery/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSuperAdmin } from '@/lib/auth';

// GET - List gallery items
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  const skip = (page - 1) * limit;

  const where = {
    ...(category && { category }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    })
  };

  try {
    const [galleries, total] = await Promise.all([
      prisma.gallery.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.gallery.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      galleries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get galleries error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch galleries' },
      { status: 500 }
    );
  }
}

// POST - Create new gallery item (Super Admin only)
export async function POST(request) {
  // Check authentication and authorization
  const { user, error } = requireSuperAdmin(request);
  if (error) return error;

  try {
    const body = await request.json();
    const {
      title,
      description,
      imageUrl,
      thumbnailUrl,
      category,
      tags,
      eventId
    } = body;

    // Validation
    if (!title || !imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Title and image URL are required' },
        { status: 400 }
      );
    }

    // If eventId provided, check if event exists
    if (eventId) {
      const event = await prisma.event.findUnique({
        where: { id: eventId }
      });

      if (!event) {
        return NextResponse.json(
          { success: false, error: 'Event not found' },
          { status: 404 }
        );
      }
    }

    // Create gallery item
    const gallery = await prisma.gallery.create({
      data: {
        title,
        description: description || null,
        imageUrl,
        thumbnailUrl: thumbnailUrl || imageUrl,
        category: category || 'General',
        tags: tags || [],
        eventId: eventId || null
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Gallery item created successfully',
      gallery
    }, { status: 201 });

  } catch (error) {
    console.error('Create gallery error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create gallery item' },
      { status: 500 }
    );
  }
}