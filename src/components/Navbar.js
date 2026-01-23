'use client';

import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Memoized NavLink component
const NavLink = memo(({ href, children }) => (
  <Link href={href}>
    <motion.span
      className="inline-block px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors duration-200"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.span>
  </Link>
));
NavLink.displayName = 'NavLink';

// Memoized DropdownButton component
const DropdownButton = memo(({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "group flex items-center gap-1 px-4 py-2 font-medium transition-all duration-200 hover:scale-105",
      isActive 
        ? 'text-indigo-600 dark:text-indigo-400' 
        : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
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

// Memoized DropdownItem component
const DropdownItem = memo(({ item, index, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.2 }}
  >
    <Link
      href={item.href}
      onClick={onClose}
      className="block p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group"
    >
      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {item.label}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {item.description}
      </p>
    </Link>
  </motion.div>
));
DropdownItem.displayName = 'DropdownItem';

// Memoized MobileMenuItem component
const MobileMenuItem = memo(({ item, onClose }) => (
  <Link
    href={item.href}
    onClick={onClose}
    className="block py-2 pl-4 text-base text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
  >
    {item.label}
  </Link>
));
MobileMenuItem.displayName = 'MobileMenuItem';

// Main Navbar Component
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpandedMenu, setMobileExpandedMenu] = useState(null);

  // Memoized menu items
  const menuItems = useMemo(() => ({
    about: [
      { label: 'Profile', description: 'Learn about our company', href: '/about/profile' },
      { label: 'Vision & Mission', description: 'The future we see', href: '/about/vision' },
      { label: 'Values & Experience', description: 'What we stand for', href: '/about/values' },
      { label: 'Our Clients', description: 'Trusted by our partners', href: '/about/clients' },
    ],
    services: [
      { label: 'Web Development', description: 'Modern web applications', href: '/services/web-development' },
      { label: 'Mobile App Development', description: 'iOS and Android apps', href: '/services/mobile' },
      { label: 'UI/UX Design', description: 'Beautiful user experiences', href: '/services/ui-ux' },
      { label: 'Digital Marketing', description: 'Grow your online presence', href: '/services/marketing' },
      { label: 'Cloud Solutions', description: 'Scalable infrastructure', href: '/services/cloud' },
    ],
    resources: [
      { label: 'Articles', description: 'Read our latest insights', href: '/resources/articles' },
      { label: 'Events', description: 'Join our upcoming events', href: '/resources/events' },
      { label: 'Photo Gallery', description: 'Browse our image collection', href: '/resources/gallery' },
    ]
  }), []);

  // Optimized scroll handler with throttling
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

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!activeDropdown) return;
    
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  // Memoized callbacks
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

  // Get current dropdown items
  const currentDropdownItems = useMemo(() => {
    if (!activeDropdown) return [];
    return menuItems[activeDropdown] || [];
  }, [activeDropdown, menuItems]);

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-sm shadow-sm dark:bg-gray-950/95'
            : 'bg-white dark:bg-gray-950'
        )}
      >
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center z-50">
              <motion.span className="text-2xl font-semibold text-gray-900 dark:text-white">
                Barcomp
              </motion.span>
            </Link>

            {/* Desktop Navigation - Center */}
            <div className="hidden lg:flex items-center space-x-1">
              <NavLink href="/">Home</NavLink>
              
              <div className="relative">
                <DropdownButton 
                  label="About Us" 
                  isActive={activeDropdown === 'about'}
                  onClick={(e) => handleDropdownClick(e, 'about')}
                />
              </div>

              <div className="relative">
                <DropdownButton 
                  label="Services" 
                  isActive={activeDropdown === 'services'}
                  onClick={(e) => handleDropdownClick(e, 'services')}
                />
              </div>

              <div className="relative">
                <DropdownButton 
                  label="Resources" 
                  isActive={activeDropdown === 'resources'}
                  onClick={(e) => handleDropdownClick(e, 'resources')}
                />
              </div>

              <NavLink href="/contact">Contact</NavLink>
            </div>

            {/* Desktop Auth Buttons - Right */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6">
                  Sign up
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileOpen}
              className="lg:hidden p-2 text-gray-900 dark:text-white z-50"
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            >
              {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Desktop Full-Screen Dropdown Overlay */}
      <AnimatePresence>
        {activeDropdown && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 hidden lg:block"
              style={{ top: 'var(--navbar-height, 80px)' }}
              onClick={closeDropdown}
            />

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed left-0 right-0 z-40 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-xl hidden lg:block"
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

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        Need help choosing?
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Get in touch with our team
                      </p>
                    </div>
                    <Link 
                      href="/contact"
                      onClick={closeDropdown}
                      className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                    >
                      Contact us →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu Full-Screen Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 bg-white dark:bg-gray-950 z-40 lg:hidden overflow-y-auto"
            style={{ paddingTop: 'var(--navbar-height, 64px)' }}
          >
            <div className="flex flex-col h-full">
              <nav className="flex-1 px-6 py-8 space-y-1">
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="block py-4 text-2xl font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800"
                >
                  Home
                </Link>

                {/* About Us Accordion */}
                <div className="border-b border-gray-200 dark:border-gray-800">
                  <button
                    onClick={() => toggleMobileMenu('about')}
                    className="flex items-center justify-between w-full py-4 text-2xl font-medium text-gray-900 dark:text-white"
                  >
                    About Us
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

                {/* Services Accordion */}
                <div className="border-b border-gray-200 dark:border-gray-800">
                  <button
                    onClick={() => toggleMobileMenu('services')}
                    className="flex items-center justify-between w-full py-4 text-2xl font-medium text-gray-900 dark:text-white"
                  >
                    Services
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

                {/* Resources Accordion */}
                <div className="border-b border-gray-200 dark:border-gray-800">
                  <button
                    onClick={() => toggleMobileMenu('resources')}
                    className="flex items-center justify-between w-full py-4 text-2xl font-medium text-gray-900 dark:text-white"
                  >
                    Resources
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
                  className="block py-4 text-2xl font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800"
                >
                  Contact
                </Link>
              </nav>

              {/* Mobile Auth Buttons */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-800 space-y-3">
                <Link href="/login" onClick={closeMobileMenu}>
                  <Button 
                    variant="outline" 
                    className="w-full h-12 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium text-base hover:border-indigo-600 hover:text-indigo-600"
                  >
                    Log in
                  </Button>
                </Link>
                <Link href="/register" onClick={closeMobileMenu}>
                  <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-base">
                    Sign up
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