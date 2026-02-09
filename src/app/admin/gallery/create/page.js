// app/admin/gallery/create/page.js
// FIXED: Proper upload endpoint (/api/upload-image)
// FIXED: Better file validation and error handling
// FIXED: Category can be null (empty option)
// IMPROVED: Upload progress feedback

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CreateGalleryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: [],
    event_id: '',
    captured_at: '',
    featured: false,
    display_order: 0,
  });

  const [imageFile, setImageFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  const categories = [
    { value: '', label: '-- Pilih Kategori (Opsional) --' },
    { value: 'teknologi', label: 'Teknologi' },
    { value: 'kesehatan', label: 'Kesehatan' },
    { value: 'finansial', label: 'Finansial' },
    { value: 'bisnis', label: 'Bisnis' },
    { value: 'inovasi', label: 'Inovasi' },
    { value: 'karir', label: 'Karir' },
    { value: 'keberlanjutan', label: 'Keberlanjutan' },
    { value: 'kantor', label: 'Kantor' },
    { value: 'acara', label: 'Acara' },
    { value: 'lainnya', label: 'Lainnya' },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    console.log('[CreateGallery] Image selected:', file?.name);
    
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Tipe file tidak didukung: ${file.type}. Gunakan JPG, PNG, WEBP, atau GIF.`);
        return;
      }
      
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error(`Ukuran file terlalu besar: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maksimal 5MB.`);
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    console.log('[CreateGallery] Thumbnail selected:', file?.name);
    
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Tipe file tidak didukung: ${file.type}`);
        return;
      }
      
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(`Ukuran file terlalu besar: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        return;
      }

      setThumbnailFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file, type = 'gallery') => {
    console.log('[CreateGallery] Starting upload for:', file.name);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      setUploading(true);
      
      // FIXED: Use correct endpoint /api/upload-image
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log('[CreateGallery] Upload response:', data);

      if (!res.ok) {
        throw new Error(data.error || 'Upload gagal');
      }

      if (!data.path) {
        throw new Error('Server tidak mengembalikan path gambar');
      }

      console.log('[CreateGallery] Upload success:', data.path);
      return data.path;

    } catch (error) {
      console.error('[CreateGallery] Upload error:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[CreateGallery] Submit started');

    // Validation
    if (!formData.title.trim()) {
      toast.error('Judul wajib diisi');
      return;
    }

    if (!imageFile) {
      toast.error('Gambar utama wajib diupload');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Upload main image
      console.log('[CreateGallery] Uploading main image...');
      toast.info('Mengupload gambar utama...');
      const imageUrl = await uploadImage(imageFile, 'gallery');
      console.log('[CreateGallery] Main image uploaded:', imageUrl);

      // Step 2: Upload thumbnail if exists
      let thumbnailUrl = null;
      if (thumbnailFile) {
        console.log('[CreateGallery] Uploading thumbnail...');
        toast.info('Mengupload thumbnail...');
        thumbnailUrl = await uploadImage(thumbnailFile, 'gallery');
        console.log('[CreateGallery] Thumbnail uploaded:', thumbnailUrl);
      }

      // Step 3: Create gallery item
      const payload = {
        ...formData,
        image_url: imageUrl,
        thumbnail_url: thumbnailUrl,
        category: formData.category || null, // FIXED: Send null if empty
        tags: formData.tags.length > 0 ? formData.tags : [],
        event_id: formData.event_id || null,
        captured_at: formData.captured_at || null,
      };

      console.log('[CreateGallery] Creating gallery item with payload:', payload);
      toast.info('Menyimpan data...');

      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('[CreateGallery] Create response:', data);

      if (!res.ok) {
        throw new Error(data.error || data.details || 'Gagal membuat gallery item');
      }

      toast.success('Gallery item berhasil dibuat!');
      router.push('/admin/gallery');
      router.refresh();

    } catch (error) {
      console.error('[CreateGallery] Submit error:', error);
      toast.error(error.message || 'Gagal menyimpan gallery item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Tambah Gallery Baru</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Judul <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contoh: Workshop Digital Marketing 2024"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Deskripsi</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Deskripsi singkat tentang foto..."
          />
        </div>

        {/* Main Image */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Gambar Utama <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Format: JPG, PNG, WEBP, GIF. Maksimal 5MB.
          </p>
          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img src={imagePreview} alt="Preview" className="max-h-64 rounded shadow" />
            </div>
          )}
        </div>

        {/* Thumbnail (Optional) */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Thumbnail <span className="text-gray-400 text-xs">(opsional - untuk preview kecil)</span>
          </label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleThumbnailChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {thumbnailPreview && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Thumbnail Preview:</p>
              <img src={thumbnailPreview} alt="Thumbnail" className="max-h-32 rounded shadow" />
            </div>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">Kategori</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Captured Date */}
        <div>
          <label className="block text-sm font-medium mb-2">Tanggal Foto Diambil</label>
          <input
            type="datetime-local"
            value={formData.captured_at}
            onChange={(e) => setFormData({ ...formData, captured_at: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Kosongkan untuk menggunakan waktu saat ini
          </p>
        </div>

        {/* Featured Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="mr-2 h-4 w-4"
          />
          <label htmlFor="featured" className="text-sm font-medium">
            Tandai sebagai Featured (tampil di halaman utama)
          </label>
        </div>

        {/* Display Order */}
        <div>
          <label className="block text-sm font-medium mb-2">Urutan Tampil</label>
          <input
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
          <p className="text-xs text-gray-500 mt-1">
            Angka lebih kecil = tampil lebih dulu
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading || uploading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Menyimpan...' : uploading ? 'Mengupload...' : '✓ Simpan Gallery'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading || uploading}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}