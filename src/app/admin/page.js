// app/admin/dashboard/page.js
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Calendar, 
  Image, 
  Users, 
  TrendingUp,
  Activity,
  Plus,
  ArrowUpRight
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    articles: { total: 0, published: 0 },
    events: { total: 0, upcoming: 0 },
    gallery: { total: 0 },
    users: { total: 0, active: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [articlesRes, eventsRes, galleryRes, usersRes] = await Promise.all([
        fetch('/api/articles?limit=1'),
        fetch('/api/events?limit=1'),
        fetch('/api/gallery?limit=1'),
        fetch('/api/admin/users?limit=1', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const [articles, events, gallery, users] = await Promise.all([
        articlesRes.json(),
        eventsRes.json(),
        galleryRes.json(),
        usersRes.json()
      ]);

      setStats({
        articles: {
          total: articles.pagination?.total || 0,
          published: articles.pagination?.total || 0
        },
        events: {
          total: events.pagination?.total || 0,
          upcoming: events.pagination?.total || 0
        },
        gallery: {
          total: gallery.pagination?.total || 0
        },
        users: {
          total: users.pagination?.total || 0,
          active: users.pagination?.total || 0
        }
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Articles',
      value: stats.articles.total,
      subtitle: `${stats.articles.published} published`,
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
      subtitle: `${stats.events.upcoming} upcoming`,
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
      subtitle: 'Total photos',
      icon: Image,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-gray-200',
      trend: '+24%',
      trendUp: true,
      href: '/admin/gallery'
    },
    {
      title: 'Total Users',
      value: stats.users.total,
      subtitle: `${stats.users.active} active`,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-gray-200',
      trend: '+5%',
      trendUp: true,
      href: '/admin/users'
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
      title: 'Tambah User',
      description: 'Buat user baru',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverBg: 'hover:bg-green-100',
      borderColor: 'border-gray-200',
      href: '/admin/users/create'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'article',
      title: 'Artikel "Panduan Lengkap Next.js 16" dipublikasikan',
      user: 'Admin',
      time: '5 menit yang lalu',
      icon: FileText,
      color: 'text-[#0066FF]',
      bgColor: 'bg-blue-50'
    },
    {
      id: 2,
      type: 'event',
      title: 'Event "Workshop React 2026" ditambahkan',
      user: 'Admin',
      time: '15 menit yang lalu',
      icon: Calendar,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 3,
      type: 'gallery',
      title: '12 foto baru ditambahkan ke galeri',
      user: 'Admin',
      time: '1 jam yang lalu',
      icon: Image,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 4,
      type: 'user',
      title: 'User baru "johndoe" terdaftar',
      user: 'System',
      time: '2 jam yang lalu',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 5,
      type: 'article',
      title: 'Artikel "Tips & Trik Tailwind CSS" diperbarui',
      user: 'Admin',
      time: '3 jam yang lalu',
      icon: FileText,
      color: 'text-[#0066FF]',
      bgColor: 'bg-blue-50'
    }
  ];

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
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
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
        <p className="text-base text-gray-600">Welcome back! Here's what's happening with your site.</p>
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

      {/* Recent Activity */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-gray-200 hover:border-[#0066FF] hover:shadow-xl transition-all duration-300">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white pb-3 pt-4 px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="inline-block px-3 py-1.5 bg-indigo-100 rounded-full">
                  <Activity className="w-3.5 h-3.5 text-indigo-600 inline mr-1.5" />
                  <span className="text-xs font-semibold text-indigo-600">Activity Log</span>
                </div>
                <CardTitle className="text-lg text-gray-900">Recent Activity</CardTitle>
              </div>
              <a 
                href="/admin/activity" 
                className="text-xs font-semibold text-[#0066FF] hover:text-[#0052CC] flex items-center gap-1 group transition-colors"
              >
                View all
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2.5">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#0066FF] hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  <div className={`w-9 h-9 ${activity.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <activity.icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 mb-1 group-hover:text-[#0066FF] transition-colors">
                      {activity.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-medium">{activity.user}</span>
                      <span className="text-gray-400">•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </motion.div>
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
    </div>
  );
} 