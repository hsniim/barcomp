// app/api/events/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSuperAdmin } from '@/lib/auth';
import { generateSlug } from '@/lib/utils';

// GET - List events
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const upcoming = searchParams.get('upcoming');
  const search = searchParams.get('search');

  const skip = (page - 1) * limit;

  const where = {
    ...(status && { status }),
    ...(category && { category }),
    ...(upcoming === 'true' && {
      startDate: { gte: new Date() },
      status: 'published'
    }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    })
  };

  try {
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          registrations: {
            select: {
              id: true,
              status: true
            }
          }
        },
        orderBy: { startDate: 'asc' },
        skip,
        take: limit
      }),
      prisma.event.count({ where })
    ]);

    // Add registrationCount to each event
    const eventsWithCount = events.map(event => ({
      ...event,
      registrationCount: event.registrations.length,
      registrations: undefined // Remove detailed registrations from list view
    }));

    return NextResponse.json({
      success: true,
      events: eventsWithCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST - Create new event (Super Admin only)
export async function POST(request) {
  // Check authentication and authorization
  const { user, error } = requireSuperAdmin(request);
  if (error) return error;

  try {
    const body = await request.json();
    const {
      title,
      slug,
      description,
      featuredImage,
      category,
      startDate,
      endDate,
      location,
      venue,
      maxParticipants,
      registrationDeadline,
      status,
      featured,
      tags
    } = body;

    // Validation
    if (!title || !description || !startDate || !location) {
      return NextResponse.json(
        { success: false, error: 'Title, description, start date, and location are required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const finalSlug = slug || generateSlug(title);

    // Check if slug already exists
    const existingEvent = await prisma.event.findUnique({
      where: { slug: finalSlug }
    });

    if (existingEvent) {
      return NextResponse.json(
        { success: false, error: 'Event with this slug already exists' },
        { status: 400 }
      );
    }

    // Create event
    const event = await prisma.event.create({
      data: {
        title,
        slug: finalSlug,
        description,
        featuredImage: featuredImage || null,
        category: category || 'General',
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location,
        venue: venue || null,
        maxParticipants: maxParticipants || null,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
        status: status || 'draft',
        featured: featured || false,
        tags: tags || []
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Event created successfully',
      event
    }, { status: 201 });

  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
}