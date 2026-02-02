// app/api/gallery/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSuperAdmin } from '@/lib/auth';

// GET - Get single gallery item by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const gallery = await prisma.gallery.findUnique({
      where: { id },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            startDate: true
          }
        }
      }
    });

    if (!gallery) {
      return NextResponse.json(
        { success: false, error: 'Gallery item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      gallery
    });

  } catch (error) {
    console.error('Get gallery error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery item' },
      { status: 500 }
    );
  }
}

// PUT - Update gallery item (Super Admin only)
export async function PUT(request, { params }) {
  // Check authentication and authorization
  const { user, error } = requireSuperAdmin(request);
  if (error) return error;

  try {
    const { id } = params;
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

    // Check if gallery item exists
    const existingGallery = await prisma.gallery.findUnique({
      where: { id }
    });

    if (!existingGallery) {
      return NextResponse.json(
        { success: false, error: 'Gallery item not found' },
        { status: 404 }
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

    // Prepare update data
    const updateData = {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(imageUrl && { imageUrl }),
      ...(thumbnailUrl !== undefined && { thumbnailUrl }),
      ...(category && { category }),
      ...(tags !== undefined && { tags }),
      ...(eventId !== undefined && { eventId }),
      updatedAt: new Date()
    };

    // Update gallery item
    const gallery = await prisma.gallery.update({
      where: { id },
      data: updateData,
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
      message: 'Gallery item updated successfully',
      gallery
    });

  } catch (error) {
    console.error('Update gallery error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update gallery item' },
      { status: 500 }
    );
  }
}

// DELETE - Delete gallery item (Super Admin only)
export async function DELETE(request, { params }) {
  // Check authentication and authorization
  const { user, error } = requireSuperAdmin(request);
  if (error) return error;

  try {
    const { id } = params;

    // Check if gallery item exists
    const gallery = await prisma.gallery.findUnique({
      where: { id }
    });

    if (!gallery) {
      return NextResponse.json(
        { success: false, error: 'Gallery item not found' },
        { status: 404 }
      );
    }

    // Delete gallery item
    await prisma.gallery.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Gallery item deleted successfully'
    });

  } catch (error) {
    console.error('Delete gallery error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete gallery item' },
      { status: 500 }
    );
  }
}