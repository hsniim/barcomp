// app/admin/articles/[id]/comments/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { 
  ArrowLeft, 
  Search, 
  Trash2, 
  MessageSquare,
  Calendar,
  Mail,
  User,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const STATUSES = ['pending', 'approved', 'spam'];

export default function ArticleCommentsPage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id;

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    if (articleId) {
      fetchArticleAndComments();
    }
  }, [articleId]);

  const fetchArticleAndComments = async () => {
    setLoading(true);
    try {
      // Fetch article detail
      const articleResponse = await fetch(`/api/articles/${articleId}`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store'
      });

      if (!articleResponse.ok) {
        if (articleResponse.status === 401) {
          toast.error('Sesi telah berakhir. Silakan login kembali.');
          router.push('/admin/login');
          return;
        }
        if (articleResponse.status === 404) {
          toast.error('Artikel tidak ditemukan.');
          router.push('/admin/articles');
          return;
        }
        throw new Error(`HTTP ${articleResponse.status}`);
      }

      const articleData = await articleResponse.json();
      setArticle(articleData.data);

      // Fetch comments for this article
      const commentsResponse = await fetch(`/api/comments?article_id=${articleId}`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store'
      });

      if (!commentsResponse.ok) {
        throw new Error(`HTTP ${commentsResponse.status}`);
      }

      const commentsData = await commentsResponse.json();
      setComments(commentsData.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Gagal memuat data. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (commentId, newStatus) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        let errData;
        try {
          errData = await response.json();
        } catch {
          errData = { error: `HTTP ${response.status}` };
        }
        throw new Error(errData.error || 'Gagal mengubah status komentar');
      }

      toast.success(`Komentar berhasil di${newStatus === 'approved' ? 'setujui' : newStatus === 'spam' ? 'tandai sebagai spam' : 'ubah'}`);
      fetchArticleAndComments();
    } catch (error) {
      console.error('Failed to update comment status:', error);
      toast.error(error.message || 'Gagal mengubah status komentar. Silakan coba lagi.');
    }
  };

  const handleDeleteClick = (comment) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!commentToDelete) return;

    try {
      const response = await fetch(`/api/comments/${commentToDelete.id}`, {
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
        throw new Error(errData.error || 'Gagal menghapus komentar');
      }

      toast.success('Komentar berhasil dihapus');
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
      fetchArticleAndComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast.error(error.message || 'Gagal menghapus komentar. Silakan coba lagi.');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      spam: 'bg-red-100 text-red-700 border-red-200'
    };
    return styles[status] || styles.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      approved: <CheckCircle className="w-4 h-4" />,
      pending: <Clock className="w-4 h-4" />,
      spam: <XCircle className="w-4 h-4" />
    };
    return icons[status] || icons.pending;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter comments
  const filteredComments = comments.filter(comment => {
    const matchSearch = search === '' || 
      comment.name.toLowerCase().includes(search.toLowerCase()) ||
      comment.email?.toLowerCase().includes(search.toLowerCase()) ||
      comment.content.toLowerCase().includes(search.toLowerCase());
    
    const matchStatus = statusFilter === 'all' || comment.status === statusFilter;

    return matchSearch && matchStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredComments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedComments = filteredComments.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const stats = {
    total: comments.length,
    approved: comments.filter(c => c.status === 'approved').length,
    pending: comments.filter(c => c.status === 'pending').length,
    spam: comments.filter(c => c.status === 'spam').length
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
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/admin/articles')}
            className="flex items-center gap-2 hover:bg-blue-50 hover:border-[#0066FF] hover:text-[#0066FF] transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-[#0066FF]" />
              Kelola Komentar
            </h1>
            {article && (
              <p className="text-sm text-gray-600 mt-1">
                Artikel: <span className="font-semibold text-gray-900">{article.title}</span>
              </p>
            )}
          </div>
        </div>
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
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Komentar</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-7 h-7 text-white" />
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
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Disetujui</p>
                  <p className="text-3xl font-bold text-green-700 mt-2">{stats.approved}</p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-2 border-gray-200 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Menunggu</p>
                  <p className="text-3xl font-bold text-yellow-700 mt-2">{stats.pending}</p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-2 border-gray-200 hover:border-red-400 transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Spam</p>
                  <p className="text-3xl font-bold text-red-700 mt-2">{stats.spam}</p>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-7 h-7 text-white" />
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
                  placeholder="Cari komentar berdasarkan nama, email, atau konten..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-11 border-2 border-gray-300 focus:border-[#0066FF] transition-colors duration-200"
                />
              </div>
              <div className="flex gap-3">
                <div className="w-full lg:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-11 border-2 border-gray-300 focus:border-[#0066FF]">
                      <Filter className="w-4 h-4 mr-2 text-gray-500" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="pending">Menunggu</SelectItem>
                      <SelectItem value="approved">Disetujui</SelectItem>
                      <SelectItem value="spam">Spam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Comments Table */}
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
                <p className="mt-6 text-gray-600 font-semibold">Memuat data komentar...</p>
              </div>
            ) : paginatedComments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-6">
                  <MessageSquare className="w-12 h-12 text-[#0066FF]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Komentar</h3>
                <p className="text-gray-600 text-center max-w-md">
                  {search || statusFilter !== 'all' 
                    ? 'Tidak ada komentar yang sesuai dengan filter Anda.'
                    : 'Artikel ini belum memiliki komentar dari pengunjung.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Pengirim
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Komentar
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedComments.map((comment, index) => (
                      <motion.tr 
                        key={comment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-blue-50/50 transition-colors duration-200 group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg border-2 border-gray-200 group-hover:border-[#0066FF] transition-colors duration-200">
                              {comment.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors duration-200">
                                {comment.name}
                              </div>
                              {comment.email && (
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                  <Mail className="w-3 h-3" />
                                  <span className="truncate">{comment.email}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700 line-clamp-2 max-w-md">
                            {comment.content}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border",
                            getStatusBadge(comment.status)
                          )}>
                            {getStatusIcon(comment.status)}
                            {comment.status?.charAt(0).toUpperCase() + comment.status?.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{formatDate(comment.created_at)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            {comment.status !== 'approved' && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(comment.id, 'approved')}
                                className="bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Setujui
                              </Button>
                            )}
                            {comment.status !== 'spam' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(comment.id, 'spam')}
                                className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors duration-200"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Spam
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteClick(comment)}
                              className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
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
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="text-sm text-gray-700 font-medium">
            Menampilkan <span className="font-bold text-gray-900">{startIndex + 1}</span> sampai{' '}
            <span className="font-bold text-gray-900">{Math.min(endIndex, filteredComments.length)}</span> dari{' '}
            <span className="font-bold text-gray-900">{filteredComments.length}</span> hasil
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 border-gray-300 hover:border-[#0066FF] hover:text-[#0066FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
              Sebelumnya
            </Button>
            <div className="hidden sm:flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-semibold text-gray-700">
              Halaman {currentPage} dari {totalPages}
            </div>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 border-gray-300 hover:border-[#0066FF] hover:text-[#0066FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Selanjutnya
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Komentar?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus komentar dari <span className="font-semibold text-gray-900">{commentToDelete?.name}</span>? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCommentToDelete(null)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Hapus Komentar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}