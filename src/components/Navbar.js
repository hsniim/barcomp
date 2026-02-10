'use client';

import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  ChevronDown, 
  X, 
  LogOut,
  Settings,
  UserCircle,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// memoized NavLink component
const NavLink = memo(({ href, children }) => (
  <Link 
    href={href}
    className="inline-block px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
  >
    {children}
  </Link>
));
NavLink.displayName = 'NavLink';

// memoized DropdownButton component
const DropdownButton = memo(({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "group flex items-center gap-1 px-4 py-2 font-medium transition-colors duration-200",
      isActive 
        ? 'text-indigo-600' 
        : 'text-gray-700 hover:text-indigo-600'
    )}
  >
    {label}
    <ChevronDown 
      className={cn(
        "w-4 h-4 transition-transform duration-200",
        isActive && 'rotate-180'
      )} 
    />
  </button>
));
DropdownButton.displayName = 'DropdownButton';

// memoized DropdownItem component
const DropdownItem = memo(({ item, index, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.2 }}
  >
    <Link
      href={item.href}
      onClick={onClose}
      className="block p-4 rounded-lg hover:bg-gray-50 transition-colors group"
    >
      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
        {item.label}
      </h3>
      <p className="text-sm text-gray-600">
        {item.description}
      </p>
    </Link>
  </motion.div>
));
DropdownItem.displayName = 'DropdownItem';

// memoized MobileMenuItem component
const MobileMenuItem = memo(({ item, onClose }) => (
  <Link
    href={item.href}
    onClick={onClose}
    className="block py-2 pl-4 text-base text-gray-700 hover:text-indigo-600"
  >
    {item.label}
  </Link>
));
MobileMenuItem.displayName = 'MobileMenuItem';

