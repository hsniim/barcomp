// app/admin/events/edit/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Save, Eye, Loader2, AlertCircle, Upload, 
  X, Image as ImageIcon, Check, ChevronDown, Calendar,
  MapPin, Clock
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

function validateEvent(data) {
  const errors = {};
  const now = new Date();
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);

  // Required fields
  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (data.title.length > 255) {
    errors.title = 'Title must be less than 255 characters';
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.description = 'Description is required';
  } else if (data.description.length < 50) {
    errors.description = 'Description must be at least 50 characters';
  }

  if (!data.cover_image || data.cover_image.trim().length === 0) {
    errors.cover_image = 'Cover image is required';
  }

  if (!data.event_type || data.event_type === '') {
    errors.event_type = 'Event type is required';
  }

  if (!data.location_type || data.location_type === '') {
    errors.location_type = 'Location type is required';
  }

  // Date validations
  if (!data.start_date) {
    errors.start_date = 'Start date is required';
  }

  if (!data.end_date) {
    errors.end_date = 'End date is required';
  } else if (endDate <= startDate) {
    errors.end_date = 'End date must be after start date';
  }

  // Location validation
  if (data.location_type === 'onsite' || data.location_type === 'hybrid') {
    if (!data.location_venue || data.location_venue.trim().length === 0) {
      errors.location_venue = 'Venue is required for onsite/hybrid events';
    }
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
      formData.append('type', 'event'); // untuk disimpan di /public/uploads/events

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

      // data.path berisi "/uploads/events/uuid-filename.jpg"
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
          <div className="flex flex-col items-center gap-3">
            {uploading ? (
              <>
                <Loader2 className="w-12 h-12 text-[#0066FF] animate-spin" />
                <p className="text-sm font-semibold text-gray-700">Uploading...</p>
              </>
            ) : (
              <>
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-[#0066FF]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Drop image here or <span className="text-[#0066FF]">browse</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
                </div>
              </>
            )}
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

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200 flex items-center justify-between"
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors duration-150 ${
                value === option.value ? 'bg-blue-100 text-[#0066FF] font-semibold' : 'text-gray-900'
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

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    cover_image: '',
    event_type: '',
    location_type: '',
    location_venue: '',
    start_date: '',
    end_date: '',
    tags: [],
    featured: false,
    status: 'upcoming'
  });

  const eventTypes = [
    { value: 'workshop', label: 'Workshop' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'webinar', label: 'Webinar' }
  ];

  const locationTypes = [
    { value: 'online', label: 'Online' },
    { value: 'onsite', label: 'Onsite' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  const statusOptions = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' }
  ];

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const formatDateForInput = (isoString) => {
    if (!isoString) return '';
    // Convert to local datetime-local format: YYYY-MM-DDTHH:mm
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store'
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Sesi telah berakhir. Silakan login kembali.');
          router.push('/admin/login');
          return;
        }
        if (response.status === 404) {
          toast.error('Event tidak ditemukan.');
          router.push('/admin/events');
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      if (result.data) {
        const event = result.data;
        setFormData({
          title: event.title || '',
          slug: event.slug || '',
          description: event.description || '',
          cover_image: event.cover_image || '',
          event_type: event.event_type || '',
          location_type: event.location_type || '',
          location_venue: event.location_venue || '',
          start_date: formatDateForInput(event.start_date),
          end_date: formatDateForInput(event.end_date),
          tags: Array.isArray(event.tags) ? event.tags : [],
          featured: event.featured || false,
          status: event.status || 'upcoming'
        });
        setSlugManuallyEdited(true); // Existing event has slug
      } else {
        toast.error('Data event tidak valid.');
        router.push('/admin/events');
      }
    } catch (error) {
      console.error('Failed to fetch event:', error);
      toast.error('Gagal memuat data event. Silakan coba lagi.');
      router.push('/admin/events');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'title' && !slugManuallyEdited) {
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: generateSlug(value)
      }));
    } else if (name === 'slug') {
      setSlugManuallyEdited(true);
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags.includes(newTag) && formData.tags.length < 10) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
        setTagInput('');
      } else if (formData.tags.length >= 10) {
        toast.error('Maximum 10 tags allowed');
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
    const dataToSubmit = { ...formData, status };
    const validationErrors = validateEvent(dataToSubmit);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors before submitting');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(dataToSubmit)
      });

      if (!response.ok) {
        let errData;
        try {
          errData = await response.json();
        } catch {
          errData = { error: `HTTP ${response.status}` };
        }
        throw new Error(errData.error || 'Failed to update event');
      }

      const result = await response.json();
      toast.success('Event updated successfully');
      router.push('/admin/events');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.message || 'Failed to update event. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getCharCount = (text) => text ? text.length : 0;
  const getWordCount = (text) => text ? text.trim().split(/\s+/).filter(w => w).length : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0066FF]"></div>
        <p className="mt-6 text-gray-600 font-semibold">Loading event data...</p>
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
          <Link href="/admin/events">
            <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 hover:border-[#0066FF] hover:bg-blue-50 text-gray-700 hover:text-[#0066FF] rounded-lg font-semibold transition-all duration-300">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
            <p className="text-sm text-gray-600 mt-1">Update event information</p>
          </div>
        </div>
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
            <h2 className="text-lg font-bold text-gray-900 mb-4">Event Information</h2>
            <div className="space-y-4">
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
                  placeholder="Enter event title..."
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
                  placeholder="event-slug-url"
                  className={`w-full px-4 py-2 border rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200 ${
                    errors.slug ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.slug ? (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.slug}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500 font-medium">
                    {slugManuallyEdited ? 'Manually edited' : 'Auto-generated from title'}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <div className="text-xs font-semibold text-gray-600">
                    {getCharCount(formData.description)} chars • {getWordCount(formData.description)} words
                  </div>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={10}
                  placeholder="Write your event description here..."
                  className={`w-full px-4 py-2 border rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Date & Location */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Date & Location</h2>
            <div className="space-y-4">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="datetime-local"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg text-gray-900 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200 ${
                      errors.start_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.start_date && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.start_date}
                  </p>
                )}
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="datetime-local"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg text-gray-900 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200 ${
                      errors.end_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.end_date && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.end_date}
                  </p>
                )}
              </div>

              {/* Location Venue (conditional) */}
              {(formData.location_type === 'onsite' || formData.location_type === 'hybrid') && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                    Venue <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="location_venue"
                      value={formData.location_venue}
                      onChange={handleChange}
                      placeholder="e.g., Grand Ballroom, Ritz Carlton Jakarta"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200 ${
                        errors.location_venue ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.location_venue && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.location_venue}
                    </p>
                  )}
                </div>
              )}
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
                onClick={() => handleSubmit(formData.status)}
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
                    Update Event
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
              value={formData.cover_image}
              onChange={(url) => setFormData(prev => ({ ...prev, cover_image: url }))}
            />
            {errors.cover_image && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.cover_image}
              </p>
            )}
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Settings</h2>
            
            {/* Event Type */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                Event Type <span className="text-red-500">*</span>
              </label>
              <SimpleSelect
                value={formData.event_type}
                onChange={(value) => setFormData(prev => ({ ...prev, event_type: value }))}
                options={eventTypes}
                placeholder="Select event type"
              />
              {errors.event_type && (
                <p className="mt-1 text-sm text-red-600">{errors.event_type}</p>
              )}
            </div>

            {/* Location Type */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
                Location Type <span className="text-red-500">*</span>
              </label>
              <SimpleSelect
                value={formData.location_type}
                onChange={(value) => setFormData(prev => ({ ...prev, location_type: value }))}
                options={locationTypes}
                placeholder="Select location type"
              />
              {errors.location_type && (
                <p className="mt-1 text-sm text-red-600">{errors.location_type}</p>
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
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200">
              <div>
                <label className="text-sm font-semibold text-gray-700">Featured Event</label>
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