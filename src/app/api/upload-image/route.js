// app/api/upload-image/route.js
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth'; // dari sebelumnya
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid

export const config = {
  api: {
    bodyParser: false, // penting untuk handle FormData
  },
};

export async function POST(request) {
  const auth = verifyToken();
  if (!auth || auth.role !== 'super_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type'); // 'article' atau 'gallery' untuk tentukan folder

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'Tidak ada file atau file invalid' }, { status: 400 });
    }

    // Validasi
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Hanya gambar (jpg, png, webp, gif)' }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) { // max 5MB
      return NextResponse.json({ error: 'Ukuran maksimal 5MB' }, { status: 400 });
    }

    // Tentukan folder berdasarkan type
    let uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (type === 'article') {
      uploadDir = path.join(uploadDir, 'articles');
    } else if (type === 'gallery') {
      uploadDir = path.join(uploadDir, 'gallery');
    } else {
      return NextResponse.json({ error: 'Type tidak valid' }, { status: 400 });
    }

    // Buat folder kalau belum ada
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate nama unik
    const ext = path.extname(file.name);
    const fileName = `${uuidv4()}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    // Simpan file
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Path relatif untuk DB (mulai dari /uploads/...)
    const relativePath = `/uploads/${type === 'article' ? 'articles' : 'gallery'}/${fileName}`;

    // Optional: buat thumbnail kecil (pakai sharp kalau mau, npm install sharp)
    // Untuk sekarang, thumbnail_url bisa sama dengan image_url atau generate nanti

    return NextResponse.json({
      success: true,
      url: relativePath,           // simpan ini ke DB
      fullUrl: `${process.env.NEXT_PUBLIC_BASE_URL || ''}${relativePath}`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Gagal upload: ' + error.message }, { status: 500 });
  }
}