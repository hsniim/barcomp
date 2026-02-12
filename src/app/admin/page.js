// app/admin/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  Users,
  Loader2
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
    articles: { total: 0, published: 0, draft: 0, featured: 0 },
    events: { total: 0, upcoming: 0, ongoing: 0, completed: 0, featured: 0 },
    gallery: { total: 0, featured: 0 },
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

      // Calculate stats
      const articles = articlesData.data || [];
      const events = eventsData.data || [];
      const gallery = galleryData.data || [];

      setStats({
        articles: {
          total: articles.length,
          published: articles.filter(a => a.status === 'published').length,
          draft: articles.filter(a => a.status === 'draft').length,
          featured: articles.filter(a => a.featured).length
        },
        events: {
          total: events.length,
          upcoming: events.filter(e => e.status === 'upcoming').length,
          ongoing: events.filter(e => e.status === 'ongoing').length,
          completed: events.filter(e => e.status === 'completed').length,
          featured: events.filter(e => e.featured).length
        },
        gallery: {
          total: gallery.filter(g => !g.deleted_at).length,
          featured: gallery.filter(g => g.featured && !g.deleted_at).length
        },
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
      color: 'text-[#0066FF]',  // Warna ikon biru seperti total di events
      bg: 'bg-blue-50',        // Background ringan
      trend: `${stats.articles.featured} featured`,
      trendUp: true,
      href: '/admin/articles'
    },
    {
      title: 'Total Events',
      value: stats.events.total,
      subtitle: `${stats.events.upcoming} upcoming, ${stats.events.ongoing} ongoing`,
      icon: Calendar,
      color: 'text-blue-600',  // Sesuaikan dengan upcoming di events
      bg: 'bg-blue-50',
      trend: `${stats.events.featured} featured`,
      trendUp: true,
      href: '/admin/events'
    },
    {
      title: 'Gallery Items',
      value: stats.gallery.total,
      subtitle: `0 featured photos`,  // Sesuaikan subtitle jika perlu
      icon: Image,
      color: 'text-green-600',  // Sesuaikan dengan ongoing di events
      bg: 'bg-green-50',
      trend: 'Active items',
      trendUp: true,
      href: '/admin/gallery'
    },
  ];

  const quickActions = [
    {
      title: 'Tulis Artikel',
      description: 'Buat artikel baru',
      icon: FileText,
      color: 'text-[#0066FF]',
      bgColor: 'bg-blue-50',
      href: '/admin/articles/create'
    },
    {
      title: 'Tambah Event',
      description: 'Buat event baru',
      icon: Calendar,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      href: '/admin/events/create'
    },
    {
      title: 'Upload Gallery',
      description: 'Tambah foto baru',
      icon: Image,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/admin/gallery/create'
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#0066FF] animate-spin mx-auto" />
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
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-600">
          Welcome back, <span className="font-semibold text-gray-900">{user?.full_name || 'Admin'}</span>! Here's what's happening with your site.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
          >
            <Link href={stat.href}>
              <Card className="border-gray-200 hover:border-[#0066FF] hover:shadow-lg transition-all duration-300 group overflow-hidden cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        {stat.title}
                      </p>
                      <p className="mt-2 text-3xl font-bold text-gray-900 tabular-nums">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {stat.subtitle}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-green-600">
                        <TrendingUp className="w-4 h-4" />  {/* Sesuaikan ikon trend jika perlu */}
                        <span className="text-xs font-semibold">{stat.trend}</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-gray-300 hover:border-[#0066FF] shadow-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white pb-4 pt-5 px-6">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center px-3 py-1.5 bg-blue-100 rounded-full border border-blue-200">
                <Activity className="w-3.5 h-3.5 text-[#0066FF] mr-1.5" />
                <span className="text-xs font-bold text-[#0066FF] uppercase tracking-wide">Quick Access</span>
              </div>
              <CardTitle className="text-lg font-bold text-gray-900">Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex flex-col items-start p-5 border border-gray-200 rounded-xl hover:border-[#0066FF] hover:shadow-md transition-all duration-300 group cursor-pointer ${action.bg}`}
                  >
                    <div className="flex items-center justify-between w-full mb-3">
                      <div className={`w-12 h-12 ${action.bg} rounded-xl flex items-center justify-center`}>
                        <action.icon className={`w-6 h-6 ${action.color}`} />
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-[#0066FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-[#0066FF] transition-colors duration-300">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-600 font-medium leading-relaxed">{action.description}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}