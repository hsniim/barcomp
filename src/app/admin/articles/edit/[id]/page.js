// app/admin/articles/edit/[id]/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Save, Eye, Loader2, AlertCircle, Upload, 
  X, Image as ImageIcon, Check, ChevronDown 
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

  if (!data.cover_image_url || data.cover_image_url.trim().length === 0) {
    errors.cover_image_url = 'Cover image is required';
  }

  if (data.slug && !/^[a-z0-9-]+$/.test(data.slug)) {
    errors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
  }

  return errors;
}

// ============================================================================
// IMAGE UPLOAD COMPONENT (Local Upload)
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
          <div className="flex flex-col items-center gap-2">
            {uploading ? (
              <>
                <Loader2 className="w-10 h-10 text-[#0066FF] animate-spin" />
                <p className="text-sm font-semibold text-gray-700">Uploading...</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Drop image here or <span className="text-[#0066FF]">browse</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {uploadError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {uploadError}
          </p>
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
  const selectRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={selectRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-[#0066FF] focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] outline-none transition-all duration-200"
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors duration-150 ${
                value === option.value ? 'bg-blue-50 text-[#0066FF] font-semibold' : 'text-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </motion.div>
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [originalSlug, setOriginalSlug] = useState('');

  const categories = [
    { value: 'teknologi', label: 'Teknologi' },
    { value: 'kesehatan', label: 'Kesehatan' },
    { value: 'finansial', label: 'Finansial' },
    { value: 'bisnis', label: 'Bisnis' },
    { value: 'inovasi', label: 'Inovasi' },
    { value: 'karir', label: 'Karir' },
    { value: 'keberlanjutan', label: 'Keberlanjutan' },
    { value: 'lainnya', label: 'Lainnya' }
  ];

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image_url: '',
    category: '',
    tags: [],
    featured: false,
    status: 'draft'
  });

  useEffect(() => {
    fetchArticle();
  }, [params.id]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/articles/${params.id}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch article');
      }

      const data = await response.json();
      if (data.success && data.data) {
        const article = data.data;
        
        // Parse tags if it's a JSON string
        let parsedTags = [];
        if (article.tags) {
          try {
            parsedTags = typeof article.tags === 'string' 
              ? JSON.parse(article.tags) 
              : article.tags;
          } catch (e) {
            parsedTags = [];
          }
        }

        setFormData({
          title: article.title || '',
          slug: article.slug || '',
          excerpt: article.excerpt || '',
          content: article.content || '',
          cover_image_url: article.cover_image_url || article.cover_image || '',
          category: article.category || '',
          tags: parsedTags,
          featured: article.featured || false,
          status: article.status || 'draft'
        });
        setOriginalSlug(article.slug || '');
        toast.success('Article loaded successfully');
      } else {
        toast.error('Article not found');
        router.push('/admin/articles');
      }
    } catch (error) {
      console.error('Failed to fetch article:', error);
      toast.error('Failed to load article');
      router.push('/admin/articles');
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate slug from title (only if creating new slug or user hasn't manually edited)
  useEffect(() => {
    if (!slugManuallyEdited && formData.title) {
      const newSlug = generateSlug(formData.title);
      setFormData(prev => ({ ...prev, slug: newSlug }));
    }
  }, [formData.title, slugManuallyEdited]);

  // Check slug availability (skip if it's the original slug)
  useEffect(() => {
    const checkSlug = async () => {
      if (!formData.slug || formData.slug === originalSlug) {
        setSlugAvailable(null);
        return;
      }

      try {
        const response = await fetch(`/api/articles?slug=${formData.slug}`, {
          credentials: 'include'
        });
        const data = await response.json();
        setSlugAvailable(!data.data || data.data.length === 0);
      } catch (error) {
        console.error('Error checking slug:', error);
      }
    };

    const timeoutId = setTimeout(checkSlug, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.slug, originalSlug]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'slug') {
      setSlugManuallyEdited(true);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (formData.tags.length >= 10) {
        toast.error('Maximum 10 tags allowed');
        return;
      }
      if (formData.tags.includes(tagInput.trim())) {
        toast.error('Tag already exists');
        return;
      }
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (status) => {
    const dataToValidate = { ...formData, status };
    const validationErrors = validateArticle(dataToValidate);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix validation errors');
      return;
    }

    if (slugAvailable === false) {
      toast.error('Slug already exists, please choose a different one');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        status,
        tags: JSON.stringify(formData.tags)
      };

      const response = await fetch(`/api/articles/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update article');
      }

      toast.success(status === 'published' ? 'Article updated and published!' : 'Article updated as draft!');
      router.push('/admin/articles');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.message || 'Failed to update article');
    } finally {
      setSubmitting(false);
    }
  };

  const getCharCount = (text) => text?.length || 0;
  const getWordCount = (text) => text?.trim().split(/\s+/).filter(Boolean).length || 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-[#0066FF] border-t-transparent animate-spin"></div>
          </div>
          <p className="text-sm font-semibold text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/articles"
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:border-[#0066FF] hover:bg-blue-50 transition-all duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-[#0066FF]" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Edit Article</h1>
            <p className="text-sm text-gray-600 mt-1">Update article information</p>
          </div>
        </div>
      </motion.div>

      {/* Form Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
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
                {errors.title ? (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500 font-medium">{getCharCount(formData.title)}/255 characters</p>
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
                  placeholder="article-url-slug"
                  className={`w-full px-4 py-2 border rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200 ${
                    errors.slug ? 'border-red-500' : 
                    slugAvailable === false ? 'border-red-500' :
                    slugAvailable === true ? 'border-green-500' :
                    'border-gray-300'
                  }`}
                />
                {errors.slug ? (
                  <p className="mt-1 text-sm text-red-600 font-medium">✗ {errors.slug}</p>
                ) : slugAvailable === true ? (
                  <p className="mt-1 text-sm text-green-600 font-medium">✓ Slug available</p>
                ) : slugAvailable === false ? (
                  <p className="mt-1 text-sm text-red-600 font-medium">✗ Slug already exists</p>
                ) : formData.slug === originalSlug ? (
                  <p className="mt-1 text-sm text-blue-600 font-medium">Current slug (unchanged)</p>
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
            <h2 className="text-lg font-bold text-gray-900 mb-4">Update</h2>
            <div className="space-y-3">
              <button
                onClick={() => handleSubmit('published')}
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
                    <Eye className="w-4 h-4" />
                    Update & Publish
                  </>
                )}
              </button>
              <button
                onClick={() => handleSubmit('draft')}
                disabled={submitting}
                className="w-full px-4 py-2 border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 text-gray-900 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {submitting ? (
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