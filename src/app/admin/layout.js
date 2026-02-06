// app/admin/layout.js  (atau layout.tsx)
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Image as LucideImage,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  ChevronUp,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Articles', href: '/admin/articles', icon: FileText },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Gallery', href: '/admin/gallery', icon: LucideImage },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const isLoginPage = pathname === '/admin/login' || pathname.startsWith('/admin/login/');

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [currentUser, setCurrentUser] = useState(null); // null = belum load

  const userMenuRef = useRef(null);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch user info
  useEffect(() => {
    if (isLoginPage) {
      setIsLoadingUser(false);
      return;
    }

    const fetchUserInfo = async () => {
      setIsLoadingUser(true);
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store', // penting agar selalu fresh
        });

        if (!res.ok) {
          if (res.status === 401) {
            toast.error('Sesi telah berakhir. Silakan login kembali.');
            router.replace('/admin/login');
            return;
          }
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        if (!data.authenticated || !data.user) {
          router.replace('/admin/login');
          return;
        }

        // Validasi role (sesuaikan dengan yang ada di database kamu)
        if (data.user.role !== 'super_admin') {
          toast.error('Akses ditolak: Hanya Super Admin yang diizinkan.');
          router.replace('/unauthorized');
          return;
        }

        const name = data.user.fullName || data.user.full_name || 'Super Admin';
        const initials = name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

        setCurrentUser({
          name,
          email: data.user.email,
          initials,
          avatar: data.user.avatar || '/images/superadmin_avatar.jpg',
        });
      } catch (err) {
        console.error('Gagal memuat info user:', err);
        toast.error('Gagal memuat data pengguna');
        // Jangan langsung redirect agar tidak loop jika network bermasalah
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserInfo();
  }, [isLoginPage, router]);

  const handleLogout = async () => {
    if (!confirm('Apakah Anda yakin ingin logout?')) return;

    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        toast.success('Berhasil logout');
        router.replace('/admin/login');
      } else {
        throw new Error('Logout gagal');
      }
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Gagal logout, mencoba redirect...');
      router.replace('/admin/login');
    }
  };

  const isActiveRoute = (href) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Jika halaman login → render children tanpa layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Jika masih loading user → tampilkan skeleton / loading
  if (isLoadingUser || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#0066FF]" />
          <p className="text-gray-600">Memuat panel admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600/75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header sidebar */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Barcomp</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigasi */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const active = isActiveRoute(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all',
                  active
                    ? 'bg-blue-50 text-[#0066FF] shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5 mr-3',
                    active ? 'text-[#0066FF]' : 'text-gray-400'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="relative p-4 border-t border-gray-200" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {currentUser.avatar && currentUser.avatar !== '/images/superadmin_avatar.jpg' ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0066FF] to-[#0052CC] flex items-center justify-center shadow-md">
                <span className="text-white font-medium text-sm">{currentUser.initials}</span>
              </div>
            )}
            <div className="flex-1 ml-3 text-left min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
            </div>
            <ChevronUp
              className={cn(
                'w-4 h-4 text-gray-400 transition-transform',
                userMenuOpen && 'rotate-180'
              )}
            />
          </button>

          {userMenuOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 py-2 bg-white border border-gray-200 rounded-lg shadow-lg">
              <Link
                href="/admin/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setUserMenuOpen(false)}
              >
                <User className="w-4 h-4 mr-3 text-gray-400" />
                Profile
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setUserMenuOpen(false)}
              >
                <Settings className="w-4 h-4 mr-3 text-gray-400" />
                Settings
              </Link>
              <div className="border-t border-gray-200 my-1" />
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-gray-600 hover:text-gray-900"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {navigation.find((item) => isActiveRoute(item.href))?.name || 'Admin Panel'}
            </h1>
          </div>

          {/* Mobile user avatar */}
          <div className="lg:hidden">
            {currentUser.avatar && currentUser.avatar !== '/images/superadmin_avatar.jpg' ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0066FF] to-[#0052CC] flex items-center justify-center">
                <span className="text-white text-xs font-medium">{currentUser.initials}</span>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}