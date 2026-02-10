'use client';

import { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, notFound } from 'next/navigation';  // ✅ CRITICAL: Import useParams
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

// FadeInSection (sama seperti sebelumnya)
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

// Category Colors
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

// Hitung waktu baca
const calculateReadingTime = (content) => {
  if (!content) return 1;
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export default function ArticleDetailPage() {
  // ✅ FIX 1: useParams() DI DALAM COMPONENT (wajib!)
  const params = useParams();
  const slug = params?.slug; // Ambil slug dari URL: /resources/articles/weawd → slug = 'weawd'
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readingTime, setReadingTime] = useState(1);
  const [error, setError] = useState(null);

  // ✅ FIX 2: Fetch article dengan SLUG YANG BENAR + Error Handling
  useEffect(() => {
    if (!slug) {
      console.error('[ArticleDetail] ❌ Slug tidak ditemukan:', slug);
      notFound();
      return;
    }

    const fetchArticle = async () => {
      console.log(`[ArticleDetail] 🚀 Fetching slug: "${slug}"`);
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/articles?slug=${encodeURIComponent(slug)}&status=published`, {
          cache: 'no-store', // Fresh data
          credentials: 'include',
        });

        console.log(`[ArticleDetail] 📡 Response status: ${res.status}`);

        if (!res.ok) {
          if (res.status === 404) {
            console.log(`[ArticleDetail] ❌ Article "${slug}" not found (404)`);
            notFound(); // Trigger not-found.js
            return;
          }
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        console.log('[ArticleDetail] ✅ Full API Response:', data);

        if (!data.success || !data.data) {
          console.error('[ArticleDetail] ❌ Invalid response:', data);
          throw new Error(data.error || 'Data artikel tidak valid');
        }

        // Handle single object (format baru dari API fix)
        const articleData = data.data;
        if (!articleData.title || !articleData.content) {
          throw new Error('Artikel tidak lengkap');
        }

        console.log('[ArticleDetail] 🎉 Article loaded:', articleData.title);
        setArticle(articleData);
        setReadingTime(calculateReadingTime(articleData.content));

      } catch (err) {
        console.error('[ArticleDetail] 💥 Fetch error:', err);
        setError(err.message);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]); // ✅ Dependency: re-fetch jika slug berubah

  // Loading Skeleton
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-16 lg:py-24 max-w-4xl">
            <div className="animate-pulse">
              <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 sm:p-12 md:p-16">
                <div className="h-8 bg-gray-200 rounded-lg w-64 mb-8 mx-auto" />
                <div className="bg-gray-200 h-64 md:h-96 w-full rounded-t-2xl mb-8" />
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-48" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-4/5" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Error state
  if (error || !article) {
    console.log('[ArticleDetail] ⚠️ Rendering not-found');
    notFound();
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-20 pb-16">
        <article className="container mx-auto px-4 lg:px-8 max-w-5xl">
          {/* Hero Image + Title */}
          <FadeInSection delay={0}>
            <div className="relative">
              <div className="relative h-64 md:h-96 lg:h-[500px] overflow-hidden rounded-2xl shadow-2xl mb-8">
                <Image
                  src={article.cover_image_url || article.cover_image || '/images/default-article.jpg'}
                  alt={article.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              </div>
              
              <header className="max-w-4xl mx-auto">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <Badge className={cn(
                    'text-sm px-4 py-2 font-semibold border-2 shadow-md',
                    categoryColors[article.category] || 'bg-gray-100 text-gray-700 border-gray-200'
                  )}>
                    {article.category?.toUpperCase() || 'LAINNYA'}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(article.created_at)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {readingTime} menit baca
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  {article.title}
                </h1>
                
                {article.excerpt && (
                  <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl">
                    {article.excerpt}
                  </p>
                )}
              </header>
            </div>
          </FadeInSection>

          {/* Content Utama */}
          <FadeInSection delay={0.3}>
            <div className="prose prose-lg max-w-none lg:prose-xl text-black mx-auto">
              <div className={cn(
                "prose prose-headings:font-bold prose-headings:text-gray-900",
                "prose-p:text-gray-700 prose-p:leading-relaxed",
                "prose-a:text-[#0066FF] prose-a:no-underline hover:prose-a:underline",
                "prose-strong:text-gray-900",
                "prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700",
                "prose-blockquote:border-l-4 prose-blockquote:border-[#0066FF] prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-6",
                "prose-img:rounded-xl prose-img:shadow-lg prose-hr:border-gray-300"
              )}>
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>
            </div>
          </FadeInSection>

          {/* Tags & Share */}
          <FadeInSection delay={0.5}>
            <div className="mt-16 pt-12 border-t border-gray-200">
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <Button variant="outline" className="bg-blue-600" onClick={() => window.history.back()}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
              </div>
            </div>
          </FadeInSection>
        </article>
      </main>
      <Footer />
    </>
  );
}