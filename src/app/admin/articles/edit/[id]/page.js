'use client';

// app/admin/articles/edit/[id]/page.js
// UPDATED: Consistent style and theme with events/edit page

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Save, Loader2, AlertCircle, Upload, 
  X, Image as ImageIcon, FileText, Tag, Bookmark
} from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ============================================================================
// VALIDATION
// ============================================================================

function validateArticle(data) {
  const errors = {};

  // Required fields
  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (data.title.length > 255) {
    errors.title = 'Title must be less than 255 characters';
  }

  if (!data.content || data.content.trim().length === 0) {
    errors.content = 'Content is required';
  } else if (data.content.length < 50) {
    errors.content = 'Content must be at least 50 characters';
  }

  if (!data.cover_image_url || data.cover_image_url.trim().length === 0) {
    errors.cover_image_url = 'Cover image is required';
  }

  if (!data.category || data.category === '') {
    errors.category = 'Category is required';
  }

  if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
    errors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
  }

  return errors;
}

// ============================================================================
// IMAGE UPLOAD COMPONENT
// ============================================================================

function ImageUpload({ value, onChange }) {
  const [preview, setPreview] = useState(value || '');
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (value) setPreview(value);
  }, [value]);

  const uploadToLocal = async (file) => {
    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'article');

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
        throw new Error(errData.error || 'Upload gagal');
      }

      const data = await response.json();
      if (!data.success || !data.path) {
        throw new Error('Server tidak mengembalikan path gambar');
      }

      setPreview(data.path);
      onChange(data.path);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Gagal mengupload gambar. Pastikan Anda sudah login sebagai super_admin.');
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setUploadError('Pilih file gambar saja');
        toast.error('Pilih file gambar saja');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Ukuran maksimal 5MB');
        toast.error('Ukuran maksimal 5MB');
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
      setUploadError('File tidak valid atau terlalu besar');
      toast.error('File tidak valid atau terlalu besar');
    }
  };

  const handleClear = () => {
    setPreview('');
    onChange('');
  };

  return (
    <div className="space-y-3">
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
          <div className="flex flex-col items-center gap-3">
            {uploading ? (
              <Loader2 className="w-10 h-10 text-[#0066FF] animate-spin" />
            ) : (
              <ImageIcon className="w-10 h-10 text-gray-400" />
            )}
            <div>
              <p className="text-sm font-semibold text-gray-700">
                {uploading ? 'Uploading...' : 'Click or drag image here'}
              </p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
            </div>
          </div>
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

function SimpleSelect({ value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200 flex items-center justify-between"
      >
        <span>{options.find(o => o.value === value)?.label || placeholder}</span>
        <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
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
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors duration-150 ${
                value === option.value ? 'bg-blue-50 text-[#0066FF] font-semibold' : 'text-gray-700'
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

export default function EditArticle() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image_url: '',
    category: '',
    tags: [],
    featured: false,
    status: 'published',
  });

  const [tagInput, setTagInput] = useState('');

  // Category options
  const categoryOptions = [
    { value: 'teknologi', label: 'Teknologi' },
    { value: 'kesehatan', label: 'Kesehatan' },
    { value: 'finansial', label: 'Finansial' },
    { value: 'bisnis', label: 'Bisnis' },
    { value: 'inovasi', label: 'Inovasi' },
    { value: 'karir', label: 'Karir' },
    { value: 'keberlanjutan', label: 'Keberlanjutan' },
    { value: 'lainnya', label: 'Lainnya' },
  ];

  // Status options
  const statusOptions = [
    { value: 'draft', label: 'Draft (Tersimpan, belum tayang)' },
    { value: 'published', label: 'Published (Tayang di website)' },
  ];

  // ============================================================================
  // Fetch article on mount
  // ============================================================================
  useEffect(() => {
    if (!id) {
      toast.error('ID artikel tidak ditemukan');
      router.push('/admin/articles');
      return;
    }

    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/articles/${id}`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${res.status}`);
        }

        const data = await res.json();
        
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          cover_image_url: data.cover_image_url || data.cover_image || '',
          category: data.category || '',
          tags: Array.isArray(data.tags) ? data.tags : [],
          featured: Boolean(data.featured),
          status: data.status || 'published',
        });

        setTagInput(Array.isArray(data.tags) ? data.tags.join(', ') : '');
        setLoading(false);

      } catch (error) {
        console.error('Failed to fetch article:', error);
        toast.error('Gagal memuat artikel: ' + error.message);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, router]);

  // ============================================================================
  // Handle form changes
  // ============================================================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Auto-generate slug from title
    if (name === 'title') {
      const slug = generateSlug(value);
      setFormData(prev => ({ ...prev, slug }));
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // ============================================================================
  // Handle tags
  // ============================================================================
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags.includes(newTag) && formData.tags.length < 10) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // ============================================================================
  // Handle submit
  // ============================================================================
  const handleSubmit = async () => {
    // Validate
    const validationErrors = validateArticle(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix validation errors');
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      toast.success('Article updated successfully');
      router.push('/admin/articles');
      
    } catch (error) {
      console.error('Failed to update article:', error);
      toast.error('Gagal update artikel: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================================
  // Loading state
  // ============================================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#0066FF] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading article...</p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // Render
  // ============================================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Link 
          href="/admin/articles"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#0066FF] transition-colors duration-200 mb-4 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Articles
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Article</h1>
        <p className="text-gray-600">Update article information and content</p>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Article Info */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Article Information</h2>
            
            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter article title..."
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="url-friendly-slug"
                  className={`w-full px-4 py-2 border rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200 ${
                    errors.slug ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <p className="mt-1 text-xs text-gray-500">Auto-generated from title, can be edited manually</p>
                {errors.slug && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.slug}
                  </p>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Excerpt
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Short summary of the article (optional)..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200 resize-none"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your article content here..."
                  rows={12}
                  className={`w-full px-4 py-2 border rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200 resize-none ${
                    errors.content ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.content && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.content}
                  </p>
                )}
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
                disabled={submitting}
                className="w-full px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-300"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Article
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Cover Image <span className="text-red-500">*</span>
            </h2>
            <ImageUpload
              value={formData.cover_image_url}
              onChange={(url) => setFormData(prev => ({ ...prev, cover_image_url: url }))}
            />
            {errors.cover_image_url && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.cover_image_url}
              </p>
            )}
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Settings</h2>
            
            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <SimpleSelect
                value={formData.category}
                onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                options={categoryOptions}
                placeholder="Select category"
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Status */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                Status
              </label>
              <SimpleSelect
                value={formData.status}
                onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                options={statusOptions}
                placeholder="Select status"
              />
              <p className="mt-2 text-xs text-gray-500 font-medium">
                {formData.status === 'published' 
                  ? 'This article will appear on the public website' 
                  : 'This article is saved as a draft only'}
              </p>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200">
              <div>
                <label className="text-sm font-semibold text-gray-700">Featured Article</label>
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

          {/* Tags */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Tags</h2>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type and press Enter..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200"
            />
            <p className="mt-1 text-xs text-gray-500 font-medium">{formData.tags.length}/10 tags</p>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full border border-blue-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-blue-900 transition-colors duration-150"
                    >
                      ×
                    </button>
                  </motion.span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}