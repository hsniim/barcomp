// app/admin/gallery/create/page.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Save, Eye, Loader2, AlertCircle, Upload, 
  X, Image as ImageIcon, Check, ChevronDown, Calendar, 
  User, Tag, Grid3x3
} from 'lucide-react';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function getImageDimensions(file) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.src = URL.createObjectURL(file);
  });
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
// SIMPLE SELECT COMPONENT
// ============================================================================

function SimpleSelect({ value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left bg-white hover:border-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200 flex items-center justify-between"
      >
        <span className={selectedOption ? 'text-gray-900 font-medium' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors duration-150 ${
                  value === option.value ? 'bg-blue-50 text-[#0066FF] font-semibold' : 'text-gray-900'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CreateGalleryPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);

  // FIXED: Default metadata sesuai schema (snake_case)
  const [defaultMetadata, setDefaultMetadata] = useState({
    category: 'General',
    event_id: '',
    photographer: '',
    captured_at: new Date().toISOString().split('T')[0]
  });

  const categories = [
    { value: 'General', label: 'General' },
    { value: 'Events', label: 'Events' },
    { value: 'Team', label: 'Team' },
    { value: 'Office', label: 'Office' },
    { value: 'Products', label: 'Products' },
    { value: 'Landscape', label: 'Landscape' },
    { value: 'Architecture', label: 'Architecture' }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events?limit=100', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setEvents([
          { value: '', label: 'No Event' },
          ...data.events.map(e => ({ value: e.id, label: e.title }))
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );

    if (files.length === 0) {
      setToast({ message: 'Please drop only image files', type: 'error' });
      return;
    }

    await processFiles(files);
  }, []);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    await processFiles(files);
  };

  const processFiles = async (files) => {
    const newImages = await Promise.all(
      files.map(async (file, index) => {
        const dimensions = await getImageDimensions(file);
        return {
          id: Date.now() + index,
          file,
          preview: URL.createObjectURL(file),
          title: file.name.replace(/\.[^/.]+$/, ''),
          description: '',
          width: dimensions.width,
          height: dimensions.height,
          tags: [],
          status: 'pending',
          progress: 0
        };
      })
    );

    setImages(prev => [...prev, ...newImages]);
  };

  const updateImage = (id, updates) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, ...updates } : img
    ));
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleTagsChange = (id, tagsString) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(Boolean);
    updateImage(id, { tags });
  };

  const uploadImage = async (image) => {
    try {
      updateImage(image.id, { status: 'uploading', progress: 0 });

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        updateImage(image.id, { progress: i });
      }

      // TODO: Replace with actual upload to storage (Cloudinary/S3)
      const imageUrl = image.preview;
      const thumbnailUrl = image.preview;

      // FIXED: Prepare data sesuai schema Prisma (snake_case)
      const submitData = {
        title: image.title,
        description: image.description || null,
        image_url: imageUrl,
        thumbnail_url: thumbnailUrl,
        category: defaultMetadata.category,
        tags: image.tags.length > 0 ? image.tags : null,
        event_id: defaultMetadata.event_id || null,
        width: image.width,
        height: image.height,
        photographer: defaultMetadata.photographer || null,
        captured_at: defaultMetadata.captured_at,
        featured: false,
        display_order: 0
      };

      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (data.success) {
        updateImage(image.id, { status: 'success', progress: 100 });
        return true;
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      updateImage(image.id, { status: 'error', progress: 0 });
      return false;
    }
  };

  const handleUploadAll = async () => {
    if (images.length === 0) {
      setToast({ message: 'No images to upload', type: 'error' });
      return;
    }

    setUploading(true);

    const uploadPromises = images
      .filter(img => img.status === 'pending')
      .map(img => uploadImage(img));

    const results = await Promise.all(uploadPromises);
    const successCount = results.filter(Boolean).length;

    setUploading(false);

    if (successCount === results.length) {
      setToast({ message: `${successCount} photo(s) uploaded successfully!`, type: 'success' });
      setTimeout(() => router.push('/admin/gallery'), 2000);
    } else {
      setToast({ message: `${successCount}/${results.length} photo(s) uploaded`, type: 'error' });
    }
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Link href="/admin/gallery">
          <button className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Gallery
          </button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Upload Photos</h1>
        <p className="mt-1 text-base text-gray-600">Add multiple photos to your gallery</p>
      </motion.div>

      {/* 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ${
              isDragging 
                ? 'border-[#0066FF] bg-blue-50 scale-[1.02]' 
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
          >
            <div className="p-12 text-center">
              <motion.div
                animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-4"
              >
                <div className={`p-6 rounded-2xl transition-all duration-300 ${
                  isDragging 
                    ? 'bg-gradient-to-br from-blue-200 to-indigo-200' 
                    : 'bg-gradient-to-br from-blue-100 to-indigo-100'
                }`}>
                  <Upload className={`w-16 h-16 transition-colors duration-300 ${
                    isDragging ? 'text-[#0066FF]' : 'text-gray-400'
                  }`} />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {isDragging ? 'Drop your images here' : 'Drag & drop images here'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    or click below to browse files
                  </p>
                </div>

                <label className="cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <span className="inline-flex items-center gap-2 px-6 py-3 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105">
                    <ImageIcon className="w-5 h-5" />
                    Browse Files
                  </span>
                </label>

                <p className="text-sm text-gray-500 mt-4">
                  Supports: JPG, PNG, WebP • Max size: 10MB per file
                </p>
              </motion.div>
            </div>
          </div>

          {/* Image Preview Grid */}
          {images.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Grid3x3 className="w-5 h-5 text-[#0066FF]" />
                  Selected Images ({images.length})
                </h2>
                <button
                  onClick={() => setImages([])}
                  className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {images.map((image) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      layout
                      className="relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-[#0066FF] transition-all duration-300 hover:shadow-lg"
                    >
                      {/* Image Preview */}
                      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                        <img
                          src={image.preview}
                          alt={image.title}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => removeImage(image.id)}
                          disabled={image.status === 'uploading'}
                          className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        {/* Status Badge */}
                        <div className="absolute bottom-2 left-2">
                          {image.status === 'uploading' && (
                            <div className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full flex items-center gap-2">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Uploading...
                            </div>
                          )}
                          {image.status === 'success' && (
                            <div className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-2">
                              <Check className="w-3 h-3" />
                              Uploaded
                            </div>
                          )}
                          {image.status === 'error' && (
                            <div className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center gap-2">
                              <AlertCircle className="w-3 h-3" />
                              Failed
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {image.status === 'uploading' && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${image.progress}%` }}
                            className="h-full bg-[#0066FF]"
                          />
                        </div>
                      )}

                      {/* Image Info */}
                      <div className="p-4 space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                            Title / Caption
                          </label>
                          <input
                            type="text"
                            value={image.title}
                            onChange={(e) => updateImage(image.id, { title: e.target.value })}
                            disabled={image.status !== 'pending'}
                            placeholder="Photo title"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200 disabled:bg-gray-100"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                            Description
                          </label>
                          <textarea
                            value={image.description}
                            onChange={(e) => updateImage(image.id, { description: e.target.value })}
                            disabled={image.status !== 'pending'}
                            rows={2}
                            placeholder="Brief description (optional)"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200 disabled:bg-gray-100"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                            Tags
                          </label>
                          <input
                            type="text"
                            value={image.tags.join(', ')}
                            onChange={(e) => handleTagsChange(image.id, e.target.value)}
                            disabled={image.status !== 'pending'}
                            placeholder="event, team, 2026"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200 disabled:bg-gray-100"
                          />
                          <p className="mt-1 text-xs text-gray-500 font-medium">Comma separated</p>
                        </div>

                        <div className="text-xs text-gray-500 font-medium">
                          {image.width} × {image.height} px
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </motion.div>

        {/* Right Column - Metadata */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Upload Action */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Upload</h2>
            <div className="space-y-3">
              <button
                onClick={handleUploadAll}
                disabled={uploading || images.length === 0 || images.every(img => img.status !== 'pending')}
                className="w-full px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-300"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Upload All ({images.filter(img => img.status === 'pending').length})
                  </>
                )}
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-500 text-center">
              All images will use metadata below
            </p>
          </div>

          {/* Default Settings */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Category
                </label>
                <SimpleSelect
                  value={defaultMetadata.category}
                  onChange={(value) => setDefaultMetadata(prev => ({ ...prev, category: value }))}
                  options={categories}
                  placeholder="Select category"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Related Event
                </label>
                <SimpleSelect
                  value={defaultMetadata.event_id}
                  onChange={(value) => setDefaultMetadata(prev => ({ ...prev, event_id: value }))}
                  options={events}
                  placeholder="Select event"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  <User className="w-3 h-3" />
                  Photographer
                </label>
                <input
                  type="text"
                  value={defaultMetadata.photographer}
                  onChange={(e) => setDefaultMetadata(prev => ({ ...prev, photographer: e.target.value }))}
                  placeholder="Photographer name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  <Calendar className="w-3 h-3" />
                  Captured Date
                </label>
                <input
                  type="date"
                  value={defaultMetadata.captured_at}
                  onChange={(e) => setDefaultMetadata(prev => ({ ...prev, captured_at: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Upload Tips */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#0066FF]" />
              Upload Tips
            </h3>
            <ul className="space-y-2 text-xs text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[#0066FF] font-bold">•</span>
                <span>Use high-quality images (1920×1080+)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0066FF] font-bold">•</span>
                <span>Supported: JPG, PNG, WebP</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0066FF] font-bold">•</span>
                <span>Keep files under 10MB</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0066FF] font-bold">•</span>
                <span>Upload multiple images at once</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0066FF] font-bold">•</span>
                <span>Each image can have unique data</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}