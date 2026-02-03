// app/admin/gallery/page.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Filter,
  Trash2,
  Eye,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Check,
  Plus,
  Loader2,
  Camera,
  Tag,
  Calendar,
  Maximize2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// ============================================================================
// MOTION VARIANTS — copied verbatim from users/page.js
// ============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// ============================================================================
// LIGHTBOX MODAL
// Keyboard-trapped: Escape closes. Prev / Next arrows navigate siblings.
// Renders image_url (full-res) — thumbnail_url is only for the grid.
// All displayed fields map 1-to-1 to the gallery Prisma model.
// ============================================================================

function Lightbox({ photo, photos, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(
    () => photos.findIndex((p) => p.id === photo.id)
  );
  const current = photos[currentIndex];

  // ── keyboard nav ────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrentIndex((i) => Math.max(0, i - 1));
      if (e.key === 'ArrowRight') setCurrentIndex((i) => Math.min(photos.length - 1, i + 1));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, photos.length]);

  // ── parsed tags (Json field — may be array or null) ─────────────────────
  const tags = Array.isArray(current.tags) ? current.tags : [];

  return (
    <AnimatePresence>
      {/* backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[40] bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* panel */}
      <motion.div
        key="panel"
        initial={{ opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.93 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[50] flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-w-5xl max-h-full flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* ── top bar ─────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 flex-shrink-0">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {currentIndex + 1} / {photos.length}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-150"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* ── image + prev/next ───────────────────────────────────────── */}
          <div className="relative flex-1 flex items-center justify-center bg-gray-950 overflow-hidden" style={{ minHeight: 320 }}>
            <img
              key={current.id}
              src={current.image_url}
              alt={current.title}
              className="max-w-full max-h-[62vh] object-contain"
            />

            {/* prev */}
            {currentIndex > 0 && (
              <button
                onClick={() => setCurrentIndex((i) => i - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow transition-all duration-150"
              >
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>
            )}
            {/* next */}
            {currentIndex < photos.length - 1 && (
              <button
                onClick={() => setCurrentIndex((i) => i + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow transition-all duration-150"
              >
                <ChevronRight className="w-5 h-5 text-gray-800" />
              </button>
            )}

            {/* featured star overlay */}
            {current.featured && (
              <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-amber-500/90 rounded-full">
                <Star className="w-3.5 h-3.5 text-white fill-white" />
                <span className="text-xs font-bold text-white">Unggulan</span>
              </div>
            )}
          </div>

          {/* ── meta strip ──────────────────────────────────────────────── */}
          <div className="flex-shrink-0 px-5 py-4 border-t border-gray-200 bg-white">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-gray-900 truncate">{current.title}</h3>
                {current.description && (
                  <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{current.description}</p>
                )}
              </div>

              {/* dimension badge */}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-600 flex-shrink-0">
                <Maximize2 className="w-3 h-3" />
                {current.width}×{current.height}
              </span>
            </div>

            {/* row of small pills */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
              {current.photographer && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Camera className="w-3.5 h-3.5" />
                  <span>{current.photographer}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {new Date(current.captured_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700">
                <Tag className="w-3 h-3" />
                {current.category}
              </span>
              {current.event_id && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-700">
                  Event linked
                </span>
              )}
            </div>

            {/* tags row */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex px-2.5 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================================================
// BULK ACTION BAR
// Slides in from the top when ≥ 1 checkbox is selected.
// Mirrors the sticky-style action bar pattern common in admin panels.
// ============================================================================

function BulkActionBar({ selectedCount, onSelectAll, onClear, onDeleteSelected, totalCount }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-[10] bg-white/95 backdrop-blur border border-[#0066FF] rounded-xl shadow-lg px-5 py-3 flex items-center justify-between flex-wrap gap-3"
    >
      <div className="flex items-center gap-3">
        {/* master checkbox */}
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={selectedCount === totalCount && totalCount > 0}
            onChange={onSelectAll}
            className="sr-only peer"
          />
          <div className={cn(
            'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-150',
            selectedCount === totalCount && totalCount > 0
              ? 'bg-[#0066FF] border-[#0066FF]'
              : selectedCount > 0
              ? 'bg-[#0066FF]/20 border-[#0066FF]'
              : 'border-gray-300'
          )}>
            {selectedCount === totalCount && totalCount > 0 ? (
              <Check className="w-3 h-3 text-white" />
            ) : selectedCount > 0 ? (
              <span className="w-2.5 h-0.5 bg-[#0066FF] rounded-sm" />
            ) : null}
          </div>
        </label>

        <span className="text-sm font-semibold text-gray-900">
          <span className="text-[#0066FF]">{selectedCount}</span> foto dipilih
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onClear}
          className="px-3 py-1.5 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
        >
          Batalkan
        </button>
        <button
          onClick={onDeleteSelected}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow transition-all duration-200"
        >
          <Trash2 className="w-4 h-4" />
          Hapus {selectedCount} Foto
        </button>
      </div>
    </motion.div>
  );
}

// ============================================================================
// BULK-DELETE CONFIRMATION DIALOG
// Layout & copy mirrors the AlertDialog inside users/page.js exactly:
// red icon circle → bold title → description with item list → footer buttons.
// ============================================================================

function BulkDeleteDialog({ count, onCancel, onConfirm, loading }) {
  // Escape-to-close
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onCancel]);

  return (
    <>
      {/* backdrop */}
      <div className="fixed inset-0 z-[40] bg-black/50 backdrop-blur-sm" onClick={onCancel} />

      {/* dialog */}
      <div className="fixed inset-0 z-[50] flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            {/* icon + title row */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Hapus Foto Pilihan</h2>
            </div>

            {/* body */}
            <p className="text-base text-gray-600 leading-relaxed">
              Anda akan menghapus <span className="font-semibold text-gray-900">{count} foto</span> secara permanen.
              Tindakan ini tidak dapat dibatalkan dan akan menghapus:
            </p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside text-sm text-gray-600">
              <li>Semua file foto dan thumbnail</li>
              <li>Metadata, tag, dan keterangan foto</li>
              <li>Relasi ke event (jika ada)</li>
            </ul>
          </div>

          {/* footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-150"
            >
              Batalkan
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {loading ? 'Menghapus…' : `Ya, Hapus ${count} Foto`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================================
// SINGLE-DELETE CONFIRMATION (same pattern, lighter copy)
// ============================================================================

function SingleDeleteDialog({ photo, onCancel, onConfirm, loading }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onCancel]);

  return (
    <>
      <div className="fixed inset-0 z-[40] bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="fixed inset-0 z-[50] flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Hapus Foto</h2>
            </div>
            <p className="text-base text-gray-600 leading-relaxed">
              Hapus <span className="font-semibold text-gray-900">"{photo?.title}"</span> secara permanen?
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-150"
            >
              Batalkan
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {loading ? 'Menghapus…' : 'Ya, Hapus'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================================
// PHOTO CARD
// layout + layoutId for Framer Motion smooth reflow on grid changes.
// Checkbox lives in the top-left corner and is always visible when any item
// in the entire grid is already selected — otherwise it only appears on hover.
// Hover overlay brings up View (Eye) and Delete (Trash2) action buttons.
// Featured star badge is absolutely positioned just like the email_verified
// green dot on the user avatar in users/page.js.
// ============================================================================

function PhotoCard({ photo, isSelected, anySelected, onSelect, onView, onDelete }) {
  const tags = Array.isArray(photo.tags) ? photo.tags : [];

  return (
    <motion.div
      layout
      layoutId={photo.id}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-lg hover:border-[#0066FF] transition-all duration-300 cursor-pointer"
    >
      {/* ── thumbnail ───────────────────────────────────────────────── */}
      <div className="relative aspect-square overflow-hidden bg-gray-100" onClick={() => onView(photo)}>
        <img
          src={photo.thumbnail_url}
          alt={photo.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* ── featured star (absolute, top-right) ─────────────────── */}
        {photo.featured && (
          <div className="absolute top-2 right-2 z-[2] flex items-center gap-0.5 px-2 py-0.5 bg-amber-500/90 rounded-full shadow-sm">
            <Star className="w-3 h-3 text-white fill-white" />
            <span className="text-xs font-bold text-white">Featured</span>
          </div>
        )}

        {/* ── hover overlay with action buttons ───────────────────── */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-all duration-300 flex flex-col items-center justify-center gap-2">
          <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onView(photo); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 hover:bg-white text-gray-800 text-xs font-semibold rounded-lg shadow transition-all duration-150"
            >
              <Eye className="w-3.5 h-3.5" />
              Lihat
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(photo); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/95 hover:bg-red-600 text-white text-xs font-semibold rounded-lg shadow transition-all duration-150"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus
            </button>
          </div>
        </div>
      </div>

      {/* ── checkbox overlay (top-left, always visible when bulk mode active) */}
      <div
        className={cn(
          'absolute top-2 left-2 z-[3] transition-opacity duration-200',
          anySelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
        onClick={(e) => { e.stopPropagation(); onSelect(photo.id); }}
      >
        <div
          className={cn(
            'w-5.5 h-5.5 rounded-md border-2 flex items-center justify-center shadow-sm transition-colors duration-150 cursor-pointer',
            isSelected
              ? 'bg-[#0066FF] border-[#0066FF]'
              : 'bg-white/90 border-gray-300 hover:border-[#0066FF]'
          )}
        >
          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
        </div>
      </div>

      {/* ── title strip (bottom) ──────────────────────────────────── */}
      <div className="px-3 py-2.5 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-gray-900 truncate">{photo.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{photo.category}</p>
        </div>
        {tags.length > 0 && (
          <Tag className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// PAGE ROOT
// ============================================================================

export default function GalleryPage() {
  // ── data ──────────────────────────────────────────────────────────────────
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── filters ───────────────────────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all'); // all | featured | not-featured
  const [categories, setCategories] = useState([]);

  // ── pagination ────────────────────────────────────────────────────────────
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // ── selection (bulk) ──────────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState(new Set());

  // ── modals ────────────────────────────────────────────────────────────────
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);   // single photo
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // display_order: managed server-side (e.g. drag-sort endpoint) — not exposed here.

  // ── stats (derived from current page — backend should ideally send totals) ─
  const [stats, setStats] = useState({ total: 0, categories: 0, featured: 0, thisMonth: 0 });

  // ── fetch ─────────────────────────────────────────────────────────────────
  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: '24',
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(featuredFilter === 'featured' && { featured: 'true' }),
        ...(featuredFilter === 'not-featured' && { featured: 'false' }),
        ...(search && { search }),
      });

      const res = await fetch(`/api/admin/gallery?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();

      if (data.success) {
        setPhotos(data.photos);
        setPagination(data.pagination);

        // derive stats from current payload (replace with server stats if available)
        const uniqueCats = new Set(data.photos.map((p) => p.category));
        const featuredCount = data.photos.filter((p) => p.featured).length;
        const now = new Date();
        const thisMonthCount = data.photos.filter((p) => {
          const d = new Date(p.uploaded_at);
          return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        }).length;

        setStats({
          total: data.pagination.total || data.photos.length,
          categories: uniqueCats.size,
          featured: featuredCount,
          thisMonth: thisMonthCount,
        });

        // populate category filter options (dedupe)
        setCategories((prev) => {
          const merged = new Set([...prev, ...uniqueCats]);
          return Array.from(merged).sort();
        });
      }
    } catch {
      toast.error('Gagal memuat galeri');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, categoryFilter, featuredFilter, search]);

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  // ── selection helpers ─────────────────────────────────────────────────────
  const toggleSelect = (id) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const selectAll = () =>
    setSelectedIds(new Set(photos.map((p) => p.id)));

  const clearSelection = () => setSelectedIds(new Set());

  // ── single delete ─────────────────────────────────────────────────────────
  const handleSingleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/gallery/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Foto berhasil dihapus');
        setDeleteTarget(null);
        fetchPhotos();
      } else {
        toast.error(data.error || 'Hapus gagal');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── bulk delete ───────────────────────────────────────────────────────────
  const handleBulkDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch('/api/admin/gallery/bulk', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`${selectedIds.size} foto berhasil dihapus`);
        setBulkDeleteOpen(false);
        clearSelection();
        fetchPhotos();
      } else {
        toast.error(data.error || 'Hapus massal gagal');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── search submit ─────────────────────────────────────────────────────────
  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((p) => ({ ...p, page: 1 }));
    fetchPhotos();
  };

  // ── search debounce reset pagination ──────────────────────────────────────
  useEffect(() => { setPagination((p) => ({ ...p, page: 1 })); }, [search, categoryFilter, featuredFilter]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6 pb-8">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Galeri Foto</h1>
          <p className="mt-1 text-base text-gray-600">Kelola koleksi foto dan album</p>
        </div>
        <Link href="/admin/gallery/create">
          <Button className="flex items-center gap-2 bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-lg transition-all duration-300">
            <Upload className="w-4 h-4" />
            Upload Foto
          </Button>
        </Link>
      </motion.div>

      {/* ── Stats Cards ─────────────────────────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { label: 'Total Foto',   value: stats.total,      icon: ImageIcon, color: 'text-[#0066FF]',  bg: 'bg-blue-50' },
          { label: 'Kategori',     value: stats.categories, icon: Tag,       color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Unggulan',     value: stats.featured,   icon: Star,      color: 'text-amber-600',  bg: 'bg-amber-50' },
          { label: 'Bulan Ini',    value: stats.thisMonth,  icon: Calendar,  color: 'text-green-600',  bg: 'bg-green-50' },
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="border-gray-200 hover:border-[#0066FF] hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{stat.label}</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-11 h-11 ${stat.bg} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Search & Filter Bar ─────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card className="border-gray-200 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              {/* search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-300" />
                  <input
                    type="text"
                    placeholder="Cari judul atau photographer…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 text-gray-400 rounded-xl focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* category + featured filters + submit */}
              <div className="flex gap-3">
                {/* category filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => {
                      setCategoryFilter(e.target.value);
                      setPagination((p) => ({ ...p, page: 1 }));
                    }}
                    className="pl-9 pr-8 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066FF] focus:border-transparent appearance-none bg-white cursor-pointer transition-all duration-200"
                  >
                    <option value="all">Semua Kategori</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* featured filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={featuredFilter}
                    onChange={(e) => {
                      setFeaturedFilter(e.target.value);
                      setPagination((p) => ({ ...p, page: 1 }));
                    }}
                    className="pl-9 pr-8 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066FF] focus:border-transparent appearance-none bg-white cursor-pointer transition-all duration-200"
                  >
                    <option value="all">Semua Status</option>
                    <option value="featured">Unggulan</option>
                    <option value="not-featured">Biasa</option>
                  </select>
                </div>

                {/* search button */}
                <Button
                  type="submit"
                  className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-6 transition-colors shadow-lg duration-200"
                >
                  Cari
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Bulk Action Bar ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <BulkActionBar
            selectedCount={selectedIds.size}
            totalCount={photos.length}
            onSelectAll={selectAll}
            onClear={clearSelection}
            onDeleteSelected={() => setBulkDeleteOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* ── Photo Grid ──────────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card className="border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <CardContent className="p-4">
            {loading ? (
              /* ── double-ring spinner (articles pattern) ─── */
              <div className="flex flex-col items-center justify-center h-96 gap-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-[#0066FF] border-t-transparent animate-spin"></div>
                </div>
                <p className="text-sm font-semibold text-gray-600">Memuat galeri…</p>
              </div>
            ) : photos.length === 0 ? (
              /* ── empty state (articles pattern) ─── */
              <div className="flex flex-col items-center justify-center py-20 px-6">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                  <ImageIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Foto</h3>
                <p className="text-gray-600 text-center mb-6 max-w-sm">
                  {search || categoryFilter !== 'all' || featuredFilter !== 'all'
                    ? 'Coba ubah filter pencarian Anda.'
                    : 'Mulai upload foto pertama Anda.'}
                </p>
                {!search && categoryFilter === 'all' && featuredFilter === 'all' && (
                  <Link href="/admin/gallery/create">
                    <Button className="bg-[#0066FF] hover:bg-[#0052CC] shadow-lg text-white">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Foto Pertama
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              /* ── grid ─── */
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <AnimatePresence mode="popLayout">
                  {photos.map((photo) => (
                    <PhotoCard
                      key={photo.id}
                      photo={photo}
                      isSelected={selectedIds.has(photo.id)}
                      anySelected={selectedIds.size > 0}
                      onSelect={toggleSelect}
                      onView={setLightboxPhoto}
                      onDelete={setDeleteTarget}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Pagination ──────────────────────────────────────────────────────── */}
      {pagination.totalPages > 1 && (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between"
        >
          <div className="text-sm text-gray-700 font-medium">
            Halaman <span className="font-bold text-gray-900">{pagination.page}</span> dari{' '}
            <span className="font-bold text-gray-900">{pagination.totalPages}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              disabled={pagination.page === 1}
              className="flex items-center gap-2 border-gray-300 hover:border-[#0066FF] hover:text-[#0066FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              className="flex items-center gap-2 border-gray-300 hover:border-[#0066FF] hover:text-[#0066FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Berikutnya
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          MODALS
          ════════════════════════════════════════════════════════════════════════ */}

      {/* Lightbox */}
      {lightboxPhoto && (
        <Lightbox
          photo={lightboxPhoto}
          photos={photos}
          onClose={() => setLightboxPhoto(null)}
        />
      )}

      {/* Single-delete confirmation */}
      {deleteTarget && (
        <SingleDeleteDialog
          photo={deleteTarget}
          loading={deleteLoading}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleSingleDelete}
        />
      )}

      {/* Bulk-delete confirmation */}
      {bulkDeleteOpen && (
        <BulkDeleteDialog
          count={selectedIds.size}
          loading={deleteLoading}
          onCancel={() => setBulkDeleteOpen(false)}
          onConfirm={handleBulkDelete}
        />
      )}
    </div>
  );
}