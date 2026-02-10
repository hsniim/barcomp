// app/resources/events/[slug]/not-found.js
// Custom 404 page khusus untuk event yang tidak ditemukan

import Link from 'next/link';
import { Calendar, ChevronLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function EventNotFound() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16 lg:py-24 max-w-5xl">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 sm:p-12 md:p-16 text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-8">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              404
            </h1>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Event Tidak Ditemukan
            </h2>
            
            {/* Description */}
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Maaf, event yang Anda cari tidak ditemukan atau mungkin sudah selesai dan diarsipkan. 
              Silakan coba event lainnya atau kembali ke halaman event.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/resources/events">
                <Button 
                  size="lg"
                  className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-8 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Kembali ke Daftar Event
                </Button>
              </Link>
              
              <Link href="/contact">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-200 hover:border-[#0066FF] hover:bg-gray-50 px-8 w-full sm:w-auto"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Hubungi Kami
                </Button>
              </Link>
            </div>

            {/* Divider */}
            <div className="my-12">
              <div className="h-px bg-gray-200"></div>
            </div>

            {/* Helpful Links */}
            <div className="text-left max-w-xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Yang Mungkin Anda Cari:
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/resources/events"
                    className="text-[#0066FF] hover:text-[#0052CC] hover:underline transition-colors flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                    Event Mendatang
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact"
                    className="text-[#0066FF] hover:text-[#0052CC] hover:underline transition-colors flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                    Informasi Event Custom
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/"
                    className="text-[#0066FF] hover:text-[#0052CC] hover:underline transition-colors flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4 rotate-180" />
                    Kembali ke Beranda
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

// Metadata untuk 404 page
export const metadata = {
  title: '404 - Event Tidak Ditemukan | Barcomp',
  description: 'Event yang Anda cari tidak ditemukan atau sudah selesai.',
};