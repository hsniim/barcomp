'use client';

import { useState, useEffect, useRef, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Images,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Tag,
  Sparkles,
  AlertCircle,
  ImageOff,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Fade-in Animation Component
const FadeInSection = memo(({ children, delay = 0 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      )}
    >
      {children}
    </div>
  );
});

FadeInSection.displayName = 'FadeInSection';

// Category Badge Colors
const categoryColors = {
  teknologi: 'bg-blue-100 text-blue-700 border-blue-200',
  kesehatan: 'bg-green-100 text-green-700 border-green-200',
  finansial: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  bisnis: 'bg-purple-100 text-purple-700 border-purple-200',
  inovasi: 'bg-pink-100 text-pink-700 border-pink-200',
  karir: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  keberlanjutan: 'bg-teal-100 text-teal-700 border-teal-200',
  kantor: 'bg-orange-100 text-orange-700 border-orange-200',
  acara: 'bg-rose-100 text-rose-700 border-rose-200',
  lainnya: 'bg-gray-100 text-gray-700 border-gray-200',
};

// Format tanggal Indonesia
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    return '';
  }
};

// Gallery Item Card Component
const GalleryItemCard = memo(({ item, onOpen }) => {
  return (
    <Card 
      onClick={() => onOpen(item)}
      className="overflow-hidden border-2 border-gray-200 hover:border-[#0066FF] transition-all duration-300 cursor-pointer group h-full p-0"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={item.thumbnail_url || item.image_url}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
          <div className="text-white w-full">
            <h3 className="font-bold mb-1 line-clamp-2">{item.title}</h3>
            {item.category && (
              <Badge className={cn(
                "border text-xs",
                categoryColors[item.category] || categoryColors.lainnya
              )}>
                <Tag className="w-3 h-3 mr-1" />
                {item.category}
              </Badge>
            )}
          </div>
        </div>

        {/* Featured Badge */}
        {item.featured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-[#0066FF] text-white border-0 flex items-center gap-1 shadow-lg">
              <Sparkles className="w-3 h-3" />
              Featured
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
});

GalleryItemCard.displayName = 'GalleryItemCard';

// Gallery Skeleton
const GallerySkeleton = () => (
  <Card className="overflow-hidden h-full p-0">
    <div className="animate-pulse">
      <div className="bg-gray-200 aspect-square w-full" />
    </div>
  </Card>
);

// Lightbox Modal Component
const Lightbox = memo(({ item, onClose, onNext, onPrev, hasNext, hasPrev }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, onNext, onPrev, hasNext, hasPrev]);

  return (
    <div 
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 p-2 bg-white/10 rounded-full backdrop-blur-sm transition-all hover:bg-white/20"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Previous Button */}
      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10 p-3 bg-white/10 rounded-full backdrop-blur-sm transition-all hover:bg-white/20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next Button */}
      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10 p-3 bg-white/10 rounded-full backdrop-blur-sm transition-all hover:bg-white/20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Image Container */}
      <div 
        className="max-w-6xl max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative max-h-[75vh]">
          <Image
            src={item.image_url}
            alt={item.title}
            width={1200}
            height={800}
            className="max-w-full max-h-[75vh] object-contain mx-auto"
            priority
          />
        </div>

        {/* Info */}
        <div className="text-white text-center mt-6 space-y-3">
          <h2 className="text-2xl font-bold">{item.title}</h2>
          
          {item.description && (
            <p className="text-gray-300 max-w-2xl mx-auto">{item.description}</p>
          )}
          
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            {item.category && (
              <Badge className={cn(
                "border",
                categoryColors[item.category] || categoryColors.lainnya
              )}>
                <Tag className="w-3 h-3 mr-1" />
                {item.category}
              </Badge>
            )}
            
            {item.captured_at && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(item.captured_at)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

Lightbox.displayName = 'Lightbox';

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const categories = [
    { value: 'all', label: 'Semua' },
    { value: 'teknologi', label: 'Teknologi' },
    { value: 'kesehatan', label: 'Kesehatan' },
    { value: 'finansial', label: 'Finansial' },
    { value: 'bisnis', label: 'Bisnis' },
    { value: 'inovasi', label: 'Inovasi' },
    { value: 'karir', label: 'Karir' },
    { value: 'keberlanjutan', label: 'Keberlanjutan' },
    { value: 'kantor', label: 'Kantor' },
    { value: 'acara', label: 'Acara' },
    { value: 'lainnya', label: 'Lainnya' },
  ];

  useEffect(() => {
    fetchGallery();
  }, [selectedCategory]);

  const fetchGallery = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      if (selectedCategory && selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      const url = `/api/gallery?${params.toString()}`;
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      if (data.success) {
        setGalleryItems(data.data || []);
        setTotalItems(data.total || 0);
      } else {
        throw new Error(data.error || 'Gagal memuat gallery');
      }

    } catch (err) {
      console.error('[GalleryPage] Fetch error:', err);
      setError(err.message);
      setGalleryItems([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const openLightbox = (item) => {
    const index = galleryItems.findIndex(i => i.id === item.id);
    setSelectedImage(item);
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const showNextImage = () => {
    if (selectedIndex < galleryItems.length - 1) {
      const nextIndex = selectedIndex + 1;
      setSelectedIndex(nextIndex);
      setSelectedImage(galleryItems[nextIndex]);
    }
  };

  const showPrevImage = () => {
    if (selectedIndex > 0) {
      const prevIndex = selectedIndex - 1;
      setSelectedIndex(prevIndex);
      setSelectedImage(galleryItems[prevIndex]);
    }
  };

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-to-br from-[#0066FF] via-[#0052CC] to-[#003D99] overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="container mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <FadeInSection>
              <div className="text-center max-w-4xl mx-auto">
                <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold text-white mb-6 shadow-lg">
                  <Images className="w-4 h-4 inline-block mr-2" />
                  Gallery
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Gallery Barcomp
                </h1>
                
                <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
                  {totalItems} foto dokumentasi kegiatan dan momen berkesan kami
                </p>
              </div>
            </FadeInSection>
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="white"/>
            </svg>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 border-b border-gray-200 bg-white shadow-sm">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="flex items-center gap-3 mb-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Filter Kategori</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <Button
                    key={cat.value}
                    onClick={() => handleCategoryChange(cat.value)}
                    className={cn(
                      "rounded-full transition-all duration-300",
                      selectedCategory === cat.value
                        ? "bg-[#0066FF] text-white hover:bg-[#0052CC] shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200 hover:border-[#0066FF]"
                    )}
                  >
                    {cat.label}
                    {selectedCategory === cat.value && (
                      <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                        {totalItems}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Gallery Content */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <GallerySkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <AlertCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Terjadi Kesalahan
                </h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button 
                  onClick={fetchGallery}
                  className="bg-[#0066FF] hover:bg-[#0052CC] text-white"
                >
                  Coba Lagi
                </Button>
              </div>
            ) : galleryItems.length === 0 ? (
              <div className="text-center py-20">
                <ImageOff className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Tidak Ada Foto di Kategori Ini
                </h3>
                <p className="text-gray-600 mb-6">
                  Coba pilih kategori lain atau lihat semua foto
                </p>
                {selectedCategory !== 'all' && (
                  <Button
                    onClick={() => handleCategoryChange('all')}
                    variant="outline"
                    className="border-2 border-gray-200 hover:border-[#0066FF] hover:bg-[#0066FF] hover:text-white"
                  >
                    Lihat Semua Foto
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {galleryItems.map((item, index) => (
                  <FadeInSection key={item.id} delay={index * 0.05}>
                    <GalleryItemCard 
                      item={item} 
                      onOpen={openLightbox}
                    />
                  </FadeInSection>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-br from-[#0066FF] to-[#0052CC] overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <FadeInSection>
              <div className="text-center max-w-3xl mx-auto">
                <Images className="w-16 h-16 mx-auto mb-6 text-white" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                  Bagikan Momen Anda
                </h2>
                <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
                  Punya dokumentasi kegiatan atau event menarik? Bagikan dengan kami 
                  untuk ditampilkan di gallery
                </p>
                <Link href="/contact">
                  <Button 
                    size="lg"
                    className="bg-white text-[#0066FF] hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    Hubungi Kami
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </FadeInSection>
          </div>
        </section>
      </main>

      <Footer />

      {/* Lightbox Modal */}
      {selectedImage && (
        <Lightbox
          item={selectedImage}
          onClose={closeLightbox}
          onNext={showNextImage}
          onPrev={showPrevImage}
          hasNext={selectedIndex < galleryItems.length - 1}
          hasPrev={selectedIndex > 0}
        />
      )}

      <style jsx global>{`
        .bg-grid-white\/10 {
          background-image: linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </>
  );
}