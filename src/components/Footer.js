'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

export default function Footer() {
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
      {/* Main Footer Content */}
      <div className="container mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Barcomp</h3>
            <p className="text-sm leading-relaxed">
              {t.companyDesc}
            </p>
            <div className="pt-4">
              <p className="text-sm font-semibold text-white mb-3">{t.followUs}</p>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-indigo-600 flex items-center justify-center transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-indigo-600 flex items-center justify-center transition-colors duration-200"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-indigo-600 flex items-center justify-center transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-indigo-600 flex items-center justify-center transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">{t.quickLinks}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:text-indigo-400 transition-colors duration-200">
                  {t.home}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:text-indigo-400 transition-colors duration-200">
                  {t.aboutUs}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm hover:text-indigo-400 transition-colors duration-200">
                  {t.services}
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-sm hover:text-indigo-400 transition-colors duration-200">
                  {t.resources}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-indigo-400 transition-colors duration-200">
                  {t.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">{t.ourServices}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/services/web-development" className="text-sm hover:text-indigo-400 transition-colors duration-200">
                  {t.webDev}
                </Link>
              </li>
              <li>
                <Link href="/services/mobile" className="text-sm hover:text-indigo-400 transition-colors duration-200">
                  {t.mobileDev}
                </Link>
              </li>
              <li>
                <Link href="/services/ui-ux" className="text-sm hover:text-indigo-400 transition-colors duration-200">
                  {t.uiuxDesign}
                </Link>
              </li>
              <li>
                <Link href="/services/marketing" className="text-sm hover:text-indigo-400 transition-colors duration-200">
                  {t.digitalMarketing}
                </Link>
              </li>
              <li>
                <Link href="/services/cloud" className="text-sm hover:text-indigo-400 transition-colors duration-200">
                  {t.cloudSolutions}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">{t.contactInfo}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{t.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <a href="tel:+6281234567890" className="text-sm hover:text-indigo-400 transition-colors duration-200">
                  +62 812-3456-7890
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <a href="mailto:info@barcomp.com" className="text-sm hover:text-indigo-400 transition-colors duration-200">
                  info@barcomp.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

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