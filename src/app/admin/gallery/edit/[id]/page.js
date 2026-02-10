// app/admin/gallery/edit/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Save, Eye, Loader2, AlertCircle, Upload, 
  X, Image as ImageIcon, ChevronDown 
} from 'lucide-react';
import { toast } from 'sonner';

// ============================================================================
// VALIDATION
// ============================================================================

function validateGallery(data) {
  const errors = {};

  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (data.title.length > 255) {
    errors.title = 'Title must be less than 255 characters';
  }

  if (!data.image_url || data.image_url.trim().length === 0) {
    errors.image_url = 'Main image is required';
  }

  return errors;
}

// ============================================================================
// IMAGE UPLOAD COMPONENT
// ============================================================================

function ImageUpload({ value, onChange, label, required = false }) {
  const [preview, setPreview] = useState(value || '');
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Update preview when value changes (for initial load)
  useEffect(() => {
    if (value) {
      setPreview(value);
    }
  }, [value]);

  const uploadToLocal = async (file) => {
    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'gallery');

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        let errData;
        try {
          errData = await response.json();
        } catch {
          errData = { error: `HTTP ${response.status}` };
        }
        throw new Error(errData.error || 'Upload failed');
      }

      const data = await response.json();
      if (!data.success || !data.path) {
        throw new Error('Server did not return image path');
      }

      setPreview(data.path);
      onChange(data.path);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to upload image');
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file');
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Maximum file size is 5MB');
        toast.error('Maximum file size is 5MB');
        return;
      }
      uploadToLocal(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
      uploadToLocal(file);
    } else if (file) {
      setUploadError('Invalid file or file too large');
      toast.error('Invalid file or file too large');
    }
  };

  const handleClear = () => {
    setPreview('');
    onChange('');
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {preview ? (
        <div className="relative group rounded-xl overflow-hidden border-2 border-gray-200 hover:border-[#0066FF] transition-all duration-300">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover" onError={() => setPreview('')} />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
            <button
              type="button"
              onClick={handleClear}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            isDragging
              ? 'border-[#0066FF] bg-blue-50'
              : uploading
              ? 'border-gray-300 bg-gray-50'
              : 'border-gray-300 hover:border-[#0066FF] hover:bg-gray-50'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-10 h-10 text-[#0066FF] animate-spin" />
              <p className="text-sm font-semibold text-gray-700">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-10 h-10 text-gray-400" />
              <p className="text-sm font-semibold text-gray-700">
                {isDragging ? 'Drop to upload' : 'Click or drag image here'}
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP, GIF (max. 5MB)</p>
            </div>
          )}
        </div>
      )}
      
      {uploadError && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {uploadError}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// SIMPLE SELECT COMPONENT
// ============================================================================

function SimpleSelect({ value, onChange, options, placeholder = 'Select an option' }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-[#0066FF] focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] outline-none transition-all duration-200"
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 ${
                value === option.value ? 'bg-blue-50 text-[#0066FF] font-semibold' : 'text-gray-900'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function EditGalleryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({});

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
    } catch (error) {
      console.error('[EditGallery] Fetch error:', error);
      toast.error('Gagal memuat data gallery');
      router.push('/admin/gallery');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value)
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    console.log('[EditGallery] Submit started');

    // Validate
    const validationErrors = validateGallery(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix validation errors');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        thumbnail_url: formData.thumbnail_url || null,
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#0066FF] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading gallery data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/admin/gallery"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#0066FF] mb-4 font-semibold transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Gallery
          </Link>
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
            Edit Gallery Item
          </h1>
          <p className="text-gray-600 font-medium">Update gallery item details and images</p>
        </motion.div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Basic Information */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Digital Marketing Workshop 2024"
                    className={`w-full px-4 py-2 border rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Brief description of this image..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200"
                  />
                  <p className="mt-1 text-xs text-gray-500 font-medium">
                    {formData.description.length} characters
                  </p>
                </div>

                {/* Captured Date */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                    Captured Date
                  </label>
                  <input
                    type="datetime-local"
                    name="captured_at"
                    value={formData.captured_at}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200"
                  />
                  <p className="mt-1 text-xs text-gray-500 font-medium">
                    Leave empty to keep current time
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Metadata */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Publish Actions */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Update</h2>
              <div className="space-y-3">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Gallery Item
                    </>
                  )}
                </button>
                <Link
                  href="/admin/gallery"
                  className="w-full px-4 py-2 border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 text-gray-900 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                >
                  Cancel
                </Link>
              </div>
            </div>

            {/* Main Image */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
              <ImageUpload
                label="Main Image"
                required={true}
                value={formData.image_url}
                onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
              />
              {errors.image_url && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.image_url}
                </p>
              )}
            </div>

            {/* Thumbnail */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
              <ImageUpload
                label="Thumbnail (Optional)"
                required={false}
                value={formData.thumbnail_url}
                onChange={(url) => setFormData(prev => ({ ...prev, thumbnail_url: url }))}
              />
              <p className="mt-2 text-xs text-gray-500 font-medium">
                For small preview display
              </p>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Settings</h2>
              
              {/* Category */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Category
                </label>
                <SimpleSelect
                  value={formData.category}
                  onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  options={categories}
                  placeholder="Select a category"
                />
              </div>

              {/* Display Order */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200"
                />
                <p className="mt-1 text-xs text-gray-500 font-medium">
                  Lower number = appears first
                </p>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Featured Item</label>
                  <p className="text-xs text-gray-500">Show on homepage</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0066FF]"></div>
                </label>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}