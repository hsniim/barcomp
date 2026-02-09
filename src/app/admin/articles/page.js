// app/admin/articles/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  FileText,
  Calendar,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Star,
  StarOff,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  'teknologi',
  'kesehatan',
  'finansial',
  'bisnis',
  'inovasi',
  'karir',
  'keberlanjutan',
  'lainnya'
];

const STATUSES = ['draft', 'published'];

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/articles', {
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
      
      // Handle both response formats (array langsung atau object dengan data property)
      if (Array.isArray(data)) {
        console.log('✅ Fetched articles (array format):', data.length);
        setArticles(data);
      } else if (data.success && data.data && Array.isArray(data.data)) {
        console.log('✅ Fetched articles (object format):', data.data.length);
        setArticles(data.data);
      } else if (data.data && Array.isArray(data.data)) {
        console.log('✅ Fetched articles (object format without success flag):', data.data.length);
        setArticles(data.data);
      } else {
        console.warn('⚠️ Unexpected response format:', data);
        setArticles([]);
      }
    } catch (error) {
      console.error('❌ Failed to fetch articles:', error);
      toast.error('Gagal memuat artikel. Silakan coba lagi.');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus "${title}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/articles/${id}`, {
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
        throw new Error(errData.error || 'Gagal menghapus artikel');
      }

      const data = await response.json();
      toast.success('Artikel berhasil dihapus');
      fetchArticles();
    } catch (error) {
      console.error('Failed to delete article:', error);
      toast.error(error.message || 'Gagal menghapus artikel. Silakan coba lagi.');
    }
  };

  const toggleFeatured = async (id, currentFeatured) => {
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ featured: !currentFeatured })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Artikel ${!currentFeatured ? 'ditandai unggulan' : 'dihapus dari unggulan'}`);
        fetchArticles();
      } else {
        toast.error(data.error || 'Gagal mengubah status unggulan');
      }
    } catch (error) {
      console.error('Failed to toggle featured:', error);
      toast.error('Gagal mengubah status unggulan');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      published: 'bg-green-100 text-green-700 border-green-200',
      draft: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return styles[status] || styles.draft;
  };

  const getCategoryBadge = (category) => {
    const styles = {
      teknologi: 'bg-blue-100 text-blue-700 border-blue-200',
      kesehatan: 'bg-green-100 text-green-700 border-green-200',
      finansial: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      bisnis: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      inovasi: 'bg-purple-100 text-purple-700 border-purple-200',
      karir: 'bg-orange-100 text-orange-700 border-orange-200',
      keberlanjutan: 'bg-teal-100 text-teal-700 border-teal-200',
      lainnya: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return styles[category] || styles.lainnya;
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

  // Filter articles
  const filteredArticles = articles.filter(article => {
    const matchSearch = search === '' || 
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.slug.toLowerCase().includes(search.toLowerCase()) ||
      (article.excerpt && article.excerpt.toLowerCase().includes(search.toLowerCase()));
    
    const matchStatus = statusFilter === '' || article.status === statusFilter;
    const matchCategory = categoryFilter === '' || article.category === categoryFilter;

    return matchSearch && matchStatus && matchCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    total: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    draft: articles.filter(a => a.status === 'draft').length,
    featured: articles.filter(a => a.featured).length
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
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Articles
          </h1>
          <p className="text-gray-600 mt-2 text-base">
            Create, manage, and publish your articles
          </p>
        </div>
        <Link href="/admin/articles/create">
          <Button className="bg-gradient-to-r from-[#0066FF] to-[#0052CC] text-white hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 px-6 py-5 text-base font-bold">
            <Plus className="w-5 h-5 mr-2" />
            Create New Article
          </Button>
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={itemVariants}>
          <Card className="border-2 border-gray-200 hover:border-[#0066FF] transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Articles</p>
                  <p className="text-4xl font-black text-gray-900 mt-2">{stats.total}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-4 rounded-2xl">
                  <FileText className="w-8 h-8 text-[#0066FF]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-2 border-gray-200 hover:border-green-500 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Published</p>
                  <p className="text-4xl font-black text-gray-900 mt-2">{stats.published}</p>
                </div>
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-2xl">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-2 border-gray-200 hover:border-gray-500 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Draft</p>
                  <p className="text-4xl font-black text-gray-900 mt-2">{stats.draft}</p>
                </div>
                <div className="bg-gradient-to-br from-gray-100 to-slate-100 p-4 rounded-2xl">
                  <Edit className="w-8 h-8 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-2 border-gray-200 hover:border-orange-500 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Featured</p>
                  <p className="text-4xl font-black text-gray-900 mt-2">{stats.featured}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-4 rounded-2xl">
                  <Star className="w-8 h-8 text-orange-600" />
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
        <Card className="border-2 border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search articles by title, slug, or excerpt..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 h-12 border-2 border-gray-200 focus:border-[#0066FF] focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-base"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-[#0066FF] focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white text-gray-700 font-medium cursor-pointer"
                >
                  <option value="">All Status</option>
                  {STATUSES.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-[#0066FF] focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white text-gray-700 font-medium cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Articles Table */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-2 border-gray-200 shadow-lg">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 px-4">
                <Loader2 className="w-12 h-12 text-[#0066FF] animate-spin" />
                <p className="text-gray-600 mt-6 text-lg font-semibold">Loading articles...</p>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 px-4">
                <div className="bg-gradient-to-br from-gray-100 to-slate-100 p-8 rounded-3xl mb-6">
                  <FileText className="w-20 h-20 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {search || statusFilter || categoryFilter
                    ? 'No Articles Found' 
                    : 'No Articles Yet'}
                </h3>
                <p className="text-gray-600 text-center mb-8 max-w-md">
                  {search || statusFilter || categoryFilter
                    ? 'Try adjusting your search filters or create a new article.'
                    : 'Get started by creating your first article. Click the "Create New Article" button above.'}
                </p>
                {articles.length === 0 && (
                  <Link href="/admin/articles/create">
                    <Button className="bg-gradient-to-r from-[#0066FF] to-[#0052CC] text-white hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 px-6 py-3 text-base font-bold">
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Article
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Article
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Published
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Featured
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedArticles.map((article, index) => (
                      <motion.tr 
                        key={article.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-blue-50/50 transition-colors duration-200 group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {article.cover_image ? (
                              <img
                                src={article.cover_image}
                                alt={article.title}
                                className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200 group-hover:border-[#0066FF] transition-colors duration-200"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center border-2 border-gray-200 group-hover:border-[#0066FF] transition-colors duration-200">
                                <FileText className="w-7 h-7 text-[#0066FF]" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors duration-200 truncate">
                                {article.title}
                              </div>
                              <div className="text-xs text-gray-500 truncate mt-0.5">
                                {article.slug}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {article.category ? (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryBadge(article.category)} capitalize`}>
                              {article.category}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(article.status)} capitalize`}>
                            {article.status || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{formatDate(article.published_at)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleFeatured(article.id, article.featured)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              article.featured
                                ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                            title={article.featured ? 'Unfeatured' : 'Set as featured'}
                          >
                            {article.featured ? (
                              <Star className="w-5 h-5 fill-current" />
                            ) : (
                              <StarOff className="w-5 h-5" />
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-9 w-9 p-0 hover:bg-blue-100 hover:text-[#0066FF] transition-colors duration-200"
                              >
                                <MoreHorizontal className="w-5 h-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem asChild>
                                <Link 
                                  href={`/admin/articles/edit/${article.id}`}
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  <Edit className="w-4 h-4" />
                                  <span>Edit Article</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link 
                                  href={`/resources/articles/${article.slug}`}
                                  className="flex items-center gap-2 cursor-pointer"
                                  target="_blank"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span>View Article</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link 
                                  href={`/admin/articles/${article.id}/comments`}
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                  <span>Manage Comments</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(article.id, article.title)}
                                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                <span>Delete Article</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
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
          className="flex items-center justify-between"
        >
          <div className="text-sm text-gray-700 font-medium">
            Showing <span className="font-bold text-gray-900">{startIndex + 1}</span> to{' '}
            <span className="font-bold text-gray-900">
              {Math.min(startIndex + itemsPerPage, filteredArticles.length)}
            </span>{' '}
            of <span className="font-bold text-gray-900">{filteredArticles.length}</span> articles
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 border-gray-300 hover:border-[#0066FF] hover:bg-blue-50 hover:text-[#0066FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 border-gray-300 hover:border-[#0066FF] hover:bg-blue-50 hover:text-[#0066FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}