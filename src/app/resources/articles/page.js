'use client';

import { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpen,
  Calendar,
  Clock,
  Eye,
  ArrowRight,
  Search,
  Filter,
  TrendingUp,
  Sparkles,
  ChevronRight,
  User,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

// Featured Article Card Component
const FeaturedArticleCard = memo(({ article }) => {
  return (
    <Card className="overflow-hidden border-2 border-[#0066FF] hover:shadow-2xl transition-all duration-300 group p-0">
      <div className="relative h-[400px] overflow-hidden">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-[#0066FF] text-white text-xs font-semibold rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Featured
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-4 mb-3 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(article.publishedAt).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {article.readTime} min read
            </span>
          </div>
          
          <h3 className="text-2xl font-bold mb-2 line-clamp-2">
            {article.title}
          </h3>
          
          <p className="text-gray-200 mb-4 line-clamp-2">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold">{article.author.name}</p>
                <p className="text-xs text-gray-300">{article.author.role}</p>
              </div>
            </div>

            <Link href={`/resources/articles/${article.slug}`}>
              <Button 
                size="sm"
                className="bg-white text-[#0066FF] hover:bg-gray-100"
              >
                Baca Artikel
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
});

FeaturedArticleCard.displayName = 'FeaturedArticleCard';

// Article Card Component
const ArticleCard = memo(({ article }) => {
  return (
    <Card className="overflow-hidden border-gray-200 hover:border-[#0066FF] hover:shadow-xl transition-all duration-300 group h-full p-0">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <span className={cn(
            "px-2 py-1 text-xs font-semibold rounded-full",
            article.category === 'technology' && "bg-blue-100 text-blue-700",
            article.category === 'business' && "bg-green-100 text-green-700",
            article.category === 'tutorial' && "bg-purple-100 text-purple-700",
            article.category === 'news' && "bg-red-100 text-red-700",
            article.category === 'case-study' && "bg-yellow-100 text-yellow-700"
          )}>
            {article.category}
          </span>
        </div>
      </div>

      <CardContent className="p-0">
        <div className="px-5 pt-5">
          <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(article.publishedAt).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime} min
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.views.toLocaleString()}
            </span>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#0066FF] transition-colors duration-300">
            {article.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {article.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between px-5 pb-5 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                width={24}
                height={24}
                className="object-cover"
              />
            </div>
            <span className="text-xs text-gray-600">{article.author.name}</span>
          </div>

          <Link href={`/resources/articles/${article.slug}`}>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-[#0066FF] hover:text-[#0052CC] p-0 h-auto"
            >
              Baca
              <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
});

ArticleCard.displayName = 'ArticleCard';

// Category Filter Component
const CategoryFilter = memo(({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => onCategoryChange('all')}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300",
          activeCategory === 'all'
            ? "bg-[#0066FF] text-white shadow-lg"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        )}
      >
        Semua Artikel
      </button>
      {categories.map((category) => (
        <button
          key={category.slug}
          onClick={() => onCategoryChange(category.slug)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300",
            activeCategory === category.slug
              ? "bg-[#0066FF] text-white shadow-lg"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          {category.name} ({category.count})
        </button>
      ))}
    </div>
  );
});

CategoryFilter.displayName = 'CategoryFilter';

// Main Articles Page Component
export default function ArticlesPage() {
  const [language, setLanguage] = useState('id');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [articles, setArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Translations
  const t = {
    id: {
      hero: {
        badge: 'Wawasan & Berita',
        title: 'Artikel & Berita Terkini',
        subtitle: 'Temukan insights, tutorial, dan berita terbaru seputar teknologi, bisnis digital, dan inovasi dari tim Barcomp.',
        searchPlaceholder: 'Cari artikel...'
      },
      featured: {
        title: 'Artikel Unggulan'
      },
      filter: {
        title: 'Jelajahi Berdasarkan Kategori'
      },
      articles: {
        title: 'Semua Artikel',
        noResults: 'Tidak ada artikel ditemukan',
        loadMore: 'Muat Lebih Banyak'
      },
      cta: {
        title: 'Ingin Berkontribusi?',
        subtitle: 'Kami selalu terbuka untuk berbagi wawasan dan pengalaman. Hubungi kami jika Anda tertarik untuk berkontribusi menulis artikel.',
        button: 'Hubungi Kami'
      }
    },
    en: {
      hero: {
        badge: 'Insights & News',
        title: 'Latest Articles & News',
        subtitle: 'Discover insights, tutorials, and latest news about technology, digital business, and innovation from Barcomp team.',
        searchPlaceholder: 'Search articles...'
      },
      featured: {
        title: 'Featured Articles'
      },
      filter: {
        title: 'Browse by Category'
      },
      articles: {
        title: 'All Articles',
        noResults: 'No articles found',
        loadMore: 'Load More'
      },
      cta: {
        title: 'Want to Contribute?',
        subtitle: 'We are always open to share insights and experiences. Contact us if you are interested in contributing articles.',
        button: 'Contact Us'
      }
    }
  };

  const content = t[language];

  // Mock data - Replace with actual API calls
  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setLoading(true);
      
      // Mock featured articles
      const mockFeatured = [
        {
          id: 'art-001',
          title: 'Transformasi Digital: Kunci Kesuksesan Bisnis di Era Modern',
          slug: 'transformasi-digital-kunci-kesuksesan-bisnis',
          excerpt: 'Pelajari bagaimana transformasi digital dapat mengoptimalkan operasional bisnis dan meningkatkan daya saing di pasar global.',
          coverImage: '/images/articles/digital-transformation.jpg',
          author: {
            name: 'Budi Santoso',
            avatar: '/images/team/budi.jpg',
            role: 'Digital Strategy Lead'
          },
          category: 'technology',
          readTime: 8,
          views: 2340,
          publishedAt: '2025-01-15T10:00:00Z',
          featured: true
        }
      ];

      // Mock articles
      const mockArticles = [
        {
          id: 'art-002',
          title: 'Cloud Computing Solutions for Growing Businesses',
          slug: 'cloud-computing-solutions-for-growing-businesses',
          excerpt: 'Discover how cloud infrastructure can scale with your business needs while optimizing costs and performance.',
          coverImage: '/images/articles/cloud-computing.jpg',
          author: {
            name: 'Sarah Johnson',
            avatar: '/images/team/sarah.jpg',
            role: 'Cloud Architect'
          },
          category: 'technology',
          readTime: 6,
          views: 1850,
          publishedAt: '2025-01-20T14:30:00Z',
          featured: false
        },
        {
          id: 'art-003',
          title: 'Membangun Strategi Digital Marketing yang Efektif',
          slug: 'membangun-strategi-digital-marketing-efektif',
          excerpt: 'Panduan lengkap untuk merancang dan mengimplementasikan strategi digital marketing yang menghasilkan ROI tinggi.',
          coverImage: '/images/articles/digital-marketing.jpg',
          author: {
            name: 'Ahmad Rizki',
            avatar: '/images/team/ahmad.jpg',
            role: 'Marketing Strategist'
          },
          category: 'business',
          readTime: 7,
          views: 1620,
          publishedAt: '2025-01-18T09:15:00Z',
          featured: false
        },
        {
          id: 'art-004',
          title: 'Tutorial: Building Modern Web Apps with Next.js 14',
          slug: 'tutorial-building-modern-web-apps-nextjs-14',
          excerpt: 'Step-by-step guide to build high-performance web applications using Next.js 14 and React Server Components.',
          coverImage: '/images/articles/nextjs-tutorial.jpg',
          author: {
            name: 'David Chen',
            avatar: '/images/team/david.jpg',
            role: 'Senior Developer'
          },
          category: 'tutorial',
          readTime: 12,
          views: 3120,
          publishedAt: '2025-01-22T11:00:00Z',
          featured: false
        },
        {
          id: 'art-005',
          title: 'Cybersecurity Best Practices for 2026',
          slug: 'cybersecurity-best-practices-2026',
          excerpt: 'Essential security measures and best practices to protect your business from emerging cyber threats.',
          coverImage: '/images/articles/cybersecurity.jpg',
          author: {
            name: 'Lisa Anderson',
            avatar: '/images/team/lisa.jpg',
            role: 'Security Consultant'
          },
          category: 'technology',
          readTime: 9,
          views: 2890,
          publishedAt: '2025-01-25T15:45:00Z',
          featured: false
        },
        {
          id: 'art-006',
          title: 'Case Study: Transformasi Digital di Industri Manufaktur',
          slug: 'case-study-transformasi-digital-manufaktur',
          excerpt: 'Bagaimana kami membantu perusahaan manufaktur meningkatkan efisiensi operasional hingga 45% melalui digitalisasi.',
          coverImage: '/images/articles/case-study-manufacturing.jpg',
          author: {
            name: 'Michael Tan',
            avatar: '/images/team/michael.jpg',
            role: 'Solutions Architect'
          },
          category: 'case-study',
          readTime: 10,
          views: 1450,
          publishedAt: '2025-01-19T13:20:00Z',
          featured: false
        }
      ];

      // Mock categories
      const mockCategories = [
        { id: 'cat-001', name: 'Technology', slug: 'technology', count: 24 },
        { id: 'cat-002', name: 'Business', slug: 'business', count: 18 },
        { id: 'cat-003', name: 'Tutorial', slug: 'tutorial', count: 32 },
        { id: 'cat-004', name: 'News', slug: 'news', count: 15 },
        { id: 'cat-005', name: 'Case Study', slug: 'case-study', count: 12 }
      ];

      setTimeout(() => {
        setFeaturedArticles(mockFeatured);
        setArticles(mockArticles);
        setCategories(mockCategories);
        setLoading(false);
      }, 500);
    };

    fetchData();
  }, []);

  // Filter articles by category and search
  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
                  {content.hero.badge}
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  {content.hero.title}
                </h1>
                
                <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
                  {content.hero.subtitle}
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder={content.hero.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-4 py-6 text-lg border-2 border-gray-200 focus:border-[#0066FF] rounded-2xl shadow-lg"
                    />
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

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <section className="py-16 lg:py-20">
            <div className="container mx-auto max-w-7xl px-6 lg:px-8">
              <FadeInSection>
                <div className="flex items-center gap-3 mb-8">
                  <TrendingUp className="w-6 h-6 text-[#0066FF]" />
                  <h2 className="text-3xl font-bold text-gray-900">
                    {content.featured.title}
                  </h2>
                </div>
              </FadeInSection>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredArticles.map((article, index) => (
                  <FadeInSection key={article.id} delay={index * 0.1}>
                    <FeaturedArticleCard article={article} />
                  </FadeInSection>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <h3 className="text-xl font-bold text-gray-900">
                    {content.filter.title}
                  </h3>
                </div>
                
                <button
                  onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {language === 'id' ? 'EN' : 'ID'}
                </button>
              </div>

              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </FadeInSection>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {content.articles.title}
              </h2>
            </FadeInSection>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-t-lg" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-20 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-xl text-gray-500">{content.articles.noResults}</p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredArticles.map((article, index) => (
                    <FadeInSection key={article.id} delay={index * 0.05}>
                      <ArticleCard article={article} />
                    </FadeInSection>
                  ))}
                </div>

                {/* Load More Button */}
                <FadeInSection delay={0.2}>
                  <div className="text-center mt-12">
                    <Button
                      size="lg"
                      className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-8"
                    >
                      {content.articles.loadMore}
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </FadeInSection>
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
                  {content.cta.title}
                </h2>
                <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
                  {content.cta.subtitle}
                </p>
                <Link href="/contact">
                  <Button 
                    size="lg"
                    className="bg-white text-[#0066FF] hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    {content.cta.button}
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