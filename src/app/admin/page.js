// app/admin/dashboard/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Calendar, 
  Image, 
  TrendingUp,
  Activity,
  Plus,
  ArrowUpRight,
  MessageSquare,
  UserCheck
} from 'lucide-react';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    articles: { total: 0, published: 0, draft: 0 },
    events: { total: 0, upcoming: 0, ongoing: 0 },
    gallery: { total: 0, featured: 0 },
    comments: { total: 0, pending: 0 },
    registrations: { total: 0 }
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });

      if (!response.ok) {
        router.push('/admin/login');
        return;
      }

      const data = await response.json();
      setUser(data.user);
      await fetchStats();
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/admin/login');
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch articles stats
      const articlesRes = await fetch('/api/articles', {
        credentials: 'include'
      });
      const articlesData = await articlesRes.json();
      
      // Fetch events stats
      const eventsRes = await fetch('/api/events', {
        credentials: 'include'
      });
      const eventsData = await eventsRes.json();
      
      // Fetch gallery stats
      const galleryRes = await fetch('/api/gallery', {
        credentials: 'include'
      });
      const galleryData = await galleryRes.json();

      // Fetch comments stats
      const commentsRes = await fetch('/api/comments', {
        credentials: 'include'
      });
      const commentsData = await commentsRes.json();

      // Calculate stats
      const articles = articlesData.data || [];
      const events = eventsData.data || [];
      const gallery = galleryData.data || [];
      const comments = commentsData.data || [];

      setStats({
        articles: {
          total: articles.length,
          published: articles.filter(a => a.status === 'published').length,
          draft: articles.filter(a => a.status === 'draft').length
        },
        events: {
          total: events.length,
          upcoming: events.filter(e => e.status === 'upcoming').length,
          ongoing: events.filter(e => e.status === 'ongoing').length
        },
        gallery: {
          total: gallery.filter(g => !g.deleted_at).length,
          featured: gallery.filter(g => g.featured && !g.deleted_at).length
        },
        comments: {
          total: comments.length,
          pending: comments.filter(c => c.status === 'pending').length
        },
        registrations: {
          total: 0 // Will be calculated if we have registrations endpoint
        }
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('Gagal memuat statistik');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Articles',
      value: stats.articles.total,
      subtitle: `${stats.articles.published} published, ${stats.articles.draft} draft`,
      icon: FileText,
      color: 'text-[#0066FF]',
      bgColor: 'bg-blue-50',
      borderColor: 'border-gray-200',
      trend: '+12%',
      trendUp: true,
      href: '/admin/articles'
    },
    {
      title: 'Total Events',
      value: stats.events.total,
      subtitle: `${stats.events.upcoming} upcoming, ${stats.events.ongoing} ongoing`,
      icon: Calendar,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-gray-200',
      trend: '+8%',
      trendUp: true,
      href: '/admin/events'
    },
    {
      title: 'Gallery Items',
      value: stats.gallery.total,
      subtitle: `${stats.gallery.featured} featured photos`,
      icon: Image,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-gray-200',
      trend: '+24%',
      trendUp: true,
      href: '/admin/gallery'
    },
    {
      title: 'Comments',
      value: stats.comments.total,
      subtitle: `${stats.comments.pending} pending approval`,
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-gray-200',
      trend: '+15%',
      trendUp: true,
      href: '/admin/articles'
    }
  ];

  const quickActions = [
    {
      title: 'Tulis Artikel',
      description: 'Buat artikel baru',
      icon: FileText,
      color: 'text-[#0066FF]',
      bgColor: 'bg-blue-50',
      hoverBg: 'hover:bg-blue-100',
      borderColor: 'border-gray-200',
      href: '/admin/articles/create'
    },
    {
      title: 'Tambah Event',
      description: 'Buat event baru',
      icon: Calendar,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      hoverBg: 'hover:bg-indigo-100',
      borderColor: 'border-gray-200',
      href: '/admin/events/create'
    },
    {
      title: 'Upload Foto',
      description: 'Tambah ke galeri',
      icon: Image,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverBg: 'hover:bg-purple-100',
      borderColor: 'border-gray-200',
      href: '/admin/gallery/create'
    },
    {
      title: 'Kelola Profil',
      description: 'Edit profil admin',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverBg: 'hover:bg-green-100',
      borderColor: 'border-gray-200',
      href: '/admin/profile'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-[#0066FF] border-t-transparent animate-spin"></div>
          </div>
          <p className="text-sm font-semibold text-gray-600">Loading dashboard...</p>
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
        className="space-y-1"
      >
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-base text-gray-600">
          Welcome back, {user?.full_name || 'Admin'}! Here's what's happening with your site.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {statCards.map((stat, index) => (
          <motion.a
            key={index}
            href={stat.href}
            variants={itemVariants}
            whileHover={{ 
              y: -8,
              transition: { duration: 0.2 }
            }}
            className="block"
          >
            <Card className="h-full border-gray-200 hover:border-[#0066FF] hover:shadow-xl transition-all duration-300 group overflow-hidden">
              <CardContent className="p-6 relative">
                {/* Glow effect on hover */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${stat.bgColor.replace('bg-', 'bg-opacity-100 bg-')}`} />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        {stat.title}
                      </p>
                      <p className="mt-3 text-4xl font-bold text-gray-900 tabular-nums">
                        {stat.value}
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        {stat.subtitle}
                      </p>
                      <div className="flex items-center gap-1 mt-3">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-600">
                          {stat.trend}
                        </span>
                        <span className="text-xs text-gray-500">vs last month</span>
                      </div>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.a>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-gray-200 hover:border-[#0066FF] hover:shadow-xl transition-all duration-300">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white pb-3 pt-4 px-6">
            <div className="flex items-center gap-3">
              <div className="inline-block px-3 py-1.5 bg-blue-100 rounded-full">
                <Activity className="w-3.5 h-3.5 text-[#0066FF] inline mr-1.5" />
                <span className="text-xs font-semibold text-[#0066FF]">Quick Access</span>
              </div>
              <CardTitle className="text-lg text-gray-900">Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action, index) => (
                <motion.a
                  key={index}
                  href={action.href}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex flex-col items-start p-4 border ${action.borderColor} rounded-xl hover:border-[#0066FF] ${action.bgColor} ${action.hoverBg} transition-all duration-300 group cursor-pointer hover:shadow-lg`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <Plus className="w-4 h-4 text-[#0066FF] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-[#0066FF] transition-colors duration-300">
                    {action.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{action.description}</p>
                </motion.a>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* System Status */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-gray-200 hover:border-green-500 hover:shadow-xl transition-all duration-300">
          <CardHeader className="border-b bg-gradient-to-r from-green-50 to-white pb-3 pt-4 px-6">
            <div className="flex items-center gap-3">
              <div className="inline-block px-3 py-1.5 bg-green-100 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block mr-1.5 animate-pulse"></div>
                <span className="text-xs font-semibold text-green-600">System Health</span>
              </div>
              <CardTitle className="text-lg text-gray-900">System Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:border-green-300 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base mb-0.5">All Systems Operational</p>
                  <p className="text-xs text-gray-600">Everything is running smoothly</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-600 mb-0.5">Last checked</p>
                <p className="text-xs text-green-600 font-bold">Just now</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pending Approvals */}
      {stats.comments.pending > 0 && (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="border-orange-200 hover:border-orange-500 hover:shadow-xl transition-all duration-300 bg-orange-50/30">
            <CardHeader className="border-b border-orange-200 bg-gradient-to-r from-orange-50 to-white pb-3 pt-4 px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="inline-block px-3 py-1.5 bg-orange-100 rounded-full">
                    <MessageSquare className="w-3.5 h-3.5 text-orange-600 inline mr-1.5" />
                    <span className="text-xs font-semibold text-orange-600">Needs Attention</span>
                  </div>
                  <CardTitle className="text-lg text-gray-900">Pending Approvals</CardTitle>
                </div>
                <a 
                  href="/admin/articles" 
                  className="text-xs font-semibold text-[#0066FF] hover:text-[#0052CC] flex items-center gap-1 group transition-colors"
                >
                  View all
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-orange-200 hover:border-orange-300 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-base mb-0.5">
                      {stats.comments.pending} Comment{stats.comments.pending > 1 ? 's' : ''} Waiting
                    </p>
                    <p className="text-xs text-gray-600">Review and approve new comments</p>
                  </div>
                </div>
                <a 
                  href="/admin/articles"
                  className="px-4 py-2 bg-gradient-to-r from-[#0066FF] to-[#0052CC] text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Review
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}