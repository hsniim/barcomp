// app/api/upload-image/route.js
// ✅ Updated: Support upload untuk type 'event'

import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  const auth = await verifyToken();

  if (!auth || auth.role !== 'super_admin') {
    console.log('[UPLOAD] Unauthorized - auth data:', auth);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'Tidak ada file atau file invalid' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Hanya gambar (jpg, png, webp, gif)' }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ukuran maksimal 5MB' }, { status: 400 });
    }

    // ✅ UPDATED: Tambahkan 'event' ke validasi type
    let uploadDir = path.join(process.cwd(), 'public', 'uploads');
    let subfolder = ''; // untuk tracking subfolder di relativePath
    
    if (type === 'article') {
      uploadDir = path.join(uploadDir, 'articles');
      subfolder = 'articles';
    } else if (type === 'gallery') {
      uploadDir = path.join(uploadDir, 'gallery');
      subfolder = 'gallery';
    } else if (type === 'event') {
      // ✅ ADDED: Support untuk event uploads
      uploadDir = path.join(uploadDir, 'events');
      subfolder = 'events';
    } else {
      return NextResponse.json({ error: 'Type tidak valid (harus: article, gallery, atau event)' }, { status: 400 });
    }

    await fs.mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name);
    const fileName = `${uuidv4()}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // ✅ UPDATED: Gunakan subfolder yang sudah di-track
    const relativePath = `/uploads/${subfolder}/${fileName}`;

    console.log(`[UPLOAD SUCCESS] Type: ${type}, Path: ${relativePath}`);

    // Return format yang cocok dengan client
    return NextResponse.json({
      success: true,
      path: relativePath,          // yang diharapkan client
      url: relativePath,
      fullUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${relativePath}`,
    });
  } catch (error) {
    console.error('[UPLOAD ERROR]', error);
    return NextResponse.json({ error: 'Gagal upload: ' + error.message }, { status: 500 });
  }
}