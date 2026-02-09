// app/api/upload-image/route.js
// FIXED: Comprehensive logging to debug 400 errors
// FIXED: Better file validation with detailed error messages
// FIXED: Proper async/await for verifyToken()
// FIXED: Added size/type validation before processing

import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  console.log('[UPLOAD] Request received');
  
  // FIXED: Proper await for verifyToken()
  const auth = await verifyToken();

  if (!auth || auth.role !== 'super_admin') {
    console.log('[UPLOAD] Unauthorized - auth data:', auth);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('[UPLOAD] Auth verified for user:', auth.email);

  try {
    const formData = await request.formData();
    console.log('[UPLOAD] FormData parsed successfully');
    
    const file = formData.get('file');
    const type = formData.get('type');

    console.log('[UPLOAD] File object:', {
      exists: !!file,
      isBlob: file instanceof Blob,
      type: file?.type,
      size: file?.size,
      name: file?.name,
      uploadType: type
    });

    // FIXED: Better validation with specific error messages
    if (!file) {
      console.error('[UPLOAD] No file in FormData');
      return NextResponse.json({ error: 'File tidak ditemukan dalam request' }, { status: 400 });
    }

    if (!(file instanceof Blob)) {
      console.error('[UPLOAD] File is not a Blob instance');
      return NextResponse.json({ error: 'File tidak valid (bukan Blob)' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      console.error('[UPLOAD] Invalid file type:', file.type);
      return NextResponse.json({ 
        error: `Tipe file tidak didukung: ${file.type}. Hanya jpg, png, webp, gif yang diperbolehkan.` 
      }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error('[UPLOAD] File too large:', file.size);
      return NextResponse.json({ 
        error: `Ukuran file terlalu besar: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maksimal 5MB.` 
      }, { status: 400 });
    }

    // FIXED: Validate type parameter
    let uploadDir = path.join(process.cwd(), 'public', 'uploads');
    let subfolder = '';
    
    if (type === 'article') {
      uploadDir = path.join(uploadDir, 'articles');
      subfolder = 'articles';
    } else if (type === 'gallery') {
      uploadDir = path.join(uploadDir, 'gallery');
      subfolder = 'gallery';
    } else if (type === 'event') {
      uploadDir = path.join(uploadDir, 'events');
      subfolder = 'events';
    } else {
      console.error('[UPLOAD] Invalid type parameter:', type);
      return NextResponse.json({ 
        error: `Type tidak valid: "${type}". Harus: article, gallery, atau event` 
      }, { status: 400 });
    }

    console.log('[UPLOAD] Creating directory:', uploadDir);
    await fs.mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name) || '.jpg';
    const fileName = `${uuidv4()}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    console.log('[UPLOAD] Writing file to:', filePath);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const relativePath = `/uploads/${subfolder}/${fileName}`;
    const fullUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${relativePath}`;

    console.log('[UPLOAD SUCCESS]', {
      type,
      fileName,
      size: file.size,
      path: relativePath
    });

    return NextResponse.json({
      success: true,
      path: relativePath,
      url: relativePath,
      fullUrl,
      fileName,
      fileSize: file.size
    });
  } catch (error) {
    console.error('[UPLOAD ERROR] Exception:', error);
    console.error('[UPLOAD ERROR] Stack:', error.stack);
    return NextResponse.json({ 
      error: 'Gagal upload: ' + error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}