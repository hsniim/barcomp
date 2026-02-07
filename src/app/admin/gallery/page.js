// app/admin/gallery/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// Kita akan gunakan custom confirmation dialog sederhana karena alert-dialog component mungkin belum ada
// Atau bisa gunakan window.confirm sebagai fallback

import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  Filter,
  Image as ImageIcon,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Star,
  X,
  Maximize2
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  'teknologi',
  'kesehatan',
  'finansial',
  'bisnis',
  'inovasi',
  'karir',
  'keberlanjutan',
  'lainnya',
  'kantor',
  'acara'
];

export default function GalleryPage() {
  const router = useRouter();
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/gallery', {
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
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.data) {
        setGallery(data.data);
      } else {
        setGallery([]);
      }
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
      toast.error('Gagal memuat galeri. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (photo) => {
    if (!window.confirm(`Are you sure you want to delete "${photo.title}"? This action cannot be undone.`)) {
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/gallery/${photo.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        let errData;
        try {
          errData = await response.json();
        } catch {
          errData = { error: `HTTP ${response.status}` };
        }
        throw new Error(errData.error || 'Gagal menghapus foto');
      }

      toast.success('Foto berhasil dihapus');
      fetchGallery();
    } catch (error) {
      console.error('Failed to delete photo:', error);
      toast.error(error.message || 'Gagal menghapus foto. Silakan coba lagi.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Filter gallery
  const filteredGallery = gallery.filter(photo => {
    const matchSearch = search === '' || 
      photo.title.toLowerCase().includes(search.toLowerCase()) ||
      (photo.description && photo.description.toLowerCase().includes(search.toLowerCase()));
    
    const matchCategory = categoryFilter === 'all' || photo.category === categoryFilter;
    const matchFeatured = featuredFilter === 'all' || 
      (featuredFilter === 'featured' && photo.featured) ||
      (featuredFilter === 'not-featured' && !photo.featured);

    return matchSearch && matchCategory && matchFeatured;
  });

  // Pagination
  const totalPages = Math.ceil(filteredGallery.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGallery = filteredGallery.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, featuredFilter]);

  const stats = {
    total: gallery.length,
    featured: gallery.filter(p => p.featured).length,
    byCategory: CATEGORIES.reduce((acc, cat) => {
      acc[cat] = gallery.filter(p => p.category === cat).length;
      return acc;
    }, {})
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-[#0066FF]" />
            Gallery Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your photo gallery
          </p>
        </div>
        <Link href="/admin/gallery/create">
          <Button className="bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-lg transition-all duration-300">
            <Plus className="w-4 h-4 mr-2" />
            Upload New Photo
          </Button>
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants}>
          <Card className="border-2 border-gray-200 hover:border-[#0066FF] transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Photos</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <ImageIcon className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-2 border-gray-200 hover:border-orange-400 transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Featured</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">{stats.featured}</p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg">
                  <Star className="w-7 h-7 text-white fill-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-2 border-gray-200 hover:border-purple-400 transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Categories</p>
                  <p className="text-3xl font-bold text-purple-700 mt-2">{Object.keys(stats.byCategory).filter(k => stats.byCategory[k] > 0).length}</p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <Filter className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-2 border-gray-200 hover:border-green-400 transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">This Month</p>
                  <p className="text-3xl font-bold text-green-700 mt-2">
                    {gallery.filter(p => {
                      const created = new Date(p.created_at);
                      const now = new Date();
                      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-2 border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search photos by title or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-11 border-2 border-gray-300 focus:border-[#0066FF] transition-colors duration-200"
                />
              </div>
              <div className="flex gap-3">
                <div className="w-full lg:w-48">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-11 border-2 border-gray-300 focus:border-[#0066FF]">
                      <Filter className="w-4 h-4 mr-2 text-gray-500" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full lg:w-48">
                  <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
                    <SelectTrigger className="h-11 border-2 border-gray-300 focus:border-[#0066FF]">
                      <Star className="w-4 h-4 mr-2 text-gray-500" />
                      <SelectValue placeholder="Featured" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="not-featured">Not Featured</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Gallery Grid */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-2 border-gray-200 shadow-xl">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0066FF]"></div>
                <p className="mt-6 text-gray-600 font-semibold">Loading gallery...</p>
              </div>
            ) : paginatedGallery.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-6">
                  <ImageIcon className="w-12 h-12 text-[#0066FF]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Photos Yet</h3>
                <p className="text-gray-600 text-center max-w-md mb-6">
                  {search || categoryFilter !== 'all' || featuredFilter !== 'all' 
                    ? 'No photos match your filters. Try adjusting your search.'
                    : 'Start building your gallery by uploading your first photo.'}
                </p>
                {!search && categoryFilter === 'all' && featuredFilter === 'all' && (
                  <Link href="/admin/gallery/create">
                    <Button className="bg-[#0066FF] hover:bg-[#0052CC] shadow-lg text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Upload First Photo
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  <AnimatePresence mode="popLayout">
                    {paginatedGallery.map((photo, index) => (
                      <motion.div
                        key={photo.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.03 }}
                        className="group relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-[#0066FF] transition-all duration-300 hover:shadow-xl cursor-pointer"
                        onClick={() => setLightboxPhoto(photo)}
                      >
                        {/* Image */}
                        <img
                          src={photo.thumbnail_url || photo.image_url}
                          alt={photo.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="text-white font-bold text-sm truncate">{photo.title}</p>
                            {photo.category && (
                              <span className="inline-block mt-1 px-2 py-0.5 bg-blue-500 text-white text-xs font-semibold rounded">
                                {photo.category}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Featured badge */}
                        {photo.featured && (
                          <div className="absolute top-2 right-2 bg-orange-500 rounded-full p-1.5 shadow-lg">
                            <Star className="w-3 h-3 text-white fill-white" />
                          </div>
                        )}

                        {/* Actions button */}
                        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-40">
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLightboxPhoto(photo);
                                }}
                                className="cursor-pointer"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link 
                                  href={`/admin/gallery/edit/${photo.id}`}
                                  className="flex items-center cursor-pointer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(photo);
                                }}
                                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="text-sm text-gray-700 font-medium">
            Showing <span className="font-bold text-gray-900">{startIndex + 1}</span> to{' '}
            <span className="font-bold text-gray-900">{Math.min(endIndex, filteredGallery.length)}</span> of{' '}
            <span className="font-bold text-gray-900">{filteredGallery.length}</span> photos
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 border-gray-300 hover:border-[#0066FF] hover:text-[#0066FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <div className="hidden sm:flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-semibold text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 border-gray-300 hover:border-[#0066FF] hover:text-[#0066FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">{lightboxPhoto.title}</h3>
              <button
                onClick={() => setLightboxPhoto(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image */}
            <div className="relative bg-gray-950 flex items-center justify-center" style={{ maxHeight: '60vh' }}>
              <img
                src={lightboxPhoto.image_url}
                alt={lightboxPhoto.title}
                className="max-w-full max-h-[60vh] object-contain"
              />
              {lightboxPhoto.featured && (
                <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 bg-orange-500 rounded-full">
                  <Star className="w-4 h-4 text-white fill-white" />
                  <span className="text-xs font-bold text-white">Featured</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="px-6 py-4 border-t border-gray-200">
              {lightboxPhoto.description && (
                <p className="text-sm text-gray-600 mb-3">{lightboxPhoto.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-3">
                {lightboxPhoto.category && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200">
                    {lightboxPhoto.category.charAt(0).toUpperCase() + lightboxPhoto.category.slice(1)}
                  </span>
                )}
                {lightboxPhoto.captured_at && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(lightboxPhoto.captured_at)}</span>
                  </div>
                )}
                {lightboxPhoto.tags && lightboxPhoto.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {lightboxPhoto.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete menggunakan window.confirm - sederhana dan tidak perlu component tambahan */}
    </div>
  );
}