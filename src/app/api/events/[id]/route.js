// app/api/events/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSuperAdmin } from '@/lib/auth';

// GET - Get single event by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                avatar: true
              }
            }
          },
          orderBy: { registeredAt: 'desc' }
        }
      }
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      event
    });

  } catch (error) {
    console.error('Get event error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// PUT - Update event (Super Admin only)
export async function PUT(request, { params }) {
  // Check authentication and authorization
  const { user, error } = requireSuperAdmin(request);
  if (error) return error;

  try {
    const { id } = params;
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

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id }
    });

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // If slug is changed, check if new slug already exists
    if (slug && slug !== existingEvent.slug) {
      const slugExists = await prisma.event.findUnique({
        where: { slug }
      });

      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'Event with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData = {
      ...(title && { title }),
      ...(slug && { slug }),
      ...(description && { description }),
      ...(featuredImage !== undefined && { featuredImage }),
      ...(category && { category }),
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
      ...(location && { location }),
      ...(venue !== undefined && { venue }),
      ...(maxParticipants !== undefined && { maxParticipants }),
      ...(registrationDeadline !== undefined && { 
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null 
      }),
      ...(status && { status }),
      ...(featured !== undefined && { featured }),
      ...(tags !== undefined && { tags }),
      updatedAt: new Date()
    };

    // Update event
    const event = await prisma.event.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      message: 'Event updated successfully',
      event
    });

  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE - Delete event (Super Admin only)
export async function DELETE(request, { params }) {
  // Check authentication and authorization
  const { user, error } = requireSuperAdmin(request);
  if (error) return error;

  try {
    const { id } = params;

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        registrations: true
      }
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if event has registrations
    if (event.registrations.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete event with existing registrations. Please cancel all registrations first.' 
        },
        { status: 400 }
      );
    }

    // Delete event
    await prisma.event.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully'
    });

  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}