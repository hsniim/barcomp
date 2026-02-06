// app/api/upload-image/route.js
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth'; // dari file auth.js sebelumnya

export const config = {
  api: {
    bodyParser: false, // penting! biar bisa handle multipart/form-data manual
  },
};

export async function POST(request) {
  // 1. Cek autentikasi (hanya super_admin boleh upload)
  const auth = verifyToken();
  if (!auth || auth.role !== 'super_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Parse form data (karena bodyParser false)
    const formData = await request.formData();
    const file = formData.get('file'); // nama field di form harus 'file'

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file uploaded or invalid file' }, { status: 400 });
    }

    // Optional: validasi tipe file (hanya gambar)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'File harus gambar (jpg, png, webp, gif)' }, { status: 400 });
    }

    // Optional: batasi ukuran (misal max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ukuran file maksimal 5MB' }, { status: 400 });
    }

    // 3. Generate nama file unik (misal: timestamp-originalname)
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '-').toLowerCase();
    const fileName = `${timestamp}-${originalName}`;

    // 4. Upload ke Vercel Blob
    const blob = await put(fileName, file, {
      access: 'public',           // publik supaya bisa diakses tanpa token
      addRandomSuffix: true,      // tambah random string biar unik & aman
      token: process.env.BLOB_READ_WRITE_TOKEN, // optional kalau env sudah set
    });

    // 5. Return URL yang bisa disimpan ke DB (cover_image_url / image_url)
    return NextResponse.json({
      success: true,
      url: blob.url,              // https://blob.vercel-storage.com/...
      size: blob.size,
      type: blob.contentType,
    });
  } catch (error) { 
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Gagal upload gambar: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}