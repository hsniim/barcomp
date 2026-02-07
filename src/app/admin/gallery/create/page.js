// app/admin/gallery/create/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const CATEGORIES = [
  { value: 'teknologi', label: 'Teknologi' },
  { value: 'kesehatan', label: 'Kesehatan' },
  { value: 'finansial', label: 'Finansial' },
  { value: 'bisnis', label: 'Bisnis' },
  { value: 'inovasi', label: 'Inovasi' },
  { value: 'karir', label: 'Karir' },
  { value: 'keberlanjutan', label: 'Keberlanjutan' },
  { value: 'lainnya', label: 'Lainnya' },
  { value: 'kantor', label: 'Kantor' },
  { value: 'acara', label: 'Acara' },
];

export default function CreateGalleryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    thumbnail_url: '',
    category: '',
    tags: '',
    featured: false,
    display_order: 0,
    captured_at: '',
  });

  const [imagePreview, setImagePreview] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle select change
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload (main image)
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran gambar maksimal 5MB');
      return;
    }

    try {
      setUploading(true);
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('type', 'gallery');

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload gagal');
      }

      setFormData(prev => ({ ...prev, image_url: data.url }));
      setImagePreview(data.url);
      toast.success('Gambar berhasil diupload');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Gagal upload gambar');
    } finally {
      setUploading(false);
    }
  };

  // Handle thumbnail upload
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran gambar maksimal 5MB');
      return;
    }

    try {
      setUploadingThumbnail(true);
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('type', 'gallery');

      const res = await fetch('/api/upload-image', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload gagal');
      }

      setFormData(prev => ({ ...prev, thumbnail_url: data.url }));
      setThumbnailPreview(data.url);
      toast.success('Thumbnail berhasil diupload');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Gagal upload thumbnail');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  // Remove image
  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
    setImagePreview('');
  };

  // Remove thumbnail
  const removeThumbnail = () => {
    setFormData(prev => ({ ...prev, thumbnail_url: '' }));
    setThumbnailPreview('');
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Judul harus diisi');
      return;
    }

    if (!formData.image_url) {
      toast.error('Gambar utama harus diupload');
      return;
    }

    try {
      setLoading(true);

      // Prepare tags as array
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        image_url: formData.image_url,
        thumbnail_url: formData.thumbnail_url || null,
        category: formData.category || null,
        tags: tagsArray.length > 0 ? tagsArray : null,
        featured: formData.featured,
        display_order: parseInt(formData.display_order) || 0,
        captured_at: formData.captured_at || null,
      };

      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal membuat galeri');
      }

      toast.success('Galeri berhasil dibuat');
      router.push('/admin/gallery');
      router.refresh();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.message || 'Gagal membuat galeri');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link
              href="/admin/gallery"
              className="mb-2 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Kembali ke Galeri
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Tambah Galeri Baru</h1>
            <p className="mt-1 text-sm text-gray-600">
              Upload gambar baru ke galeri Barcomp
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Main Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Gambar Utama</CardTitle>
                <CardDescription>
                  Upload gambar utama untuk galeri (maksimal 5MB)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {imagePreview ? (
                  <div className="relative">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-gray-200">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeImage}
                      className="mt-3"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Hapus Gambar
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 transition-colors hover:border-gray-400">
                    <ImageIcon className="mb-4 h-12 w-12 text-gray-400" />
                    <Label
                      htmlFor="image-upload"
                      className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      {uploading ? 'Mengupload...' : 'Pilih Gambar'}
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      PNG, JPG, WebP atau GIF (max. 5MB)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Thumbnail Upload (Optional) */}
            <Card>
              <CardHeader>
                <CardTitle>Thumbnail (Opsional)</CardTitle>
                <CardDescription>
                  Upload thumbnail terpisah atau biarkan kosong untuk menggunakan gambar utama
                </CardDescription>
              </CardHeader>
              <CardContent>
                {thumbnailPreview ? (
                  <div className="relative">
                    <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border-2 border-gray-200">
                      <Image
                        src={thumbnailPreview}
                        alt="Thumbnail Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeThumbnail}
                      className="mt-3"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Hapus Thumbnail
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 transition-colors hover:border-gray-400">
                    <ImageIcon className="mb-3 h-10 w-10 text-gray-400" />
                    <Label
                      htmlFor="thumbnail-upload"
                      className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      {uploadingThumbnail ? 'Mengupload...' : 'Pilih Thumbnail'}
                    </Label>
                    <Input
                      id="thumbnail-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      disabled={uploadingThumbnail}
                      className="hidden"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      PNG, JPG, WebP atau GIF (max. 5MB)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Galeri</CardTitle>
                <CardDescription>
                  Isi detail informasi galeri
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Judul <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Masukkan judul galeri"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Masukkan deskripsi galeri (opsional)"
                    rows={4}
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="Pisahkan dengan koma (contoh: outdoor, team, meeting)"
                  />
                  <p className="text-xs text-gray-500">
                    Pisahkan setiap tag dengan koma
                  </p>
                </div>

                {/* Captured At */}
                <div className="space-y-2">
                  <Label htmlFor="captured_at">Tanggal Pengambilan</Label>
                  <Input
                    id="captured_at"
                    name="captured_at"
                    type="datetime-local"
                    value={formData.captured_at}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-gray-500">
                    Kosongkan untuk menggunakan waktu upload
                  </p>
                </div>

                {/* Display Order */}
                <div className="space-y-2">
                  <Label htmlFor="display_order">Urutan Tampilan</Label>
                  <Input
                    id="display_order"
                    name="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                  />
                  <p className="text-xs text-gray-500">
                    Angka lebih kecil akan ditampilkan lebih dulu
                  </p>
                </div>

                {/* Featured */}
                <div className="flex items-center space-x-2">
                  <input
                    id="featured"
                    name="featured"
                    type="checkbox"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="featured" className="cursor-pointer font-normal">
                    Tampilkan sebagai galeri unggulan
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/gallery')}
                disabled={loading}
              >
                Batal
              </Button>
              <Button type="submit" disabled={loading || uploading || uploadingThumbnail}>
                {loading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Simpan Galeri
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}