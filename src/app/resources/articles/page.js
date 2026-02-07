'use client';

import { useState, useEffect, useRef, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  Calendar, 
  ArrowRight, 
  Filter,
  Sparkles,
  Tag,
  Clock,
  BookOpen,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

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

// Kategori sesuai ENUM di database
const categories = [
  { value: 'all', label: 'Semua Kategori' },
  { value: 'teknologi', label: 'Teknologi' },
  { value: 'kesehatan', label: 'Kesehatan' },
  { value: 'finansial', label: 'Finansial' },
  { value: 'bisnis', label: 'Bisnis' },
  { value: 'inovasi', label: 'Inovasi' },
  { value: 'karir', label: 'Karir' },
  { value: 'keberlanjutan', label: 'Keberlanjutan' },
  { value: 'lainnya', label: 'Lainnya' },
];

// Warna badge kategori
const categoryColors = {
  teknologi: 'bg-blue-100 text-blue-700 border-blue-200',
  kesehatan: 'bg-green-100 text-green-700 border-green-200',
  finansial: 'bg-purple-100 text-purple-700 border-purple-200',
  bisnis: 'bg-orange-100 text-orange-700 border-orange-200',
  inovasi: 'bg-pink-100 text-pink-700 border-pink-200',
  karir: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  keberlanjutan: 'bg-teal-100 text-teal-700 border-teal-200',
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
      year: 'numeric',
    }).format(date);
  } catch (error) {
    return '';
  }
};

// Get badge class untuk kategori
const getCategoryBadgeClass = (category) => {
  return categoryColors[category] || categoryColors.lainnya;
};

