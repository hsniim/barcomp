'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

export default function AdminFooter() {
  const [language, setLanguage] = useState('en');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Initialize language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Translated content
  const t = useMemo(() => ({
    aboutCompany: language === 'en' ? 'About Company' : 'Tentang Perusahaan',
    companyDesc: language === 'en' 
      ? 'We deliver innovative solutions for web development, mobile apps, and digital transformation.' 
      : 'Kami memberikan solusi inovatif untuk pengembangan web, aplikasi mobile, dan transformasi digital.',
    quickLinks: language === 'en' ? 'Quick Links' : 'Tautan Cepat',
    home: language === 'en' ? 'Home' : 'Beranda',
    aboutUs: language === 'en' ? 'About Us' : 'Tentang Kami',
    services: language === 'en' ? 'Services' : 'Layanan',
    resources: language === 'en' ? 'Resources' : 'Sumber Daya',
    contact: language === 'en' ? 'Contact' : 'Kontak',
    ourServices: language === 'en' ? 'Our Services' : 'Layanan Kami',
    webDev: language === 'en' ? 'Web Development' : 'Pengembangan Web',
    mobileDev: language === 'en' ? 'Mobile App Development' : 'Pengembangan Aplikasi Mobile',
    uiuxDesign: language === 'en' ? 'UI/UX Design' : 'Desain UI/UX',
    digitalMarketing: language === 'en' ? 'Digital Marketing' : 'Pemasaran Digital',
    cloudSolutions: language === 'en' ? 'Cloud Solutions' : 'Solusi Cloud',
    contactInfo: language === 'en' ? 'Contact Information' : 'Informasi Kontak',
    address: language === 'en' ? 'Jakarta, Indonesia' : 'Jakarta, Indonesia',
    followUs: language === 'en' ? 'Follow Us' : 'Ikuti Kami',
    allRights: language === 'en' ? 'All rights reserved.' : 'Hak cipta dilindungi.',
    privacyPolicy: language === 'en' ? 'Privacy Policy' : 'Kebijakan Privasi',
    termsService: language === 'en' ? 'Terms of Service' : 'Syarat Layanan',
  }), [language]);

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Barcomp. {t.allRights}
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                {t.privacyPolicy}
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                {t.termsService}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </footer>
  );
}