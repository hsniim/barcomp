// app/api/admin/users/[id]/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireSuperAdmin, hashPassword } from '@/lib/auth';

// GET - Get single user by ID (Super Admin only)
export async function GET(request, { params }) {
  // Check authentication and authorization
  const { user, error } = requireSuperAdmin(request);
  if (error) return error;

  try {
    const { id } = params;

    const userData = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        phone: true,
        avatar: true,
        bio: true,
        role: true,
        status: true,
        emailVerified: true,
        lastLoginAt: true,
        lastLoginIp: true,
        loginCount: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            articles: true,
            comments: true,
            eventRegistrations: true,
            sessions: true
          }
        }
      }
    });

    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT - Update user (Super Admin only)
export async function PUT(request, { params }) {
  // Check authentication and authorization
  const { user, error } = requireSuperAdmin(request);
  if (error) return error;

  try {
    const { id } = params;
    const body = await request.json();
    const {
      email,
      username,
      password,
      fullName,
      phone,
      avatar,
      bio,
      role,
      status,
      emailVerified
    } = body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent super admin from demoting themselves
    if (existingUser.id === user.id && role && role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'You cannot change your own role' },
        { status: 400 }
      );
    }

    // If email is changed, check if new email already exists
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      });

      if (emailExists) {
        return NextResponse.json(
          { success: false, error: 'Email already exists' },
          { status: 400 }
        );
      }
    }

    // If username is changed, check if new username already exists
    if (username && username !== existingUser.username) {
      const usernameExists = await prisma.user.findUnique({
        where: { username }
      });

      if (usernameExists) {
        return NextResponse.json(
          { success: false, error: 'Username already exists' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData = {
      ...(email && { email }),
      ...(username && { username }),
      ...(fullName && { fullName }),
      ...(phone !== undefined && { phone }),
      ...(avatar !== undefined && { avatar }),
      ...(bio !== undefined && { bio }),
      ...(role && { role }),
      ...(status && { status }),
      ...(emailVerified !== undefined && { emailVerified }),
      updatedAt: new Date()
    };

    // If password is provided, hash it
    if (password) {
      updateData.password = await hashPassword(password);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        phone: true,
        avatar: true,
        role: true,
        status: true,
        emailVerified: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user (Super Admin only)
export async function DELETE(request, { params }) {
  // Check authentication and authorization
  const { user, error } = requireSuperAdmin(request);
  if (error) return error;

  try {
    const { id } = params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent super admin from deleting themselves
    if (existingUser.id === user.id) {
      return NextResponse.json(
        { success: false, error: 'You cannot delete your own account' },
        { status: 400 }
      );
    }

    // Delete user (cascade will delete related data)
    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}