// app/admin/articles/create/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Save, Eye, Loader2, AlertCircle, Upload, 
  X, Image as ImageIcon, Check, ChevronDown 
} from 'lucide-react';
import React from 'react';

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

function generateExcerpt(content, maxLength = 200) {
  const plainText = content.replace(/<[^>]*>/g, '').trim();
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).trim() + '...';
}

// ============================================================================
// VALIDATION
// ============================================================================

function validateArticle(data) {
  const errors = {};

  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (data.title.length > 255) {
    errors.title = 'Title must be less than 255 characters';
  }

  if (!data.excerpt || data.excerpt.trim().length === 0) {
    errors.excerpt = 'Excerpt is required';
  }

  if (!data.content || data.content.trim().length === 0) {
    errors.content = 'Content is required';
  } else if (data.content.length < 50) {
    errors.content = 'Content must be at least 50 characters';
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
// SIMPLE TOAST COMPONENT
// ============================================================================

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`fixed top-4 right-4 z-50 max-w-md px-4 py-3 border rounded-lg shadow-lg ${bgColor} ${textColor}`}
    >
      <div className="flex items-center gap-2">
        {type === 'success' ? (
          <Check className="w-5 h-5 text-green-600" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-600" />
        )}
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="ml-auto">
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// ============================================================================
// IMAGE UPLOAD COMPONENT (Vercel Blob)
// ============================================================================

function ImageUpload({ value, onChange }) {
  const [preview, setPreview] = useState(value || '');
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (value) setPreview(value);
  }, [value]);

  const uploadToVercelBlob = async (file) => {
    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
        credentials: 'include',           // ← wajib agar cookie dikirim
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
      if (!data.success || !data.url) {
        throw new Error('Server tidak mengembalikan URL gambar');
      }

      setPreview(data.url);
      onChange(data.url);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Gagal mengupload gambar. Pastikan Anda sudah login sebagai super_admin.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setUploadError('Pilih file gambar saja');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Ukuran maksimal 5MB');
        return;
      }
      uploadToVercelBlob(file);
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
      uploadToVercelBlob(file);
    } else if (file) {
      setUploadError('File tidak valid atau terlalu besar');
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
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            isDragging ? 'border-[#0066FF] bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
              {uploading ? (
                <Loader2 className="w-8 h-8 text-[#0066FF] animate-spin" />
              ) : (
                <ImageIcon className="w-8 h-8 text-[#0066FF]" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                {uploading ? 'Mengupload...' : 'Drag & drop gambar di sini'}
              </p>
              <p className="text-xs text-gray-500 mt-1">atau</p>
            </div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white text-sm font-semibold rounded-lg transition-all duration-200 disabled:opacity-50">
                <Upload className="w-4 h-4" />
                {uploading ? 'Mengupload...' : 'Pilih File'}
              </span>
            </label>
            <p className="text-xs text-gray-400 font-medium">PNG, JPG, WEBP, GIF • maks 5MB</p>
            {uploadError && (
              <p className="mt-3 text-sm text-red-600 font-medium">{uploadError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SIMPLE SELECT COMPONENT
// ============================================================================

function SimpleSelect({ value, onChange, options, placeholder = 'Select...' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left bg-white hover:border-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200 flex items-center justify-between"
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors duration-150 ${
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

export default function CreateArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState(null);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '', // Changed from cover_image_url to match schema column name
    category: '',
    tags: [],
    featured: false,
    status: 'draft'
  });

  // Auto-generate slug from title (only if not manually edited)
  useEffect(() => {
    if (formData.title && !slugManuallyEdited) {
      const autoSlug = generateSlug(formData.title);
      setFormData(prev => ({ ...prev, slug: autoSlug }));
    }
  }, [formData.title, slugManuallyEdited]);

  // Check slug availability
  useEffect(() => {
    const checkSlug = async () => {
      if (!formData.slug || formData.slug.length === 0) {
        setSlugAvailable(null);
        return;
      }

      setCheckingSlug(true);
      try {
        const response = await fetch(`/api/articles?slug=${formData.slug}`);
        const data = await response.json();
        setSlugAvailable(!data.exists);
      } catch (error) {
        console.error('Error checking slug:', error);
      } finally {
        setCheckingSlug(false);
      }
    };

    const timer = setTimeout(checkSlug, 500);
    return () => clearTimeout(timer);
  }, [formData.slug]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Track if slug is manually edited
    if (name === 'slug') {
      setSlugManuallyEdited(true);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      
      if (!formData.tags.includes(newTag) && formData.tags.length < 10) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const getCharCount = (text) => text.length;
  const getWordCount = (text) => text.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = async (publishStatus) => {
    setLoading(true);
    setErrors({});

    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        status: publishStatus,
        published_at: publishStatus === 'published' ? new Date().toISOString() : null
      };

      // Auto-generate excerpt if empty
      if (!submitData.excerpt && submitData.content) {
        submitData.excerpt = generateExcerpt(submitData.content);
      }

      // Validate
      const validationErrors = validateArticle(submitData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setToast({ message: 'Please fix validation errors', type: 'error' });
        setLoading(false);
        return;
      }

      // Check slug availability
      if (slugAvailable === false) {
        setErrors({ slug: 'Slug already exists' });
        setToast({ message: 'Slug already exists', type: 'error' });
        setLoading(false);
        return;
      }

      // Submit to API
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create article');
      }

      const result = await response.json();
      
      setToast({ 
        message: publishStatus === 'published' 
          ? 'Article published successfully!' 
          : 'Article saved as draft!',
        type: 'success' 
      });

      // Redirect after short delay
      setTimeout(() => {
        router.push('/admin/articles');
      }, 1500);

    } catch (error) {
      console.error('Submit error:', error);
      setToast({ message: error.message || 'Failed to save article', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Categories from schema ENUM
  const categories = [
    { value: '', label: 'Select Category' },
    { value: 'teknologi', label: 'Teknologi' },
    { value: 'kesehatan', label: 'Kesehatan' },
    { value: 'finansial', label: 'Finansial' },
    { value: 'bisnis', label: 'Bisnis' },
    { value: 'inovasi', label: 'Inovasi' },
    { value: 'karir', label: 'Karir' },
    { value: 'keberlanjutan', label: 'Keberlanjutan' },
    { value: 'lainnya', label: 'Lainnya' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      {/* Toast Notifications */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/articles"
              className="p-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 shadow-sm transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Article</h1>
              <p className="text-sm text-gray-600 mt-1">Write and publish your article</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
            <div className="space-y-6">
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
                  placeholder="Enter article title..."
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

              {/* Slug */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Slug
                  </label>
                  {slugManuallyEdited && (
                    <button
                      type="button"
                      onClick={() => setSlugManuallyEdited(false)}
                      className="text-xs text-[#0066FF] hover:text-[#0052CC] font-semibold transition-colors duration-200"
                    >
                      Reset to auto-generate
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="article-slug-here"
                    className={`w-full px-4 py-2 border rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200 ${
                      errors.slug ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {checkingSlug && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>
                {errors.slug ? (
                  <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
                ) : slugAvailable === true ? (
                  <p className="mt-1 text-sm text-green-600 font-medium">✓ Slug is available</p>
                ) : slugAvailable === false ? (
                  <p className="mt-1 text-sm text-red-600 font-medium">✗ Slug already exists</p>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">
                    {slugManuallyEdited ? 'Manually edited' : 'Auto-generated from title'}
                  </p>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Excerpt <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Brief summary for list view and SEO..."
                  className={`w-full px-4 py-2 border rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200 ${
                    errors.excerpt ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.excerpt ? (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.excerpt}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500 font-medium">{getCharCount(formData.excerpt)} characters</p>
                )}
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <div className="text-xs font-semibold text-gray-600">
                    {getCharCount(formData.content)} chars • {getWordCount(formData.content)} words
                  </div>
                </div>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={20}
                  placeholder="Write your article content here..."
                  className={`w-full px-4 py-2 border rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200 ${
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
            <h2 className="text-lg font-bold text-gray-900 mb-4">Publish</h2>
            <div className="space-y-3">
              <button
                onClick={() => handleSubmit('published')}
                disabled={loading}
                className="w-full px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Publish Now
                  </>
                )}
              </button>
              <button
                onClick={() => handleSubmit('draft')}
                disabled={loading}
                className="w-full px-4 py-2 border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 text-gray-900 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save as Draft
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Cover Image</h2>
            <ImageUpload
              value={formData.cover_image}
              onChange={(url) => setFormData(prev => ({ ...prev, cover_image: url }))}
            />
            {errors.cover_image && (
              <p className="mt-2 text-sm text-red-600">{errors.cover_image}</p>
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
                options={categories}
                placeholder="Select a category"
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
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