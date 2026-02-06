// app/admin/articles/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
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

import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  Filter,
  FileText,
  Calendar,
  User,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Star
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
  'lainnya'
];

const STATUSES = ['draft', 'published'];

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/articles', {
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to fetch articles');
      }

      const data = await response.json();
      if (data.data) {
        setArticles(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      toast.error('Gagal memuat artikel');
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
        throw new Error('Failed to delete article');
      }

      const data = await response.json();
      toast.success('Artikel berhasil dihapus');
      fetchArticles();
    } catch (error) {
      console.error('Failed to delete article:', error);
      toast.error('Gagal menghapus artikel');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      published: 'bg-green-100 text-green-700 border-green-200',
      draft: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return styles[status] || styles.draft;
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
      article.slug.toLowerCase().includes(search.toLowerCase());
    
    const matchStatus = statusFilter === 'all' || article.status === statusFilter;
    const matchCategory = categoryFilter === 'all' || article.category === categoryFilter;

    return matchSearch && matchStatus && matchCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, categoryFilter]);

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
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Articles</h1>
          <p className="mt-1 text-base text-gray-600">Manage and organize your blog articles</p>
        </div>
        <Link href="/admin/articles/create">
          <Button className="flex items-center gap-2 bg-gradient-to-r from-[#0066FF] to-[#0052CC] hover:shadow-lg text-white transition-all duration-300">
            <Plus className="w-4 h-4" />
            New Article
          </Button>
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { label: 'Total Articles', value: stats.total, icon: FileText, color: 'text-[#0066FF]', bg: 'bg-blue-50' },
          { label: 'Published', value: stats.published, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Draft', value: stats.draft, icon: Edit, color: 'text-gray-600', bg: 'bg-gray-50' },
          { label: 'Featured', value: stats.featured, icon: Star, color: 'text-orange-600', bg: 'bg-orange-50' }
        ].map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
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

      {/* Filters */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search articles by title or content..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-[#0066FF] focus:ring-[#0066FF]"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="w-full lg:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-gray-300 focus:border-[#0066FF] focus:ring-[#0066FF]">
                    <Filter className="w-4 h-4 mr-2 text-gray-400" />
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="w-full lg:w-48">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="border-gray-300 focus:border-[#0066FF] focus:ring-[#0066FF]">
                    <Filter className="w-4 h-4 mr-2 text-gray-400" />
                    <SelectValue placeholder="All Categories" />
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
        <Card className="border-gray-200 overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-4">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-[#0066FF] border-t-transparent animate-spin"></div>
                  </div>
                  <p className="text-sm font-semibold text-gray-600">Loading articles...</p>
                </div>
              </div>
            ) : paginatedArticles.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <FileText className="w-10 h-10 text-[#0066FF]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600 mb-6">
                  {search || statusFilter !== 'all' || categoryFilter !== 'all' 
                    ? 'Try adjusting your filters' 
                    : 'Get started by creating your first article'}
                </p>
                {!search && statusFilter === 'all' && categoryFilter === 'all' && (
                  <Link href="/admin/articles/create">
                    <Button className="bg-gradient-to-r from-[#0066FF] to-[#0052CC] hover:shadow-lg text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Article
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
                        Featured
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Published
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
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border",
                            getStatusBadge(article.status)
                          )}>
                            {article.status?.charAt(0).toUpperCase() + article.status?.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {article.featured ? (
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                              <span className="text-xs font-semibold text-orange-600">Yes</span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">No</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{formatDate(article.published_at)}</span>
                          </div>
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
                                  href={`/admin/articles/edit/${article.id}`}
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  <Edit className="w-4 h-4" />
                                  <span>Edit Article</span>
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
            <span className="font-bold text-gray-900">{Math.min(endIndex, filteredArticles.length)}</span> of{' '}
            <span className="font-bold text-gray-900">{filteredArticles.length}</span> results
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
    </div>
  );
}