// User Menu Component
const UserMenu = memo(({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0066FF] to-[#0052CC] flex items-center justify-center text-white font-semibold overflow-hidden">
          {user.avatar ? (
            <Image src={user.avatar} alt={user.fullName} width={40} height={40} className="object-cover" />
          ) : (
            user.fullName?.charAt(0).toUpperCase()
          )}
        </div>
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-40"
            >
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
                {user.role !== 'user' && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 uppercase">
                    {user.role}
                  </span>
                )}
              </div>

              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <UserCircle className="w-4 h-4" />
                  Profil Saya
                </Link>

                {(user.role === 'admin' || user.role === 'super_admin' || user.role === 'editor') && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}

                <Link
                  href="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="w-4 h-4" />
                  Pengaturan
                </Link>
              </div>

              <div className="border-t border-gray-100 py-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});

UserMenu.displayName = 'UserMenu';

// main navbar component
export default function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpandedMenu, setMobileExpandedMenu] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
        }
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Logout handler
  const handleLogout = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      router.push('/');
    }
  }, [router]);

  // memoized menu items with translations
  const menuItems = useMemo(() => ({
    about: [
      { 
        label: 'Profil', 
        description: 'Mengenal kami lebih dekat', 
        href: '/about/profile' 
      },
      { 
        label: 'Visi & Misi', 
        description: 'Aspirasi dan langkah nyata kami', 
        href: '/about/vision' 
      },
      { 
        label: 'Mitra Kami', 
        description: 'Kolabrorasi sukses bersama mitra-mitra', 
        href: '/about/clients' 
      },
    ],
    services: [
      { 
        label: 'Pengembangan Web', 
        description: 'Aplikasi web modern', 
        href: '/services/web' 
      },
      { 
        label: 'Pengembangan Aplikasi Mobile', 
        description: 'Aplikasi iOS dan Android', 
        href: '/services/mobile' 
      },
      { 
        label: 'Desain UI/UX', 
        description: 'Pengalaman pengguna yang indah', 
        href: '/services/ux' 
      },
    ],
    resources: [
      { 
        label: 'Artikel', 
        description: 'Baca wawasan terbaru kami', 
        href: '/resources/articles' 
      },
      { 
        label: 'Acara', 
        description: 'Ikuti acara mendatang kami', 
        href: '/resources/events' 
      },
      { 
        label: 'Galeri Foto', 
        description: 'Jelajahi koleksi gambar kami', 
        href: '/resources/gallery' 
      },
    ]
  }), []);

  // optimized scroll handler with throttling
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // close dropdown when clicking outside
  useEffect(() => {
    if (!activeDropdown) return;
    
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown]);

  // prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  // memoized callbacks
  const handleDropdownClick = useCallback((e, dropdown) => {
    e.stopPropagation();
    setActiveDropdown(prev => prev === dropdown ? null : dropdown);
  }, []);

  const toggleMobileMenu = useCallback((menu) => {
    setMobileExpandedMenu(prev => prev === menu ? null : menu);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const closeDropdown = useCallback(() => {
    setActiveDropdown(null);
  }, []);

  const toggleMobileOpen = useCallback(() => {
    setIsMobileOpen(prev => !prev);
  }, []);

  // get current dropdown items
  const currentDropdownItems = useMemo(() => {
    if (!activeDropdown) return [];
    return menuItems[activeDropdown] || [];
  }, [activeDropdown, menuItems]);

  // translated labels
  const t = useMemo(() => ({
    home: 'Beranda',
    aboutUs: 'Tentang Kami',
    services: 'Layanan',
    resources: 'Sumber Daya',
    contact: 'Kontak',
    needHelp: 'Butuh bantuan memilih?',
    getInTouch: 'Hubungi tim kami',
    contactUs: 'Hubungi kami',
  }), []);

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-sm shadow-sm'
            : 'bg-white'
        )}
      >
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* icon navbar */}
            <Link href="/" className="flex items-center z-50">
              <Image
                src="/logos/barcomp_primarylogo-blacktransp.svg"
                alt="Barcomp Logo"
                width={40}
                height={40}
                className="w-12 h-12 object-contain"
              />
              <h2 className="text-3xl font-semibold text-gray-900">
                Barcomp
              </h2>
            </Link>

            {/* desktop center navbar */}
            <div className="hidden lg:flex items-center space-x-1">
              <NavLink href="/">{t.home}</NavLink>
              
              <div className="relative">
                <DropdownButton 
                  label={t.aboutUs}
                  isActive={activeDropdown === 'about'}
                  onClick={(e) => handleDropdownClick(e, 'about')}
                />
              </div>

              <div className="relative">
                <DropdownButton 
                  label={t.services}
                  isActive={activeDropdown === 'services'}
                  onClick={(e) => handleDropdownClick(e, 'services')}
                />
              </div>

              <div className="relative">
                <DropdownButton 
                  label={t.resources}
                  isActive={activeDropdown === 'resources'}
                  onClick={(e) => handleDropdownClick(e, 'resources')}
                />
              </div>
            </div>

            {/* desktop right navbar (login/signup or user menu) */}
            <div className="hidden lg:flex items-center gap-4">   
                <>
                  <Link href="/contact">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6">
                      {t.contact}
                    </Button>
                  </Link>
                </>
            </div>

            {/* mobile menu button*/}
            <div className="lg:hidden flex items-center gap-3 z-50">
              <button
                onClick={toggleMobileOpen}
                className="p-2 text-gray-900"
                aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              >
                {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* desktop fullscreen dropdown overlay */}
      <AnimatePresence>
        {activeDropdown && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 z-40 hidden lg:block"
              style={{ top: 'var(--navbar-height, 80px)' }}
              onClick={closeDropdown}
            />

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-xl hidden lg:block"
              style={{ 
                top: 'var(--navbar-height, 80px)',
                maxHeight: 'calc(100vh - var(--navbar-height, 80px) - 80px)'
              }}
            >
              <div className="container mx-auto max-w-7xl px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentDropdownItems.map((item, index) => (
                    <DropdownItem 
                      key={item.href} 
                      item={item} 
                      index={index} 
                      onClose={closeDropdown}
                    />
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        {t.needHelp}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {t.getInTouch}
                      </p>
                    </div>
                    <Link 
                      href="/contact"
                      onClick={closeDropdown}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      {t.contactUs} →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* mobile menu fullscreen overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 bg-white z-40 lg:hidden overflow-y-auto"
            style={{ paddingTop: 'var(--navbar-height, 64px)' }}
          >
            <div className="flex flex-col h-full">
              {/* User Info (if logged in) */}
              {isAuthenticated && user && (
                <div className="p-6 bg-gradient-to-br from-[#0066FF] to-[#0052CC] text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-semibold overflow-hidden">
                      {user.avatar ? (
                        <Image src={user.avatar} alt={user.fullName} width={48} height={48} className="object-cover rounded-full" />
                      ) : (
                        user.fullName?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{user.fullName}</p>
                      <p className="text-sm opacity-90">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              <nav className="flex-1 px-6 py-8 space-y-1">
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="block py-4 text-2xl font-medium text-gray-900 border-b border-gray-200"
                >
                  {t.home}
                </Link>

                {/* about us accordion */}
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => toggleMobileMenu('about')}
                    className="flex items-center justify-between w-full py-4 text-2xl font-medium text-gray-900"
                  >
                    {t.aboutUs}
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 transition-transform duration-200",
                        mobileExpandedMenu === 'about' && 'rotate-180'
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileExpandedMenu === 'about' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 space-y-2">
                          {menuItems.about.map((item) => (
                            <MobileMenuItem key={item.href} item={item} onClose={closeMobileMenu} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* services accordion */}
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => toggleMobileMenu('services')}
                    className="flex items-center justify-between w-full py-4 text-2xl font-medium text-gray-900"
                  >
                    {t.services}
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 transition-transform duration-200",
                        mobileExpandedMenu === 'services' && 'rotate-180'
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileExpandedMenu === 'services' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 space-y-2">
                          {menuItems.services.map((item) => (
                            <MobileMenuItem key={item.href} item={item} onClose={closeMobileMenu} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* resources accordion */}
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => toggleMobileMenu('resources')}
                    className="flex items-center justify-between w-full py-4 text-2xl font-medium text-gray-900"
                  >
                    {t.resources}
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 transition-transform duration-200",
                        mobileExpandedMenu === 'resources' && 'rotate-180'
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileExpandedMenu === 'resources' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 space-y-2">
                          {menuItems.resources.map((item) => (
                            <MobileMenuItem key={item.href} item={item} onClose={closeMobileMenu} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </nav>

              {/* mobile login/signup button or user menu */}
              <div className="p-6 border-t border-gray-200 space-y-3">
                <Link href="/contact" onClick={closeMobileMenu}>
                  <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-base">
                    {t.contact}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        :root {
          --navbar-height: 80px;
        }
        @media (max-width: 1024px) {
          :root {
            --navbar-height: 64px;
          }
        }
      `}</style>
    </>
  );
}