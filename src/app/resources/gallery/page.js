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
  Maximize2,
  Grid3x3,
  Filter,
  Calendar,
  User,
  Tag,
  ZoomIn,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
    link.href = currentImage.imageUrl;
    link.download = `barcomp-${currentImage.id}.jpg`;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentImage.title,
          text: currentImage.description,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Navigation Buttons */}
      {currentIndex > 0 && (
        <button
          onClick={onPrev}
          className="absolute left-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
      )}

      {currentIndex < images.length - 1 && (
        <button
          onClick={onNext}
          className="absolute right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      )}

      {/* Image */}
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <div className="relative max-w-7xl max-h-full">
          <Image
            src={currentImage.imageUrl}
            alt={currentImage.title}
            width={currentImage.dimensions.width}
            height={currentImage.dimensions.height}
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
              <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                {currentImage.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  {currentImage.photographer}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(currentImage.capturedAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="px-2 py-1 bg-white/10 rounded-full capitalize">
                  {currentImage.category}
                </span>
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

// Gallery Item Component with optimized Next/Image
const GalleryItem = memo(({ image, onClick }) => {
  return (
    <Card 
      className="group relative overflow-hidden cursor-pointer border-0 shadow-md hover:shadow-2xl transition-all duration-300 p-0"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image.thumbnailUrl}
          alt={image.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-lg font-bold mb-1 line-clamp-1">
              {image.title}
            </h3>
            <p className="text-xs text-gray-300 line-clamp-2 mb-2">
              {image.description}
            </p>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 bg-white/20 rounded-full capitalize">
                {image.category}
              </span>
              {image.featured && (
                <span className="px-2 py-1 bg-[#0066FF] rounded-full">
                  Featured
                </span>
              )}
            </div>
          </div>
          
          {/* Zoom Icon */}
          <div className="absolute top-4 right-4">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
              <ZoomIn className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
});

GalleryItem.displayName = 'GalleryItem';

// Category Tabs Component
const CategoryTabs = memo(({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={() => onCategoryChange('all')}
        className={cn(
          "px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2",
          activeCategory === 'all'
            ? "bg-[#0066FF] text-white shadow-lg scale-105"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        )}
      >
        <Grid3x3 className="w-4 h-4" />
        Semua
        <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
          {categories.reduce((sum, cat) => sum + cat.count, 0)}
        </span>
      </button>
      
      {categories.map((category) => (
        <button
          key={category.slug}
          onClick={() => onCategoryChange(category.slug)}
          className={cn(
            "px-6 py-3 rounded-full font-semibold transition-all duration-300",
            activeCategory === category.slug
              ? "bg-[#0066FF] text-white shadow-lg scale-105"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          {category.name}
          <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
            {category.count}
          </span>
        </button>
      ))}
    </div>
  );
});

CategoryTabs.displayName = 'CategoryTabs';

// Main Gallery Page Component
export default function GalleryPage() {
  const [language, setLanguage] = useState('id');
  const [activeCategory, setActiveCategory] = useState('all');
  const [galleryItems, setGalleryItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Translations
  const t = {
    id: {
      hero: {
        badge: 'Dokumentasi Kegiatan',
        title: 'Galeri Foto & Momen Berharga',
        subtitle: 'Jelajahi koleksi foto dari berbagai event, aktivitas kantor, pencapaian tim, dan momen-momen berkesan lainnya.'
      },
      filter: {
        title: 'Kategori'
      },
      stats: {
        photos: 'Foto',
        events: 'Event',
        years: 'Tahun'
      },
      cta: {
        title: 'Ingin Bagikan Momen Anda?',
        subtitle: 'Kami senang melihat momen-momen dari komunitas kami. Kirimkan foto Anda untuk ditampilkan di galeri.',
        button: 'Kirim Foto'
      }
    },
    en: {
      hero: {
        badge: 'Activity Documentation',
        title: 'Photo Gallery & Precious Moments',
        subtitle: 'Explore our collection of photos from various events, office activities, team achievements, and other memorable moments.'
      },
      filter: {
        title: 'Categories'
      },
      stats: {
        photos: 'Photos',
        events: 'Events',
        years: 'Years'
      },
      cta: {
        title: 'Want to Share Your Moments?',
        subtitle: 'We love seeing moments from our community. Submit your photos to be featured in the gallery.',
        button: 'Submit Photo'
      }
    }
  };

  const content = t[language];

  // Mock data - Replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Mock gallery items
      const mockGallery = [
        {
          id: 'gal-001',
          title: 'Team Building 2025 - Outdoor Activity',
          description: 'Our annual team building event at Puncak, promoting collaboration and team spirit.',
          imageUrl: 'https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=1920&h=1280&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=400&h=300&fit=crop',
          category: 'events',
          tags: ['team building', '2025', 'outdoor'],
          dimensions: { width: 1920, height: 1280 },
          photographer: 'Ahmad Rifai',
          capturedAt: '2025-01-10T14:30:00Z',
          featured: true
        },
        {
          id: 'gal-002',
          title: 'Modern Office Space - Innovation Hub',
          description: 'Our newly renovated innovation hub designed for collaborative work.',
          imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=2400&h=1600&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=300&fit=crop',
          category: 'office',
          tags: ['office', 'workspace', 'innovation'],
          dimensions: { width: 2400, height: 1600 },
          photographer: 'Studio Kreativ',
          capturedAt: '2025-01-05T11:00:00Z',
          featured: true
        },
        {
          id: 'gal-003',
          title: 'Product Launch Event 2024',
          description: 'Successful launch of our new cloud platform solution.',
          imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=2048&h=1365&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
          category: 'events',
          tags: ['product launch', 'event', '2024'],
          dimensions: { width: 2048, height: 1365 },
          photographer: 'Sarah Lee',
          capturedAt: '2024-11-20T18:00:00Z',
          featured: false
        },
        {
          id: 'gal-004',
          title: 'Development Team - Sprint Planning',
          description: 'Our development team during sprint planning session.',
          imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1920&h=1280&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop',
          category: 'team',
          tags: ['team', 'development', 'agile'],
          dimensions: { width: 1920, height: 1280 },
          photographer: 'Michael Chen',
          capturedAt: '2025-01-15T10:00:00Z',
          featured: false
        },
        {
          id: 'gal-005',
          title: 'Best Startup Award 2024',
          description: 'Receiving the Best Digital Solution Startup award.',
          imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=1280&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
          category: 'awards',
          tags: ['award', 'achievement', '2024'],
          dimensions: { width: 1920, height: 1280 },
          photographer: 'Event Photographer',
          capturedAt: '2024-12-15T19:30:00Z',
          featured: true
        },
        {
          id: 'gal-006',
          title: 'Client Project - E-commerce Platform',
          description: 'Successful deployment of custom e-commerce solution for major client.',
          imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=2400&h=1600&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
          category: 'projects',
          tags: ['project', 'e-commerce', 'success'],
          dimensions: { width: 2400, height: 1600 },
          photographer: 'David Wong',
          capturedAt: '2024-10-08T14:00:00Z',
          featured: false
        },
        {
          id: 'gal-007',
          title: 'Behind the Scenes - Content Creation',
          description: 'Creating engaging content for our digital marketing campaign.',
          imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1920&h=1080&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
          category: 'behind-the-scenes',
          tags: ['bts', 'content', 'marketing'],
          dimensions: { width: 1920, height: 1080 },
          photographer: 'Lisa Anderson',
          capturedAt: '2025-01-08T15:45:00Z',
          featured: false
        },
        {
          id: 'gal-008',
          title: 'New Office Opening Ceremony',
          description: 'Grand opening of our expanded office space in Cikarang.',
          imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=2048&h=1365&fit=crop',
          thumbnailUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop',
          category: 'events',
          tags: ['office', 'opening', 'milestone'],
          dimensions: { width: 2048, height: 1365 },
          photographer: 'Pro Photography Studio',
          capturedAt: '2024-09-01T10:00:00Z',
          featured: true
        }
      ];

      // Mock categories
      const mockCategories = [
        { id: 'cat-001', name: 'Events', slug: 'events', count: 45 },
        { id: 'cat-002', name: 'Office', slug: 'office', count: 28 },
        { id: 'cat-003', name: 'Team', slug: 'team', count: 32 },
        { id: 'cat-004', name: 'Projects', slug: 'projects', count: 18 },
        { id: 'cat-005', name: 'Awards', slug: 'awards', count: 12 },
        { id: 'cat-006', name: 'Behind the Scenes', slug: 'behind-the-scenes', count: 20 }
      ];

      setTimeout(() => {
        setGalleryItems(mockGallery);
        setCategories(mockCategories);
        setLoading(false);
      }, 500);
    };

    fetchData();
  }, []);

  // Filter gallery items
  const filteredItems = galleryItems.filter(item => 
    activeCategory === 'all' || item.category === activeCategory
  );

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
  const uniqueEvents = new Set(galleryItems.filter(item => item.category === 'events').map(item => item.id)).size;
  const yearsActive = new Date().getFullYear() - 2015;

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
                  {content.hero.badge}
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  {content.hero.title}
                </h1>
                
                <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
                  {content.hero.subtitle}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                    <div className="text-3xl font-bold text-white mb-2">
                      {totalPhotos}+
                    </div>
                    <div className="text-sm text-white/80">{content.stats.photos}</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                    <div className="text-3xl font-bold text-white mb-2">
                      {uniqueEvents}+
                    </div>
                    <div className="text-sm text-white/80">{content.stats.events}</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                    <div className="text-3xl font-bold text-white mb-2">
                      {yearsActive}
                    </div>
                    <div className="text-sm text-white/80">{content.stats.years}</div>
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
        <section className="py-12 bg-gray-50 shadow-sm">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="text-xl font-bold text-gray-900">
                  {content.filter.title}
                </h3>
              </div>

            </div>

            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-[4/3] rounded-lg" />
                  </div>
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20">
                <Camera className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-xl text-gray-500">Tidak ada foto ditemukan</p>
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
                  {content.cta.title}
                </h2>
                <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
                  {content.cta.subtitle}
                </p>
                <a href="mailto:gallery@barcomp.co.id">
                  <Button 
                    size="lg"
                    className="bg-white text-[#0066FF] hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    {content.cta.button}
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