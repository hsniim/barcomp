'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contact() {
  const t = {
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

  const content = t.id;

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
                    {'Peta akan ditampilkan di sini'}
                  </p>
                  <p className="text-sm mt-2">
                    {'Integrasi dengan Google Maps API'}
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