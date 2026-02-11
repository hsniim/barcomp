// app/resources/articles/page.js
'use client';

import { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpen,
  Search,
  Filter,
  Calendar,
  ChevronRight,
  FileText,
  Sparkles,
  Tag,
  Clock,
  AlertCircle
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

// Article Card Component
const ArticleCard = memo(({ article }) => {
  return (
    <Card className={cn(
      "overflow-hidden border-2 transition-all duration-300 group h-full p-0",
      "border-gray-200 hover:border-[#0066FF] hover:shadow-xl"
    )}>
      <Link href={`/resources/articles/${article.slug}`}>
        <div className="relative h-56 overflow-hidden">
          <Image
            src={article.cover_image || '/images/default-article.jpg'}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {article.category && (
            <div className="absolute top-4 left-4">
              <Badge className={cn(
                "border",
                categoryColors[article.category] || categoryColors.lainnya
              )}>
                <Tag className="w-3 h-3 mr-1" />
                {article.category}
              </Badge>
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

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4 text-[#0066FF]" />
            <span>{formatDate(article.published_at || article.created_at)}</span>
          </div>
          
          <Link 
            href={`/resources/articles/${article.slug}`}
            className="text-[#0066FF] hover:text-[#0052CC] font-semibold text-sm flex items-center gap-1 transition-colors"
          >
            Baca
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
});

ArticleCard.displayName = 'ArticleCard';

// Article Skeleton
const ArticleSkeleton = () => (
  <Card className="overflow-hidden h-full p-0">
    <div className="animate-pulse">
      <div className="bg-gray-200 h-56 w-full" />
      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
        <div className="flex justify-between items-center pt-4">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  </Card>
);

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    search: '',
    page: 1,
    limit: 9
  });
  const [totalArticles, setTotalArticles] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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

  useEffect(() => {
    fetchArticles();
  }, [filters]);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        status: 'published',
        page: filters.page.toString(),
        limit: filters.limit.toString(),
      });

      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }

      if (filters.search.trim()) {
        params.append('search', filters.search.trim());
      }

      const url = `/api/articles?${params.toString()}`;
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      if (data.success) {
        setArticles(data.data || []);
        setTotalArticles(data.total || 0);
        setTotalPages(data.totalPages || 0);
      } else {
        throw new Error(data.error || 'Gagal memuat artikel');
      }

    } catch (err) {
      console.error('[ArticlesPage] Fetch error:', err);
      setError(err.message);
      setArticles([]);
      setTotalArticles(0);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setFilters(prev => ({ ...prev, category, page: 1 }));
  };

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setFilters({ category: 'all', search: '', page: 1, limit: 9 });
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
                  Resources & Artikel
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Artikel & Insights
                </h1>
                
                <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
                  Temukan {totalArticles} artikel terbaru seputar teknologi, bisnis, dan inovasi 
                  untuk meningkatkan pengetahuan Anda
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

        {/* Filters Section */}
        <section className="py-8 border-b border-gray-200 bg-white shadow-sm">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Category Filter */}
                <div className="relative flex-shrink-0">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filters.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent bg-white font-medium text-gray-700 min-w-[200px] appearance-none cursor-pointer transition-all hover:border-[#0066FF]"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 text-black -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari artikel..."
                    value={filters.search}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-3 border-2 text-black border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all hover:border-[#0066FF]"
                  />
                </div>

                {/* Reset Button - Only show if filters are active */}
                {(filters.category !== 'all' || filters.search) && (
                  <Button
                    onClick={handleResetFilters}
                    variant="outline"
                    className="border-2 border-gray-200 hover:border-[#0066FF] hover:bg-[#0066FF] hover:text-white transition-all"
                  >
                    Reset Filter
                  </Button>
                )}
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Articles Content */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <ArticleSkeleton key={i} />
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
                  onClick={fetchArticles}
                  className="bg-[#0066FF] hover:bg-[#0052CC] text-white"
                >
                  Coba Lagi
                </Button>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Tidak Ada Artikel Ditemukan
                </h3>
                <p className="text-gray-600 mb-6">
                  Coba ubah filter atau kata kunci pencarian Anda
                </p>
                {(filters.category !== 'all' || filters.search) && (
                  <Button
                    onClick={handleResetFilters}
                    variant="outline"
                    className="border-2 border-gray-200 hover:border-[#0066FF] hover:bg-[#0066FF] hover:text-white"
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
                {totalPages > 1 && (
                  <FadeInSection delay={0.2}>
                    <div className="mt-12 flex justify-center items-center gap-2">
                      <Button
                        onClick={() => handlePageChange(filters.page - 1)}
                        disabled={filters.page === 1}
                        variant="outline"
                        className="border-2 border-gray-200 hover:border-[#0066FF] hover:bg-[#0066FF] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-900 disabled:hover:border-gray-200"
                      >
                        <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
                        Prev
                      </Button>

                      <div className="flex gap-2">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let page;
                          if (totalPages <= 5) {
                            page = i + 1;
                          } else if (filters.page <= 3) {
                            page = i + 1;
                          } else if (filters.page >= totalPages - 2) {
                            page = totalPages - 4 + i;
                          } else {
                            page = filters.page - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={cn(
                                "min-w-[40px]",
                                page === filters.page
                                  ? "bg-[#0066FF] text-white hover:bg-[#0052CC]"
                                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-[#0066FF] hover:bg-gray-50"
                              )}
                            >
                              {page}
                            </Button>
                          );
                        })}
                      </div>

                      <Button
                        onClick={() => handlePageChange(filters.page + 1)}
                        disabled={filters.page === totalPages}
                        variant="outline"
                        className="border-2 border-gray-200 hover:border-[#0066FF] hover:bg-[#0066FF] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-900 disabled:hover:border-gray-200"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </FadeInSection>
                )}
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
                <Sparkles className="w-16 h-16 mx-auto mb-6 text-white" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                  Ingin Berkontribusi?
                </h2>
                <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
                  Bagikan pengetahuan dan pengalaman Anda dengan menulis artikel 
                  untuk komunitas kami
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