'use client';

import { useState, useEffect, useRef, memo, useCallback } from 'react';
import Image from 'next/image';
import { 
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Filter,
  Calendar,
  Tag,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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

// Categories sesuai ENUM database
const categories = [
  { value: 'all', label: 'Semua Kategori' },
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

// Format tanggal Indonesia
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    return '';
  }
};

// Category Tabs Component
const CategoryTabs = memo(({ activeCategory, onCategoryChange, categoryCounts }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const count = categoryCounts[cat.value] || 0;
        const isActive = activeCategory === cat.value;
        
        return (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={cn(
              "px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center gap-2",
              isActive
                ? "bg-[#0066FF] text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            )}
          >
            {cat.label}
            {cat.value === 'all' && count > 0 && (
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs",
                isActive ? "bg-white/20" : "bg-gray-200"
              )}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
});

CategoryTabs.displayName = 'CategoryTabs';

// Lightbox Component
const Lightbox = memo(({ images, currentIndex, onClose, onNext, onPrev }) => {
  const currentImage = images[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onNext, onPrev]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage.image_url;
    link.download = `barcomp-${currentImage.id}.jpg`;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentImage.title,
          text: currentImage.description || currentImage.title,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link disalin ke clipboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Close"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Navigation Buttons */}
      {currentIndex > 0 && (
        <button
          onClick={onPrev}
          className="absolute left-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
      )}

      {currentIndex < images.length - 1 && (
        <button
          onClick={onNext}
          className="absolute right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      )}

      {/* Image */}
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <div className="relative max-w-7xl max-h-full">
          <Image
            src={currentImage.image_url || currentImage.thumbnail_url}
            alt={currentImage.title}
            width={1200}
            height={800}
            className="object-contain max-h-[85vh] w-auto"
            priority
          />
        </div>
      </div>

      {/* Image Info & Actions */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-end justify-between">
            <div className="text-white flex-1">
              <h3 className="text-xl font-bold mb-2">{currentImage.title}</h3>
              {currentImage.description && (
                <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                  {currentImage.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(currentImage.captured_at)}
                </span>
                {currentImage.category && (
                  <span className="px-2 py-1 bg-white/10 rounded-full capitalize">
                    {categories.find(c => c.value === currentImage.category)?.label || currentImage.category}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2 ml-4">
              <button
                onClick={handleShare}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title="Share"
              >
                <Share2 className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={handleDownload}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Image Counter */}
          <div className="text-center mt-4">
            <span className="text-sm text-gray-400">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

Lightbox.displayName = 'Lightbox';

// Gallery Item Component
const GalleryItem = memo(({ image, onClick }) => {
  return (
    <Card 
      className="group relative overflow-hidden cursor-pointer border-0 shadow-md hover:shadow-2xl transition-all duration-300 p-0"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image.thumbnail_url || image.image_url}
          alt={image.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
              {image.title}
            </h3>
            {image.category && (
              <Badge className="bg-[#0066FF] text-white border-0 text-xs">
                {categories.find(c => c.value === image.category)?.label || image.category}
              </Badge>
            )}
          </div>
        </div>

        {/* Featured Badge */}
        {image.featured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-yellow-500 text-white border-0 shadow-lg text-xs">
              Featured
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
});

GalleryItem.displayName = 'GalleryItem';

// Skeleton Loading
const GallerySkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 aspect-[4/3] rounded-lg" />
  </div>
);

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch gallery dari API
  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/gallery');
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data gallery');
      }

      const data = await response.json();
      
      if (data.success) {
        // Filter hanya yang tidak soft-deleted (deleted_at = NULL)
        const activeImages = (data.data || []).filter(item => !item.deleted_at);
        // Sort by display_order, then featured, then captured_at
        const sorted = activeImages.sort((a, b) => {
          if (a.display_order !== b.display_order) {
            return a.display_order - b.display_order;
          }
          if (a.featured !== b.featured) {
            return b.featured - a.featured; // featured first
          }
          return new Date(b.captured_at) - new Date(a.captured_at);
        });
        setGalleryItems(sorted);
      } else {
        throw new Error(data.message || 'Gagal mengambil data gallery');
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
      toast.error(error.message || 'Terjadi kesalahan saat mengambil data gallery');
      setGalleryItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter gallery items
  const filteredItems = galleryItems.filter(item => 
    activeCategory === 'all' || item.category === activeCategory
  );

  // Calculate category counts
  const categoryCounts = {
    all: galleryItems.length,
    ...galleryItems.reduce((acc, item) => {
      if (item.category) {
        acc[item.category] = (acc[item.category] || 0) + 1;
      }
      return acc;
    }, {})
  };

  // Lightbox handlers
  const openLightbox = useCallback((index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => 
      prev < filteredItems.length - 1 ? prev + 1 : prev
    );
  }, [filteredItems.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => prev > 0 ? prev - 1 : prev);
  }, []);

  // Calculate stats
  const totalPhotos = galleryItems.length;
  const featuredPhotos = galleryItems.filter(item => item.featured).length;
  const categoriesCount = new Set(galleryItems.map(item => item.category).filter(Boolean)).size;

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
                  <Camera className="w-4 h-4 inline-block mr-2" />
                  Galeri Foto
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Galeri Barcomp
                </h1>
                
                <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
                  Dokumentasi perjalanan, momen berharga, dan pencapaian kami dalam 
                  melayani berbagai industri dan komunitas
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                    <div className="text-3xl font-bold text-white mb-2">
                      {totalPhotos}+
                    </div>
                    <div className="text-sm text-white/80">Total Foto</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                    <div className="text-3xl font-bold text-white mb-2">
                      {featuredPhotos}+
                    </div>
                    <div className="text-sm text-white/80">Foto Unggulan</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                    <div className="text-3xl font-bold text-white mb-2">
                      {categoriesCount}
                    </div>
                    <div className="text-sm text-white/80">Kategori</div>
                  </div>
                </div>
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
        <section className="py-12 bg-gray-50 border-b border-gray-200">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="flex items-center gap-3 mb-6">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  Filter Kategori
                </h3>
              </div>

              <CategoryTabs
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                categoryCounts={categoryCounts}
              />
            </FadeInSection>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {activeCategory === 'all' 
                    ? 'Semua Foto' 
                    : categories.find(c => c.value === activeCategory)?.label}
                </h2>
                <p className="text-gray-600">
                  {filteredItems.length} foto ditemukan
                </p>
              </div>
            </FadeInSection>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <GallerySkeleton key={i} />
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20">
                <Camera className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Tidak Ada Foto
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeCategory === 'all'
                    ? 'Belum ada foto yang tersedia'
                    : 'Tidak ada foto dalam kategori ini'}
                </p>
                {activeCategory !== 'all' && (
                  <Button
                    onClick={() => setActiveCategory('all')}
                    className="bg-[#0066FF] hover:bg-[#0052CC] rounded-lg"
                  >
                    Lihat Semua Foto
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item, index) => (
                  <FadeInSection key={item.id} delay={index * 0.03}>
                    <GalleryItem 
                      image={item} 
                      onClick={() => openLightbox(index)}
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
                <Camera className="w-16 h-16 mx-auto mb-6 text-white" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                  Ingin Berbagi Momen?
                </h2>
                <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
                  Kirimkan foto dan dokumentasi acara Anda untuk ditampilkan di galeri kami
                </p>
                <a href="mailto:gallery@barcomp.co.id">
                  <Button 
                    size="lg"
                    className="bg-white text-[#0066FF] hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    Hubungi Kami
                    <ChevronRightIcon className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>
            </FadeInSection>
          </div>
        </section>
      </main>

      <Footer />

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={filteredItems}
          currentIndex={currentImageIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
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