// app/admin/gallery/create/page.js
// FIXED: Added missing imports and error boundaries
// FIXED: Better form validation and error handling
// FIXED: Added try-catch to prevent silent failures

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

  const handleImageChange = (e) => {
    try {
      const file = e.target.files?.[0];
      console.log('[CreateGallery] Image file selected:', {
        name: file?.name,
        type: file?.type,
        size: file?.size
      });
      
      if (file) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          toast.error(`Tipe file tidak didukung: ${file.type}`);
          e.target.value = ''; // Reset input
          return;
        }
        
        // Validate file size
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          toast.error(`Ukuran file terlalu besar: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maksimal 5MB.`);
          e.target.value = ''; // Reset input
          return;
        }

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.onerror = (err) => {
          console.error('[CreateGallery] FileReader error:', err);
          toast.error('Gagal membaca file');
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('[CreateGallery] handleImageChange error:', error);
      toast.error('Error memproses file: ' + error.message);
    }
  };

  const handleThumbnailChange = (e) => {
    try {
      const file = e.target.files?.[0];
      console.log('[CreateGallery] Thumbnail file selected:', {
        name: file?.name,
        type: file?.type,
        size: file?.size
      });
      
      if (file) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          toast.error(`Tipe file tidak didukung: ${file.type}`);
          e.target.value = ''; // Reset input
          return;
        }
        
        // Validate file size
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          toast.error(`Ukuran file terlalu besar: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maksimal 5MB.`);
          e.target.value = ''; // Reset input
          return;
        }

        setThumbnailFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setThumbnailPreview(reader.result);
        };
        reader.onerror = (err) => {
          console.error('[CreateGallery] FileReader error:', err);
          toast.error('Gagal membaca file thumbnail');
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('[CreateGallery] handleThumbnailChange error:', error);
      toast.error('Error memproses thumbnail: ' + error.message);
    }
  };

  const uploadImage = async (file, type = 'gallery') => {
    console.log('[CreateGallery] Starting upload:', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      type
    });

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('type', type);

    // Log FormData contents (for debugging)
    for (let pair of uploadFormData.entries()) {
      console.log('[CreateGallery] FormData entry:', pair[0], 
        pair[1] instanceof File ? `File: ${pair[1].name} (${pair[1].type}, ${pair[1].size} bytes)` : pair[1]
      );
    }

    try {
      setUploading(true);
      console.log('[CreateGallery] Sending upload request to /api/upload-image...');
      
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: uploadFormData,
        // IMPORTANT: Do NOT set Content-Type header, let browser set it with boundary
      });

      console.log('[CreateGallery] Upload response status:', res.status);
      console.log('[CreateGallery] Upload response headers:', Object.fromEntries(res.headers.entries()));
      
      const data = await res.json();
      console.log('[CreateGallery] Upload response data:', data);

      if (!res.ok) {
        console.error('[CreateGallery] Upload failed with status:', res.status);
        console.error('[CreateGallery] Upload error data:', data);
        throw new Error(data.error || `Upload failed: ${res.status}`);
      }

      if (!data.path) {
        console.error('[CreateGallery] No path in response:', data);
        throw new Error('Upload berhasil tapi path tidak ditemukan');
      }

      console.log('[CreateGallery] Upload success! Path:', data.path);
      return data.path;
    } catch (error) {
      console.error('[CreateGallery] Upload error:', error);
      console.error('[CreateGallery] Upload error stack:', error.stack);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('[CreateGallery] Form submit started');
    console.log('[CreateGallery] Current form state:', {
      title: formData.title,
      hasImageFile: !!imageFile,
      hasThumbnailFile: !!thumbnailFile,
      imageFileName: imageFile?.name,
      thumbnailFileName: thumbnailFile?.name
    });

    // Validation
    if (!formData.title || !formData.title.trim()) {
      console.error('[CreateGallery] Validation failed: Title is empty');
      toast.error('Judul wajib diisi');
      return;
    }

    if (!imageFile) {
      console.error('[CreateGallery] Validation failed: No image file');
      toast.error('Gambar utama wajib diupload');
      return;
    }

    // Prevent double submission
    if (loading || uploading) {
      console.warn('[CreateGallery] Already processing, ignoring submit');
      return;
    }

    setLoading(true);

    try {
      // Upload main image
      console.log('[CreateGallery] Step 1: Uploading main image...');
      toast.info('Mengupload gambar utama...');
      
      const imageUrl = await uploadImage(imageFile, 'gallery');
      console.log('[CreateGallery] Main image uploaded successfully:', imageUrl);

      // Upload thumbnail (optional)
      let thumbnailUrl = '';
      if (thumbnailFile) {
        console.log('[CreateGallery] Step 2: Uploading thumbnail...');
        toast.info('Mengupload thumbnail...');
        thumbnailUrl = await uploadImage(thumbnailFile, 'gallery');
        console.log('[CreateGallery] Thumbnail uploaded successfully:', thumbnailUrl);
      } else {
        console.log('[CreateGallery] Step 2: No thumbnail file, skipping');
      }

      // Create gallery item
      const payload = {
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        image_url: imageUrl,
        thumbnail_url: thumbnailUrl || null,
        category: formData.category || null,
        tags: Array.isArray(formData.tags) && formData.tags.length > 0 ? formData.tags : [],
        event_id: formData.event_id || null,
        captured_at: formData.captured_at || null,
        featured: !!formData.featured,
        display_order: parseInt(formData.display_order) || 0,
      };

      console.log('[CreateGallery] Step 3: Creating gallery item with payload:', payload);
      toast.info('Menyimpan data...');

      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('[CreateGallery] Create response status:', res.status);
      
      const data = await res.json();
      console.log('[CreateGallery] Create response data:', data);

      if (!res.ok) {
        console.error('[CreateGallery] Create failed:', data);
        throw new Error(data.error || 'Gagal membuat gallery item');
      }

      console.log('[CreateGallery] Success! Created gallery item with ID:', data.id);
      toast.success('Gallery item berhasil dibuat!');
      
      // Redirect after short delay to show success message
      setTimeout(() => {
        router.push('/admin/gallery');
        router.refresh();
      }, 500);
      
    } catch (error) {
      console.error('[CreateGallery] Submit error:', error);
      console.error('[CreateGallery] Submit error stack:', error.stack);
      toast.error(error.message || 'Gagal menyimpan gallery item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tambah Gallery Item</h1>
        <p className="text-gray-600 mt-2">Upload foto untuk gallery website</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Judul <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan judul foto"
            required
            disabled={loading || uploading}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Deskripsi <span className="text-gray-400 text-xs">(opsional)</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Deskripsi singkat tentang foto ini"
            disabled={loading || uploading}
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
            disabled={loading || uploading}
          />
          <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, WebP, GIF (max 5MB)</p>
          {imagePreview && (
            <div className="mt-4 border rounded-lg p-2">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img src={imagePreview} alt="Preview" className="max-h-64 rounded mx-auto" />
            </div>
          )}
        </div>

        {/* Thumbnail (Optional) */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Thumbnail <span className="text-gray-400 text-xs">(opsional)</span>
          </label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleThumbnailChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={loading || uploading}
          />
          <p className="text-xs text-gray-500 mt-1">Versi kecil untuk thumbnail (opsional)</p>
          {thumbnailPreview && (
            <div className="mt-4 border rounded-lg p-2">
              <p className="text-sm text-gray-600 mb-2">Thumbnail Preview:</p>
              <img src={thumbnailPreview} alt="Thumbnail Preview" className="max-h-32 rounded mx-auto" />
            </div>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Kategori <span className="text-gray-400 text-xs">(opsional)</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading || uploading}
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
          <label className="block text-sm font-medium mb-2">
            Tanggal Foto <span className="text-gray-400 text-xs">(opsional)</span>
          </label>
          <input
            type="datetime-local"
            value={formData.captured_at}
            onChange={(e) => setFormData({ ...formData, captured_at: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading || uploading}
          />
        </div>

        {/* Featured */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={loading || uploading}
          />
          <label htmlFor="featured" className="text-sm font-medium">
            Tampilkan sebagai featured
          </label>
        </div>

        {/* Display Order */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Urutan Tampil <span className="text-gray-400 text-xs">(opsional, default: 0)</span>
          </label>
          <input
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
            disabled={loading || uploading}
          />
          <p className="text-xs text-gray-500 mt-1">Semakin kecil angka, semakin awal ditampilkan</p>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={loading || uploading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengupload...
              </span>
            ) : loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menyimpan...
              </span>
            ) : (
              '💾 Simpan Gallery Item'
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading || uploading}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Batal
          </button>
        </div>
      </form>

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs">
          <p className="font-bold mb-2">Debug Info:</p>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>Uploading: {uploading ? 'Yes' : 'No'}</p>
          <p>Image File: {imageFile ? imageFile.name : 'None'}</p>
          <p>Thumbnail File: {thumbnailFile ? thumbnailFile.name : 'None'}</p>
        </div>
      )}
    </div>
  );
}