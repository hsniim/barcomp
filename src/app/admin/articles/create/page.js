// app/admin/articles/create/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Save, Eye, Loader2, AlertCircle, Upload, 
  X, Image as ImageIcon, Check, ChevronDown 
} from 'lucide-react';

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

function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
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

  if (!data.content || data.content.trim().length === 0) {
    errors.content = 'Content is required';
  } else if (data.content.length < 50) {
    errors.content = 'Content must be at least 50 characters';
  }

  if (!data.category || data.category.trim().length === 0) {
    errors.category = 'Category is required';
  }

  if (data.cover_image && data.cover_image.trim().length > 0) {
    try {
      new URL(data.cover_image);
    } catch (e) {
      errors.cover_image = 'Invalid image URL';
    }
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
// IMAGE UPLOAD COMPONENT
// ============================================================================

function ImageUpload({ value, onChange }) {
  const [preview, setPreview] = useState(value || '');
  const [isDragging, setIsDragging] = useState(false);

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setPreview(url);
    onChange(url);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setPreview(dataUrl);
        onChange(dataUrl);
      };
      reader.readAsDataURL(file);
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
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setPreview(dataUrl);
        onChange(dataUrl);
      };
      reader.readAsDataURL(file);
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
              <ImageIcon className="w-8 h-8 text-[#0066FF]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Drag and drop an image here</p>
              <p className="text-xs text-gray-500 mt-1">or</p>
            </div>
            <label className="cursor-pointer">
              <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#0066FF] text-white text-sm font-semibold rounded-lg hover:bg-[#0052CC] transition-all duration-300 shadow-lg">
                <Upload className="w-4 h-4" />
                Choose File
              </span>
            </label>
          </div>
        </div>
      )}
      <input
        type="url"
        value={value || ''}
        onChange={handleUrlChange}
        placeholder="Or paste image URL"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200"
      />
    </div>
  );
}

// ============================================================================
// SIMPLE SELECT COMPONENT
// ============================================================================

function SimpleSelect({ value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useState(null)[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef && !event.target.closest('.dropdown-container')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, dropdownRef]);

  return (
    <div className="relative dropdown-container">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none flex items-center justify-between hover:border-gray-400 transition-all duration-200"
      >
        <span className={value ? 'text-gray-900 font-medium' : 'text-gray-500'}>
          {value || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors duration-150 ${
                value === option ? 'bg-blue-50 text-[#0066FF] font-semibold' : 'text-gray-700'
              }`}
            >
              {option}
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
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [slugAvailable, setSlugAvailable] = useState(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    cover_image: '',
    status: 'draft',
    featured: false
  });

  const categories = [
    'Technology',
    'Business',
    'Lifestyle',
    'Health',
    'Education',
    'Entertainment',
    'Sports',
    'Travel',
    'Food',
    'Science'
  ];

  // Auto-generate slug when title changes
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const newSlug = generateSlug(formData.title);
      setFormData(prev => ({ ...prev, slug: newSlug }));
    }
  }, [formData.title]);

  // Check slug availability
  useEffect(() => {
    if (formData.slug && formData.slug.length >= 3) {
      const timeoutId = setTimeout(() => {
        checkSlugAvailability(formData.slug);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setSlugAvailable(null);
    }
  }, [formData.slug]);

  const checkSlugAvailability = async (slug) => {
    setCheckingSlug(true);
    try {
      const response = await fetch(`/api/articles/check-slug?slug=${slug}`);
      const data = await response.json();
      setSlugAvailable(data.available);
    } catch (error) {
      console.error('Error checking slug:', error);
    } finally {
      setCheckingSlug(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      
      if (formData.tags.length >= 10) {
        setToast({ message: 'Maximum 10 tags allowed', type: 'error' });
        return;
      }
      
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
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

  const handleSubmit = async (status) => {
    const dataToSubmit = {
      ...formData,
      status,
      excerpt: formData.excerpt || generateExcerpt(formData.content),
      readTime: calculateReadTime(formData.content)
    };

    const validationErrors = validateArticle(dataToSubmit);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setToast({ message: 'Please fix the errors before submitting', type: 'error' });
      return;
    }

    if (slugAvailable === false) {
      setErrors(prev => ({ ...prev, slug: 'This slug is already taken' }));
      setToast({ message: 'Slug is already taken', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(dataToSubmit)
      });

      const data = await response.json();

      if (data.success) {
        setToast({ 
          message: status === 'published' ? 'Article published successfully!' : 'Article saved as draft!',
          type: 'success' 
        });
        setTimeout(() => {
          router.push('/admin/articles');
        }, 1500);
      } else {
        setToast({ message: data.error || 'Failed to save article', type: 'error' });
      }
    } catch (error) {
      console.error('Error saving article:', error);
      setToast({ message: 'An error occurred while saving', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getCharCount = (text) => text?.length || 0;
  const getWordCount = (text) => text?.trim().split(/\s+/).filter(Boolean).length || 0;

  return (
    <div className="pb-8">
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
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link 
                href="/admin/articles"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create New Article</h1>
            </div>
            <p className="ml-14 text-base text-gray-600">Write and publish your content</p>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 tracking-wide mb-2">
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
                <p className="mt-1 text-xs text-gray-500">{getCharCount(formData.title)}/255 characters</p>
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-bold text-gray-700 tracking-wide mb-2">
                  URL Slug
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="article-url-slug"
                    className={`w-full px-4 py-2 border rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none pr-10 transition-all duration-200 ${
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
                ) : (
                  <p className="mt-1 text-sm text-gray-500">Auto-generated from title</p>
                )}
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-gray-700 tracking-wide">
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

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-bold text-gray-700 tracking-wide mb-2">
                  Excerpt (Optional)
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Brief description (auto-generated if left empty)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200"
                />
                <p className="mt-1 text-xs text-gray-500 font-medium">{getCharCount(formData.excerpt)}/500 characters</p>
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
            <h2 className="text-lg font-bold text-gray-900 mb-4">Featured Image</h2>
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