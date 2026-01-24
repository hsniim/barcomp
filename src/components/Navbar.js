'use client';

import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ChevronDown, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// memoized NavLink component
const NavLink = memo(({ href, children }) => (
  <Link href={href}>
    <span className="inline-block px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200">
      {children}
    </span>
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

// language Switcher Component
const LanguageSwitcher = memo(({ language, onToggle }) => (
  <button
    onClick={onToggle}
    className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-300 hover:border-indigo-500 transition-colors duration-200 bg-white"
  >
    <Globe className="h-4 w-4 text-gray-600" />
    <span className="text-sm font-medium text-gray-900">
      {language.toUpperCase()}
    </span>
  </button>
));
LanguageSwitcher.displayName = 'LanguageSwitcher';

// main navbar component
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpandedMenu, setMobileExpandedMenu] = useState(null);
  const [language, setLanguage] = useState('en');

  // initialize language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en'; // Default to 'en'
    if (savedLang !== language) {
      setLanguage(savedLang);
    }
  }, []);

  // toggle language
  const toggleLanguage = useCallback(() => {
    setLanguage(prev => {
      const newLang = prev === 'en' ? 'id' : 'en';
      localStorage.setItem('language', newLang);
      
      // dispatch custom event to notify Home page and other components
      window.dispatchEvent(new CustomEvent('languageChange', { 
        detail: newLang,
        bubbles: true 
      }));
      
      console.log('Language changed to:', newLang); // Debug log
      
      return newLang;
    });
  }, []);

  // memoized menu items with translations
  const menuItems = useMemo(() => ({
    about: [
      { 
        label: language === 'en' ? 'Profile' : 'Profil', 
        description: language === 'en' ? 'Learn about our company' : 'Pelajari tentang perusahaan kami', 
        href: '/about/profile' 
      },
      { 
        label: language === 'en' ? 'Vision & Mission' : 'Visi & Misi', 
        description: language === 'en' ? 'The future we see' : 'Masa depan yang kami lihat', 
        href: '/about/vision' 
      },
      { 
        label: language === 'en' ? 'Values & Experience' : 'Nilai & Pengalaman', 
        description: language === 'en' ? 'What we stand for' : 'Apa yang kami perjuangkan', 
        href: '/about/values' 
      },
      { 
        label: language === 'en' ? 'Our Clients' : 'Klien Kami', 
        description: language === 'en' ? 'Trusted by our partners' : 'Dipercaya oleh mitra kami', 
        href: '/about/clients' 
      },
    ],
    services: [
      { 
        label: language === 'en' ? 'Web Development' : 'Pengembangan Web', 
        description: language === 'en' ? 'Modern web applications' : 'Aplikasi web modern', 
        href: '/services/web-development' 
      },
      { 
        label: language === 'en' ? 'Mobile App Development' : 'Pengembangan Aplikasi Mobile', 
        description: language === 'en' ? 'iOS and Android apps' : 'Aplikasi iOS dan Android', 
        href: '/services/mobile' 
      },
      { 
        label: language === 'en' ? 'UI/UX Design' : 'Desain UI/UX', 
        description: language === 'en' ? 'Beautiful user experiences' : 'Pengalaman pengguna yang indah', 
        href: '/services/ui-ux' 
      },
      { 
        label: language === 'en' ? 'Digital Marketing' : 'Pemasaran Digital', 
        description: language === 'en' ? 'Grow your online presence' : 'Tingkatkan kehadiran online Anda', 
        href: '/services/marketing' 
      },
      { 
        label: language === 'en' ? 'Cloud Solutions' : 'Solusi Cloud', 
        description: language === 'en' ? 'Scalable infrastructure' : 'Infrastruktur yang skalabel', 
        href: '/services/cloud' 
      },
    ],
    resources: [
      { 
        label: language === 'en' ? 'Articles' : 'Artikel', 
        description: language === 'en' ? 'Read our latest insights' : 'Baca wawasan terbaru kami', 
        href: '/resources/articles' 
      },
      { 
        label: language === 'en' ? 'Events' : 'Acara', 
        description: language === 'en' ? 'Join our upcoming events' : 'Ikuti acara mendatang kami', 
        href: '/resources/events' 
      },
      { 
        label: language === 'en' ? 'Photo Gallery' : 'Galeri Foto', 
        description: language === 'en' ? 'Browse our image collection' : 'Jelajahi koleksi gambar kami', 
        href: '/resources/gallery' 
      },
    ]
  }), [language]);

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
    home: language === 'en' ? 'Home' : 'Beranda',
    aboutUs: language === 'en' ? 'About Us' : 'Tentang Kami',
    services: language === 'en' ? 'Services' : 'Layanan',
    resources: language === 'en' ? 'Resources' : 'Sumber Daya',
    contact: language === 'en' ? 'Contact' : 'Kontak',
    login: language === 'en' ? 'Log in' : 'Masuk',
    signup: language === 'en' ? 'Sign up' : 'Daftar',
    needHelp: language === 'en' ? 'Need help choosing?' : 'Butuh bantuan memilih?',
    getInTouch: language === 'en' ? 'Get in touch with our team' : 'Hubungi tim kami',
    contactUs: language === 'en' ? 'Contact us' : 'Hubungi kami',
  }), [language]);

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
                src="/barcomp_primarylogo-blacktransp.svg"
                alt="Barcomp Logo"
                width={40}
                height={40}
                className="w-12 h-12 object-contain"
              />
              <span className="text-2xl font-semibold text-gray-900">
                Barcomp
              </span>
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

              <NavLink href="/contact">{t.contact}</NavLink>
            </div>

            {/* desktop right navbar (login/signup) */}
            <div className="hidden lg:flex items-center gap-4">
              <LanguageSwitcher language={language} onToggle={toggleLanguage} />
              
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  {t.login}
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6">
                  {t.signup}
                </Button>
              </Link>
            </div>

            {/* mobile menu button & lang switcher */}
            <div className="lg:hidden flex items-center gap-3 z-50">
              <LanguageSwitcher language={language} onToggle={toggleLanguage} />
              
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
              <nav className="flex-1 px-6 py-8 space-y-1">
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="block py-4 text-2xl font-medium text-gray-900 border-b border-gray-200"
                >
                  {t.home}
                </Link>

                {/* about us  accordion*/}
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

                <Link
                  href="/contact"
                  onClick={closeMobileMenu}
                  className="block py-4 text-2xl font-medium text-gray-900 border-b border-gray-200"
                >
                  {t.contact}
                </Link>
              </nav>

              {/* mobile login/signup button */}
              <div className="p-6 border-t border-gray-200 space-y-3">
                <Link href="/login" onClick={closeMobileMenu}>
                  <Button 
                    variant="ghost"
                    className="w-full h-12 text-gray-700 hover:text-indigo-600 font-medium text-base"
                  >
                    {t.login}
                  </Button>
                </Link>
                <Link href="/register" onClick={closeMobileMenu}>
                  <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-base">
                    {t.signup}
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