// app/api/upload-image/route.js
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';   // ← sekarang menerima request

export async function POST(request) {
  try {
    // Verifikasi token dengan request
    const user = verifyToken(request);
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file uploaded or invalid file' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'File harus gambar (jpg, png, webp, gif)' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ukuran file maksimal 5MB' }, { status: 400 });
    }

    const timestamp = Date.now();
    const safeName = file.name
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9._-]/g, '')
      .toLowerCase();
    const fileName = `${timestamp}-${safeName}`;

    const blob = await put(fileName, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      size: blob.size,
      type: blob.contentType,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Gagal upload gambar', details: error.message },
      { status: 500 }
    );
  }
}