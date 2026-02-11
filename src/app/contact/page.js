'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';

export default function Contact() {
  const t = {
    id: {
      title: 'Hubungi Kami',
      subtitle: 'Punya proyek yang ingin didiskusikan? Mari bicarakan bagaimana kami dapat membantu mewujudkan ide Anda.',
      contactInfo: 'Informasi Kontak',
      contactDesc: 'Hubungi kami melalui salah satu saluran berikut',
      emailLabel: 'Email',
      phoneLabel: 'Telepon',
      whatsappLabel: 'WhatsApp',
      office: 'Kantor',
      businessHours: 'Jam Operasional',
      monday: 'Senin - Jumat:',
      saturday: 'Sabtu:',
      sunday: 'Minggu:',
      closed: 'Tutup',
      emailUs: 'Kirim Email',
      callUs: 'Hubungi Kami',
      chatWhatsApp: 'Chat di WhatsApp',
      getInTouch: 'Cara Menghubungi Kami',
      touchDesc: 'Pilih metode komunikasi yang paling nyaman untuk Anda'
    }
  };

  const content = t.id;

  // Ganti dengan data kontak Anda
  const contactData = {
    email: 'barcomp@gmail.com',
    phone: '+62 899-8378498',
    whatsapp: '628998378498', // Format: country code + number (tanpa +, -, atau spasi)
    whatsappMessage: 'Halo, saya ingin bertanya tentang layanan Anda',
    address: 'B7, Jl. Cipinang Pulo No.19, RT.7/RW.14, North Cipinang Besar, Jatinegara, East Jakarta City, Jakarta 13410',
    hours: {
      weekday: '09:00 - 18:00',
      saturday: '09:00 - 14:00',
      sunday: 'Tutup'
    }
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${contactData.email}`;
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${contactData.phone}`;
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(contactData.whatsappMessage);
    window.open(`https://wa.me/${contactData.whatsapp}?text=${message}`, '_blank');
  };

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

        {/* Contact Methods Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {content.getInTouch}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {content.touchDesc}
              </p>
            </div>

            {/* CTA Buttons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
              {/* WhatsApp Button */}
              <button
                onClick={handleWhatsAppClick}
                className="group relative bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-white/20 rounded-full p-4 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{content.chatWhatsApp}</h3>
                  <p className="text-green-50 text-sm mb-4">Respon cepat & langsung</p>
                  <div className="flex items-center justify-center text-white/90 text-sm font-medium">
                    <span>Chat Sekarang</span>
                    <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </button>

              {/* Email Button */}
              <button
                onClick={handleEmailClick}
                className="group relative bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-white/20 rounded-full p-4 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{content.emailUs}</h3>
                  <p className="text-blue-50 text-sm mb-4">Untuk pertanyaan detail</p>
                  <div className="flex items-center justify-center text-white/90 text-sm font-medium">
                    <span>Kirim Email</span>
                    <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </button>

              {/* Phone Button */}
              <button
                onClick={handlePhoneClick}
                className="group relative bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-white/20 rounded-full p-4 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{content.callUs}</h3>
                  <p className="text-purple-50 text-sm mb-4">Bicara langsung dengan tim</p>
                  <div className="flex items-center justify-center text-white/90 text-sm font-medium">
                    <span>Telepon Kami</span>
                    <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </button>
            </div>

            {/* Contact Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {/* Email Info */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{content.emailLabel}</h3>
                <a href={`mailto:${contactData.email}`} className="text-gray-600 hover:text-blue-600 transition-colors duration-200 break-all">
                  {contactData.email}
                </a>
              </div>

              {/* Phone Info */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="bg-purple-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{content.phoneLabel}</h3>
                <a href={`tel:${contactData.phone}`} className="text-gray-600 hover:text-purple-600 transition-colors duration-200">
                  {contactData.phone}
                </a>
              </div>

              {/* WhatsApp Info */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="bg-green-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{content.whatsappLabel}</h3>
                <a 
                  href={`https://wa.me/${contactData.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200"
                >
                  {contactData.phone}
                </a>
              </div>

              {/* Office Hours */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="bg-orange-50 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{content.businessHours}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">{content.monday}</span> {contactData.hours.weekday}</p>
                  <p><span className="font-medium">{content.saturday}</span> {contactData.hours.saturday}</p>
                  <p><span className="font-medium">{content.sunday}</span> {contactData.hours.sunday}</p>
                </div>
              </div>
            </div>

            {/* Office Address */}
            <div className="mt-12 max-w-3xl mx-auto">
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 text-center">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{content.office}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {contactData.address}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}