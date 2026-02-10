'use client';

import { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, notFound } from 'next/navigation';
import { 
  Calendar,
  Clock,
  ChevronLeft,
  Tag,
  AlertCircle,
  FileText,
  Share2,
  Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Fade-in Animation Component (sama dengan list page)
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

// Category Badge Colors (sama dengan list page)
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

// Format tanggal Indonesia (sama dengan list page)
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

// Estimasi waktu baca
const calculateReadingTime = (content) => {
  if (!content) return 1;
  // Rata-rata orang membaca 200 kata per menit
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes;
};

// Article Skeleton
const ArticleSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-64 md:h-96 w-full rounded-t-2xl" />
    <div className="p-6 md:p-10 lg:p-12 space-y-6">
      <div className="flex gap-3">
        <div className="h-6 bg-gray-200 rounded w-24" />
        <div className="h-6 bg-gray-200 rounded w-20" />
      </div>
      <div className="h-10 bg-gray-200 rounded w-3/4" />
      <div className="flex gap-6">
        <div className="h-5 bg-gray-200 rounded w-32" />
        <div className="h-5 bg-gray-200 rounded w-28" />
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
    </div>
  </div>
);

export default function ArticleDetailPage() {
  const params = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params?.slug) {
      fetchArticle(params.slug);
    }
  }, [params?.slug]);

  const fetchArticle = async (slug) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/articles?slug=${slug}&status=published`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('notfound');
          return;
        }
        throw new Error('Gagal memuat artikel');
      }

      const data = await response.json();
      
      if (!data.success || !data.data || data.data.length === 0) {
        setError('notfound');
        return;
      }

      setArticle(data.data[0]);
    } catch (err) {
      console.error('Error fetching article:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-12 lg:py-16 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <ArticleSkeleton />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Error 404
  if (error === 'notfound' || !article) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-12 lg:py-16 max-w-4xl">
          <FadeInSection>
            <div className="text-center py-20">
              <FileText className="w-20 h-20 mx-auto text-gray-300 mb-6" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Artikel Tidak Ditemukan
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Maaf, artikel yang Anda cari tidak ditemukan atau sudah dihapus
              </p>
              <Link href="/resources/articles">
                <Button 
                  size="lg"
                  className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-8 shadow-lg hover:shadow-xl transition-all"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Kembali ke Daftar Artikel
                </Button>
              </Link>
            </div>
          </FadeInSection>
        </main>
        <Footer />
      </>
    );
  }

  // Error lainnya
  if (error) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-12 lg:py-16 max-w-4xl">
          <FadeInSection>
            <div className="text-center py-20">
              <AlertCircle className="w-20 h-20 mx-auto text-red-400 mb-6" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Terjadi Kesalahan
              </h1>
              <p className="text-lg text-gray-600 mb-8">{error}</p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => fetchArticle(params.slug)}
                  className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-8 shadow-lg hover:shadow-xl transition-all"
                >
                  Coba Lagi
                </Button>
                <Link href="/resources/articles">
                  <Button 
                    variant="outline"
                    className="border-2 border-gray-200 hover:border-[#0066FF] hover:bg-gray-50 px-8"
                  >
                    Kembali
                  </Button>
                </Link>
              </div>
            </div>
          </FadeInSection>
        </main>
        <Footer />
      </>
    );
  }

  // Parse tags jika dalam bentuk string JSON
  let tags = [];
  if (article.tags) {
    try {
      tags = typeof article.tags === 'string' ? JSON.parse(article.tags) : article.tags;
    } catch (e) {
      tags = [];
    }
  }

  const readingTime = calculateReadingTime(article.content);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        {/* Back Button - Fixed position */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto max-w-4xl px-4 py-4">
            <Link href="/resources/articles">
              <Button 
                variant="outline" 
                className="border-2 border-gray-200 hover:border-[#0066FF] hover:bg-gray-50 transition-all"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Kembali ke Artikel Lainnya
              </Button>
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 lg:py-12 max-w-4xl">
          <FadeInSection>
            <article className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200">
              {/* Hero / Cover Image */}
              {article.cover_image && (
                <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
                  <Image
                    src={article.cover_image}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 896px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Category badge on image */}
                  {article.category && (
                    <div className="absolute top-6 left-6">
                      <Badge className={cn(
                        "border text-base py-2 px-4",
                        categoryColors[article.category] || categoryColors.lainnya
                      )}>
                        <Tag className="w-4 h-4 mr-2" />
                        {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                      </Badge>
                    </div>
                  )}
                </div>
              )}

              <div className="p-6 sm:p-8 md:p-10 lg:p-12">
                {/* Meta Info */}
                <FadeInSection delay={0.1}>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {!article.cover_image && article.category && (
                      <Badge className={cn(
                        "border",
                        categoryColors[article.category] || categoryColors.lainnya
                      )}>
                        <Tag className="w-3 h-3 mr-1" />
                        {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                      </Badge>
                    )}
                    {tags && tags.length > 0 && tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="border-gray-300 text-gray-600 hover:border-[#0066FF] hover:text-[#0066FF] transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </FadeInSection>

                {/* Title */}
                <FadeInSection delay={0.2}>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    {article.title}
                  </h1>
                </FadeInSection>

                {/* Date & Reading Time */}
                <FadeInSection delay={0.3}>
                  <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#0066FF]" />
                      <time className="text-sm sm:text-base">
                        {formatDate(article.published_at || article.created_at)}
                      </time>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#0066FF]" />
                      <span className="text-sm sm:text-base">{readingTime} menit baca</span>
                    </div>
                  </div>
                </FadeInSection>

                {/* Excerpt */}
                {article.excerpt && (
                  <FadeInSection delay={0.4}>
                    <div className="bg-gray-50 border-l-4 border-[#0066FF] p-6 rounded-r-lg mb-10">
                      <p className="text-lg sm:text-xl text-gray-700 leading-relaxed font-medium">
                        {article.excerpt}
                      </p>
                    </div>
                  </FadeInSection>
                )}

                {/* Main Content */}
                <FadeInSection delay={0.5}>
                  <div className="prose prose-lg max-w-none 
                    prose-headings:font-bold prose-headings:text-gray-900
                    prose-p:text-gray-700 prose-p:leading-relaxed
                    prose-a:text-[#0066FF] prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900
                    prose-ul:text-gray-700
                    prose-ol:text-gray-700
                    prose-li:text-gray-700
                    prose-blockquote:border-l-4 prose-blockquote:border-[#0066FF] prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-6
                    prose-img:rounded-xl prose-img:shadow-lg
                    prose-hr:border-gray-300
                  ">
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                  </div>
                </FadeInSection>

                {/* Social Share & Actions */}
                <FadeInSection delay={0.6}>
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        className="border-2 border-gray-200 hover:border-[#0066FF] hover:bg-gray-50 transition-all"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: article.title,
                              text: article.excerpt,
                              url: window.location.href,
                            });
                          }
                        }}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Bagikan
                      </Button>
                      <Button
                        variant="outline"
                        className="border-2 border-gray-200 hover:border-[#0066FF] hover:bg-gray-50 transition-all"
                      >
                        <Bookmark className="w-4 h-4 mr-2" />
                        Simpan
                      </Button>
                    </div>
                  </div>
                </FadeInSection>

                {/* Back to List Button */}
                <FadeInSection delay={0.7}>
                  <div className="mt-8">
                    <Link href="/resources/articles">
                      <Button 
                        size="lg"
                        className="w-full sm:w-auto bg-[#0066FF] hover:bg-[#0052CC] text-white px-8 shadow-lg hover:shadow-xl transition-all"
                      >
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Lihat Artikel Lainnya
                      </Button>
                    </Link>
                  </div>
                </FadeInSection>
              </div>
            </article>
          </FadeInSection>
        </div>
      </main>

      <Footer />
    </>
  );
}