// Article Card Component
const ArticleCard = memo(({ article, featured = false }) => {
  return (
    <Card className={cn(
      "overflow-hidden border-2 transition-all duration-300 group h-full p-0",
      featured 
        ? "border-[#0066FF] hover:shadow-2xl" 
        : "border-gray-200 hover:border-[#0066FF] hover:shadow-xl"
    )}>
      <Link href={`/resources/articles/${article.slug}`}>
        <div className="relative h-56 overflow-hidden">
          <Image
            src={article.cover_image || '/images/placeholder-article.jpg'}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute top-4 left-4 flex gap-2">
            {article.featured && (
              <Badge className="bg-[#0066FF] text-white border-0 flex items-center gap-1 shadow-lg">
                <Sparkles className="w-3 h-3" />
                Featured
              </Badge>
            )}
          </div>

          {article.category && (
            <div className="absolute bottom-4 left-4">
              <span className={cn(
                "inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize border",
                getCategoryBadgeClass(article.category)
              )}>
                {categories.find(c => c.value === article.category)?.label || article.category}
              </span>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-6">
        <Link href={`/resources/articles/${article.slug}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#0066FF] transition-colors duration-300">
            {article.title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4 text-[#0066FF]" />
            <span>{formatDate(article.published_at)}</span>
          </div>
          
          <Link href={`/resources/articles/${article.slug}`}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#0066FF] hover:text-[#0052CC] hover:bg-blue-50 group/btn p-0"
            >
              Baca
              <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
});

ArticleCard.displayName = 'ArticleCard';

// Skeleton Loading Component
const ArticleSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-56 rounded-t-lg" />
    <div className="p-6 space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-20 bg-gray-200 rounded" />
    </div>
  </div>
);

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const articlesPerPage = 9;

  // Fetch articles dari API
  useEffect(() => {
    fetchArticles();
  }, [currentPage, selectedCategory, searchQuery]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      
      // Build query params
      const params = new URLSearchParams();
      params.append('status', 'published');
      params.append('page', currentPage.toString());
      params.append('limit', articlesPerPage.toString());
      
      if (selectedCategory && selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      const response = await fetch(`/api/articles?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data artikel');
      }

      const data = await response.json();
      
      if (data.success) {
        setArticles(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        
        // Fetch featured articles (hanya di page 1 dan tanpa filter)
        if (currentPage === 1 && selectedCategory === 'all' && !searchQuery) {
          const featured = (data.data || []).filter(article => article.featured).slice(0, 3);
          setFeaturedArticles(featured);
        } else {
          setFeaturedArticles([]);
        }
      } else {
        throw new Error(data.message || 'Gagal mengambil data artikel');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error(error.message || 'Terjadi kesalahan saat mengambil data artikel');
      setArticles([]);
      setFeaturedArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handle category filter
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Render pagination buttons
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-12">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-lg border-gray-300 hover:border-[#0066FF] hover:text-[#0066FF]"
        >
          Previous
        </Button>
        
        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              className="rounded-lg border-gray-300 hover:border-[#0066FF] hover:text-[#0066FF]"
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2 text-gray-400">...</span>}
          </>
        )}
        
        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePageChange(page)}
            className={cn(
              'rounded-lg min-w-[40px]',
              currentPage === page 
                ? 'bg-[#0066FF] hover:bg-[#0052CC] text-white border-[#0066FF]' 
                : 'border-gray-300 hover:border-[#0066FF] hover:text-[#0066FF]'
            )}
          >
            {page}
          </Button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2 text-gray-400">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              className="rounded-lg border-gray-300 hover:border-[#0066FF] hover:text-[#0066FF]"
            >
              {totalPages}
            </Button>
          </>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-lg border-gray-300 hover:border-[#0066FF] hover:text-[#0066FF]"
        >
          Next
        </Button>
      </div>
    );
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
                  <BookOpen className="w-4 h-4 inline-block mr-2" />
                  Wawasan & Berita
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Artikel & Berita Terkini
                </h1>
                
                <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
                  Temukan wawasan terbaru, tren industri, dan berita teknologi yang membantu 
                  bisnis Anda berkembang di era digital
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

        {/* Search & Filter Section */}
        <section className="py-8 border-b border-gray-200 bg-white shadow-sm">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Input */}
              <div className="flex-1 w-full md:max-w-md relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari artikel..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 rounded-lg border-gray-300 focus:border-[#0066FF] focus:ring-[#0066FF]"
                />
              </div>
              
              {/* Category Filter */}
              <div className="w-full md:w-64">
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="rounded-lg border-gray-300">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4 text-[#0066FF]" />
                <span className="font-semibold">
                  {loading ? '...' : articles.length} Artikel
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Articles Section */}
        {featuredArticles.length > 0 && (
          <section className="py-16 lg:py-20">
            <div className="container mx-auto max-w-7xl px-6 lg:px-8">
              <FadeInSection>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Artikel Unggulan</h2>
                  <p className="text-gray-600">Artikel pilihan yang wajib Anda baca</p>
                </div>
              </FadeInSection>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredArticles.map((article, index) => (
                  <FadeInSection key={article.id} delay={index * 0.1}>
                    <ArticleCard article={article} featured={true} />
                  </FadeInSection>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Articles Section */}
        <section className="py-16 lg:py-20 bg-gray-50">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedCategory !== 'all' 
                    ? `Artikel ${categories.find(c => c.value === selectedCategory)?.label}` 
                    : 'Semua Artikel'}
                </h2>
                <p className="text-gray-600">
                  {searchQuery 
                    ? `Hasil pencarian untuk "${searchQuery}"` 
                    : 'Jelajahi artikel terbaru kami'}
                </p>
              </div>
            </FadeInSection>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <ArticleSkeleton key={i} />
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Artikel Tidak Ditemukan
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || selectedCategory !== 'all'
                    ? 'Coba ubah kata kunci atau filter pencarian Anda'
                    : 'Belum ada artikel yang dipublikasikan'}
                </p>
                {(searchQuery || selectedCategory !== 'all') && (
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setCurrentPage(1);
                    }}
                    className="bg-[#0066FF] hover:bg-[#0052CC] rounded-lg shadow-lg"
                  >
                    Reset Filter
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {articles.map((article, index) => (
                    <FadeInSection key={article.id} delay={index * 0.1}>
                      <ArticleCard article={article} />
                    </FadeInSection>
                  ))}
                </div>

                {/* Pagination */}
                {renderPagination()}
              </>
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
                <BookOpen className="w-16 h-16 mx-auto mb-6 text-white" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                  Ingin Berkontribusi?
                </h2>
                <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
                  Bagikan wawasan dan pengalaman Anda dengan komunitas kami. 
                  Hubungi kami untuk menjadi kontributor artikel.
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