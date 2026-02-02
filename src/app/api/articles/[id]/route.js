// app/api/articles/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSuperAdmin } from '@/lib/auth';
import { generateSlug } from '@/lib/utils';

// GET - Get single article by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatar: true,
            role: true
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                username: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.article.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    });

    return NextResponse.json({
      success: true,
      article
    });

  } catch (error) {
    console.error('Get article error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

// PUT - Update article (Super Admin only)
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

    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id }
    });

    if (!existingArticle) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // If slug is changed, check if new slug already exists
    if (slug && slug !== existingArticle.slug) {
      const slugExists = await prisma.article.findUnique({
        where: { slug }
      });

      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'Article with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData = {
      ...(title && { title }),
      ...(slug && { slug }),
      ...(content && { content }),
      ...(excerpt !== undefined && { excerpt }),
      ...(featuredImage !== undefined && { featuredImage }),
      ...(category && { category }),
      ...(tags !== undefined && { tags }),
      ...(status && { status }),
      ...(featured !== undefined && { featured }),
      ...(metaTitle && { metaTitle }),
      ...(metaDescription !== undefined && { metaDescription }),
      ...(metaKeywords !== undefined && { metaKeywords }),
      updatedAt: new Date()
    };

    // If status changed to published and no publishedAt, set it
    if (status === 'published' && !existingArticle.publishedAt) {
      updateData.publishedAt = publishedAt || new Date();
    }

    // Update article
    const article = await prisma.article.update({
      where: { id },
      data: updateData,
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
      message: 'Article updated successfully',
      article
    });

  } catch (error) {
    console.error('Update article error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

// DELETE - Delete article (Super Admin only)
export async function DELETE(request, { params }) {
  // Check authentication and authorization
  const { user, error } = requireSuperAdmin(request);
  if (error) return error;

  try {
    const { id } = params;

    // Check if article exists
    const article = await prisma.article.findUnique({
      where: { id }
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Delete article (cascade will delete related comments)
    await prisma.article.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully'
    });

  } catch (error) {
    console.error('Delete article error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}