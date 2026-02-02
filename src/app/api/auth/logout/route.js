import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = await verifyToken(token);

      if (decoded) {
        // Delete session
        await prisma.session.deleteMany({
          where: {
            userId: decoded.userId,
            sessionToken: token
          }
        });
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ success: true }); // Always return success for logout
  }
}