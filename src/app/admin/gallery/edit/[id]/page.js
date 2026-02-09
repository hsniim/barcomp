// app/admin/gallery/edit/[id]/page.js
// FIXED: Same improvements as create page
// FIXED: Handle existing thumbnail properly
// FIXED: Better upload error handling
// FIXED: Category can be set to null (empty)

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';

export default function EditGalleryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    thumbnail_url: '',
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

  useEffect(() => {
    if (id) {
      fetchGalleryItem();
    }
  }, [id]);

  const fetchGalleryItem = async () => {
    console.log('[EditGallery] Fetching gallery item:', id);
    try {
      setFetching(true);
      const res = await fetch(`/api/gallery/${id}`);
      
      if (!res.ok) {
        throw new Error('Gallery item tidak ditemukan');
      }

      const data = await res.json();
      console.log('[EditGallery] Fetched data:', data);

      // Format captured_at for datetime-local input
      let capturedAt = '';
      if (data.captured_at) {
        const date = new Date(data.captured_at);
        capturedAt = date.toISOString().slice(0, 16);
      }

      setFormData({
        title: data.title || '',
        description: data.description || '',
        image_url: data.image_url || '',
        thumbnail_url: data.thumbnail_url || '',
        category: data.category || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
        event_id: data.event_id || '',
        captured_at: capturedAt,
        featured: !!data.featured,
        display_order: data.display_order || 0,
      });

      // Set existing image previews
      if (data.image_url) {
        setImagePreview(data.image_url);
      }
      if (data.thumbnail_url) {
        setThumbnailPreview(data.thumbnail_url);
      }
    } catch (error) {
      console.error('[EditGallery] Fetch error:', error);
      toast.error('Gagal memuat data gallery');
      router.push('/admin/gallery');
    } finally {
      setFetching(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    console.log('[EditGallery] New image selected:', file?.name);
    
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

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    console.log('[EditGallery] New thumbnail selected:', file?.name);
    
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
    console.log('[EditGallery] Uploading:', file.name);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      setUploading(true);
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log('[EditGallery] Upload response:', data);

      if (!res.ok) {
        throw new Error(data.error || 'Upload gagal');
      }

      return data.path;
    } catch (error) {
      console.error('[EditGallery] Upload error:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[EditGallery] Submit started');

    if (!formData.title.trim()) {
      toast.error('Judul wajib diisi');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = formData.image_url;
      let thumbnailUrl = formData.thumbnail_url;

      // Upload new main image if changed
      if (imageFile) {
        console.log('[EditGallery] Uploading new main image...');
        toast.info('Mengupload gambar baru...');
        imageUrl = await uploadImage(imageFile, 'gallery');
        console.log('[EditGallery] New image uploaded:', imageUrl);
      }

      // Upload new thumbnail if changed
      if (thumbnailFile) {
        console.log('[EditGallery] Uploading new thumbnail...');
        toast.info('Mengupload thumbnail baru...');
        thumbnailUrl = await uploadImage(thumbnailFile, 'gallery');
        console.log('[EditGallery] New thumbnail uploaded:', thumbnailUrl);
      }

      const payload = {
        ...formData,
        image_url: imageUrl,
        thumbnail_url: thumbnailUrl || null,
        category: formData.category || null,
        tags: formData.tags.length > 0 ? formData.tags : [],
        event_id: formData.event_id || null,
        captured_at: formData.captured_at || null,
      };

      console.log('[EditGallery] Updating with payload:', payload);

      const res = await fetch(`/api/gallery/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('[EditGallery] Update response:', data);

      if (!res.ok) {
        throw new Error(data.error || 'Gagal update gallery');
      }

      toast.success('Gallery berhasil diupdate');
      router.push('/admin/gallery');
      router.refresh();
    } catch (error) {
      console.error('[EditGallery] Submit error:', error);
      toast.error(error.message || 'Gagal menyimpan perubahan');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Edit Gallery Item</h1>

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
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Deskripsi</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            rows={4}
          />
        </div>

        {/* Main Image */}
        <div>
          <label className="block text-sm font-medium mb-2">Gambar Utama</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">
                {imageFile ? 'Preview baru:' : 'Gambar saat ini:'}
              </p>
              <img src={imagePreview} alt="Preview" className="max-h-64 rounded" />
            </div>
          )}
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Thumbnail <span className="text-gray-400 text-xs">(opsional)</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {thumbnailPreview && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">
                {thumbnailFile ? 'Preview baru:' : 'Thumbnail saat ini:'}
              </p>
              <img src={thumbnailPreview} alt="Thumbnail" className="max-h-32 rounded" />
            </div>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">Kategori</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
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
          <label className="block text-sm font-medium mb-2">Tanggal Foto</label>
          <input
            type="datetime-local"
            value={formData.captured_at}
            onChange={(e) => setFormData({ ...formData, captured_at: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Featured */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="mr-2"
          />
          <label className="text-sm font-medium">Featured</label>
        </div>

        {/* Display Order */}
        <div>
          <label className="block text-sm font-medium mb-2">Urutan Tampil</label>
          <input
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || uploading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : uploading ? 'Mengupload...' : 'Update'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading || uploading}
            className="px-6 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}