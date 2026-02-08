'use client';

// app/admin/articles/edit/[id]/page.js
// FIXED: Added credentials, proper error handling, retry logic, field mapping

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function EditArticle() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image_url: '',
    category: '',
    tags: [],
    featured: false,
    status: 'published', // FIXED: Preserve status
  });

  const [tagInput, setTagInput] = useState('');

  // ============================================================================
  // FIXED: Fetch article with proper auth, error handling, retry
  // ============================================================================
  const fetchArticle = async (retryCount = 0) => {
    try {
      console.log(`[EditArticle] Fetching article ID: ${id} (attempt ${retryCount + 1})`);

      // FIXED: Added credentials for auth
      const res = await fetch(`/api/articles/${id}`, {
        method: 'GET',
        credentials: 'include', // CRITICAL: Include auth cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`[EditArticle] Fetch response status: ${res.status}`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error(`[EditArticle] Fetch failed:`, errorData);

        // IMPROVED: Don't immediately redirect on first failure
        if (res.status === 404 && retryCount < 2) {
          console.log(`[EditArticle] 404 received, retrying in 1s...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return fetchArticle(retryCount + 1);
        }

        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log(`[EditArticle] Article fetched successfully:`, data.title);

      // FIXED: Handle both field name formats
      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        content: data.content || '',
        cover_image_url: data.cover_image_url || data.cover_image || '', // FIXED: Accept both
        category: data.category || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
        featured: Boolean(data.featured),
        status: data.status || 'published', // FIXED: Preserve original status
      });

      setTagInput(
        Array.isArray(data.tags) ? data.tags.join(', ') : ''
      );

      setLoading(false);

    } catch (error) {
      console.error('Failed to fetch article:', error);
      
      // IMPROVED: Show error toast instead of silent redirect
      toast.error('Gagal memuat artikel: ' + error.message, {
        description: 'Coba refresh halaman atau kembali ke daftar artikel',
        action: {
          label: 'Kembali',
          onClick: () => router.push('/admin/articles'),
        },
        duration: 5000,
      });

      setLoading(false);
      // REMOVED: Auto redirect - let user decide
      // setTimeout(() => router.push('/admin/articles'), 2000);
    }
  };

  // ============================================================================
  // Load article on mount
  // ============================================================================
  useEffect(() => {
    if (id) {
      fetchArticle();
    } else {
      console.error('[EditArticle] No ID provided');
      toast.error('ID artikel tidak ditemukan');
      router.push('/admin/articles');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ============================================================================
  // Handle form changes
  // ============================================================================
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from title
    if (field === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleTagsChange = (value) => {
    setTagInput(value);
    const tagsArray = value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    setFormData((prev) => ({ ...prev, tags: tagsArray }));
  };

  // ============================================================================
  // IMPROVED: Upload cover image with better error handling
  // ============================================================================
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    setUploading(true);

    try {
      console.log('[EditArticle] Uploading file:', file.name, file.size, 'bytes');

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include', // FIXED: Include auth
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await res.json();
      console.log('[EditArticle] Upload success:', data.url);

      setFormData((prev) => ({ ...prev, cover_image_url: data.url }));
      toast.success('Cover image berhasil diupload');

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Gagal upload gambar: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // ============================================================================
  // FIXED: Update article with proper validation and field mapping
  // ============================================================================
  const handleUpdate = async () => {
    // Validation
    if (!formData.title?.trim()) {
      toast.error('Judul artikel wajib diisi');
      return;
    }

    if (!formData.slug?.trim()) {
      toast.error('Slug artikel wajib diisi');
      return;
    }

    if (!formData.content?.trim()) {
      toast.error('Konten artikel wajib diisi');
      return;
    }

    if (!formData.cover_image_url?.trim()) {
      toast.error('Cover image wajib diupload');
      return;
    }

    if (!formData.category?.trim()) {
      toast.error('Kategori wajib dipilih');
      return;
    }

    setSaving(true);

    try {
      console.log('[EditArticle] Updating article ID:', id);
      console.log('[EditArticle] Form data:', {
        ...formData,
        content: '(hidden)',
      });

      // FIXED: Send with credentials
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        credentials: 'include', // FIXED: Include auth
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('[EditArticle] Update response status:', res.status);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('[EditArticle] Update failed:', errorData);
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log('[EditArticle] Update success:', data);

      toast.success('Artikel berhasil diupdate!', {
        description: 'Redirecting ke daftar artikel...',
      });

      // Redirect after short delay
      setTimeout(() => {
        router.push('/admin/articles');
      }, 1000);

    } catch (error) {
      console.error('Update error:', error);
      toast.error('Gagal update artikel: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // ============================================================================
  // Render
  // ============================================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Memuat data artikel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/admin/articles')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Edit Artikel</h1>
          </div>
          <p className="text-muted-foreground">
            Update informasi artikel yang sudah dipublikasikan
          </p>
        </div>

        <Button
          onClick={handleUpdate}
          disabled={saving || uploading}
          size="lg"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Update Artikel
            </>
          )}
        </Button>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Artikel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Judul Artikel *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Masukkan judul artikel..."
              required
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug URL *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder="url-friendly-slug"
              required
            />
            <p className="text-sm text-muted-foreground">
              Auto-generated dari judul, bisa diedit manual
            </p>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Ringkasan</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              placeholder="Ringkasan singkat artikel (opsional)..."
              rows={3}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Konten Artikel *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Tulis konten artikel di sini..."
              rows={12}
              required
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label>Cover Image *</Label>
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Upload gambar cover artikel (max 5MB)
                </p>
              </div>
              {uploading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </div>
              )}
            </div>

            {/* Preview */}
            {formData.cover_image_url && (
              <div className="mt-3">
                <img
                  src={formData.cover_image_url}
                  alt="Cover preview"
                  className="w-full max-w-md h-48 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Kategori *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="teknologi">Teknologi</SelectItem>
                <SelectItem value="kesehatan">Kesehatan</SelectItem>
                <SelectItem value="finansial">Finansial</SelectItem>
                <SelectItem value="bisnis">Bisnis</SelectItem>
                <SelectItem value="inovasi">Inovasi</SelectItem>
                <SelectItem value="karir">Karir</SelectItem>
                <SelectItem value="keberlanjutan">Keberlanjutan</SelectItem>
                <SelectItem value="lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status - ADDED */}
          <div className="space-y-2">
            <Label htmlFor="status">Status Publikasi *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft (Tersimpan, belum tayang)</SelectItem>
                <SelectItem value="published">Published (Tayang di website)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {formData.status === 'published' 
                ? '✅ Artikel ini akan tampil di website publik' 
                : '📝 Artikel ini hanya tersimpan sebagai draft'}
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="teknologi, AI, inovasi (pisahkan dengan koma)"
            />
            <p className="text-sm text-muted-foreground">
              Pisahkan dengan koma. Contoh: teknologi, AI, inovasi
            </p>
          </div>

          {/* Featured */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => handleChange('featured', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Jadikan artikel unggulan
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Actions (mobile) */}
      <div className="flex gap-3 sm:hidden">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => router.push('/admin/articles')}
        >
          Batal
        </Button>
        <Button
          className="flex-1"
          onClick={handleUpdate}
          disabled={saving || uploading}
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Update
            </>
          )}
        </Button>
      </div>
    </div>
  );
}