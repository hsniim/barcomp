'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contact() {
  const [language, setLanguage] = useState('en');

  // Listen for language changes
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    if (savedLang !== language) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    const handleLanguageChange = (e) => {
      if (e.detail && e.detail !== language) {
        setLanguage(e.detail);
      }
    };

    const handleStorageChange = (e) => {
      if (e.key === 'language' && e.newValue && e.newValue !== language) {
        setLanguage(e.newValue);
      }
    };

    window.addEventListener('languageChange', handleLanguageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [language]);

  const t = {
    en: {
      title: 'Get in Touch',
      subtitle: 'Have a project in mind? Let\'s discuss how we can help bring your ideas to life.',
      formTitle: 'Send us a Message',
      formDescription: 'Fill out the form below and we\'ll get back to you as soon as possible.',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      subject: 'Subject',
      message: 'Message',
      send: 'Send Message',
      sending: 'Sending...',
      contactInfo: 'Contact Information',
      contactDesc: 'Get in touch with us through any of these channels',
      emailLabel: 'Email',
      phoneLabel: 'Phone',
      office: 'Office',
      businessHours: 'Business Hours',
      monday: 'Monday - Friday:',
      saturday: 'Saturday:',
      sunday: 'Sunday:',
      closed: 'Closed',
      successMsg: 'Message sent successfully! We\'ll get back to you soon.',
      errorMsg: 'Failed to send message. Please try again.'
    },
    id: {
      title: 'Hubungi Kami',
      subtitle: 'Punya proyek yang ingin didiskusikan? Mari bicarakan bagaimana kami dapat membantu mewujudkan ide Anda.',
      formTitle: 'Kirim Pesan',
      formDescription: 'Isi formulir di bawah ini dan kami akan menghubungi Anda sesegera mungkin.',
      name: 'Nama',
      email: 'Email',
      phone: 'Telepon',
      subject: 'Subjek',
      message: 'Pesan',
      send: 'Kirim Pesan',
      sending: 'Mengirim...',
      contactInfo: 'Informasi Kontak',
      contactDesc: 'Hubungi kami melalui salah satu saluran berikut',
      emailLabel: 'Email',
      phoneLabel: 'Telepon',
      office: 'Kantor',
      businessHours: 'Jam Operasional',
      monday: 'Senin - Jumat:',
      saturday: 'Sabtu:',
      sunday: 'Minggu:',
      closed: 'Tutup',
      successMsg: 'Pesan berhasil dikirim! Kami akan segera menghubungi Anda.',
      errorMsg: 'Gagal mengirim pesan. Silakan coba lagi.'
    }
  };

  const content = t[language];

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="pt-32 pb-16 lg:pt-40 lg:pb-20 bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                {content.title}
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                {content.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <ContactForm />
          </div>
        </section>

        {/* Map Section (Optional) */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <div className="bg-gray-300 rounded-2xl overflow-hidden" style={{ height: '400px' }}>
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                {/* Placeholder for Google Maps */}
                <div className="text-center">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">
                    {language === 'en' ? 'Map will be displayed here' : 'Peta akan ditampilkan di sini'}
                  </p>
                  <p className="text-sm mt-2">
                    {language === 'en' 
                      ? 'Integrate with Google Maps API' 
                      : 'Integrasi dengan Google Maps API'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}