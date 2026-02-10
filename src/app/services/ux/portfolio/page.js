'use client';

import { useState, useEffect, useRef, memo, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Palette,
  Smartphone,
  ShoppingCart,
  Heart,
  GraduationCap,
  Utensils,
  Layers,
  TrendingUp,
  Award,
  Users,
  Eye,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Filter,
  Star,
  ChevronRight,
  Calendar,
  Target,
  Zap,
  Monitor,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Fade-in Section Component
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

// Stat Card Component
const StatCard = memo(({ value, label, icon: Icon, suffix = '' }) => {
  return (
    <Card className="border-gray-200 hover:border-[#0066FF] hover:shadow-xl transition-all duration-300 group">
      <CardContent className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-[#0066FF] transition-colors duration-300">
            <Icon className="w-8 h-8 text-[#0066FF] group-hover:text-white transition-colors duration-300" />
          </div>
        </div>
        <div className="text-4xl sm:text-5xl font-bold text-[#0066FF] mb-2">
          {value}{suffix}
        </div>
        <div className="text-gray-600 font-medium">{label}</div>
      </CardContent>
    </Card>
  );
});

StatCard.displayName = 'StatCard';

// Project Card Component
const ProjectCard = memo(({ project, index }) => {
  const cardContent = (
    <Card className="border-gray-200 hover:border-[#0066FF] hover:shadow-2xl transition-all duration-300 group overflow-hidden h-full cursor-pointer">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-[#0066FF] shadow-lg">
            {project.category}
          </span>
        </div>

        {/* View Project Button - Appears on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button 
            className="bg-white text-[#0066FF] hover:bg-gray-100 shadow-xl pointer-events-none"
            size="sm"
          >
            {project.viewText}
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0066FF] transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Design Methods Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.methods.map((method, idx) => (
            <span 
              key={idx}
              className="px-2 py-1 bg-blue-50 text-[#0066FF] rounded-md text-xs font-medium"
            >
              {method}
            </span>
          ))}
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{project.stats.result}</div>
            <div className="text-xs text-gray-500">{project.stats.resultLabel}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{project.stats.duration}</div>
            <div className="text-xs text-gray-500">{project.stats.durationLabel}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{project.stats.rating}</div>
            <div className="text-xs text-gray-500">{project.stats.ratingLabel}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <FadeInSection delay={index * 0.05}>
      {project.link ? (
        <Link href={project.link} className="block">
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}
    </FadeInSection>
  );
});

ProjectCard.displayName = 'ProjectCard';

// Filter Button Component
const FilterButton = memo(({ label, icon: Icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300",
        isActive
          ? "bg-[#0066FF] text-white shadow-lg shadow-blue-500/30"
          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-[#0066FF]"
      )}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
});

FilterButton.displayName = 'FilterButton';

export default function UXPortfolioPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const t = useMemo(() => ({
    hero: {
      badge: 'Portfolio UX Design',
      title: 'Desain yang Mengutamakan',
      subtitle: 'Pengalaman Pengguna',
      description: 'Jelajahi portofolio desain UX/UI kami yang telah membantu bisnis meningkatkan konversi, kepuasan pengguna, dan menciptakan pengalaman digital yang memorable di berbagai industri.',
    },
    stats: {
      badge: 'Pencapaian Kami',
      items: [
        { 
          value: '150', 
          suffix: '+',
          label: 'Proyek UX Selesai', 
          icon: Palette 
        },
        { 
          value: '95', 
          suffix: '%',
          label: 'Kepuasan Klien', 
          icon: Heart 
        },
        { 
          value: '45', 
          suffix: '%',
          label: 'Avg. Konversi Naik', 
          icon: TrendingUp 
        },
        { 
          value: '4.9', 
          suffix: '/5',
          label: 'Rating Rata-rata', 
          icon: Star 
        }
      ]
    },
    filters: {
      items: [
        { id: 'all', label: 'Semua Project', icon: Layers },
        { id: 'ecommerce', label: 'E-Commerce', icon: ShoppingCart },
        { id: 'mobile', label: 'Mobile App', icon: Smartphone },
        { id: 'saas', label: 'SaaS Platform', icon: Monitor },
        { id: 'education', label: 'Edukasi', icon: GraduationCap }
      ]
    },
    projects: [
      {
        id: 1,
        title: 'Fashion E-Commerce Redesign',
        description: 'Redesign complete platform e-commerce fashion dengan fokus pada mobile-first experience dan peningkatan conversion rate',
        category: 'E-Commerce',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
        methods: ['User Research', 'Wireframing', 'Prototyping', 'A/B Testing'],
        stats: {
          result: '+45%',
          resultLabel: 'Konversi',
          duration: '3 Bln',
          durationLabel: 'Timeline',
          rating: '4.9',
          ratingLabel: 'Rating'
        },
        viewText: 'Lihat Case Study',
        link: '#',
        filterCategory: 'ecommerce'
      },
      {
        id: 2,
        title: 'Banking Mobile App',
        description: 'Aplikasi mobile banking dengan interface intuitif, keamanan tinggi, dan fokus pada kemudahan transaksi untuk semua kalangan',
        category: 'Fintech',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop',
        methods: ['UX Research', 'User Flows', 'UI Design', 'Usability Testing'],
        stats: {
          result: '250K+',
          resultLabel: 'Users',
          duration: '4 Bln',
          durationLabel: 'Timeline',
          rating: '4.8',
          ratingLabel: 'Rating'
        },
        viewText: 'Lihat Case Study',
        link: '#',
        filterCategory: 'mobile'
      },
      {
        id: 3,
        title: 'Healthcare Dashboard',
        description: 'Dashboard komprehensif untuk tenaga medis dengan visualisasi data pasien yang jelas dan actionable insights',
        category: 'Healthcare',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
        methods: ['Data Visualization', 'Information Architecture', 'Interaction Design'],
        stats: {
          result: '-65%',
          resultLabel: 'Error Rate',
          duration: '5 Bln',
          durationLabel: 'Timeline',
          rating: '4.7',
          ratingLabel: 'Rating'
        },
        viewText: 'Lihat Case Study',
        link: '#',
        filterCategory: 'saas'
      },
      {
        id: 4,
        title: 'Food Delivery App',
        description: 'Aplikasi food delivery dengan real-time tracking, personalisasi menu, dan checkout process yang super cepat',
        category: 'Food & Beverage',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
        methods: ['Mobile UX', 'Personalization', 'Real-time Features'],
        stats: {
          result: '+85%',
          resultLabel: 'Orders',
          duration: '3 Bln',
          durationLabel: 'Timeline',
          rating: '4.6',
          ratingLabel: 'Rating'
        },
        viewText: 'Lihat Case Study',
        link: '#',
        filterCategory: 'mobile'
      },
      {
        id: 5,
        title: 'Learning Management System',
        description: 'Platform pembelajaran online dengan gamifikasi, progress tracking, dan interactive learning experience',
        category: 'Edukasi',
        image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop',
        methods: ['Gamification', 'Learning UX', 'Engagement Design'],
        stats: {
          result: '+75%',
          resultLabel: 'Engagement',
          duration: '6 Bln',
          durationLabel: 'Timeline',
          rating: '4.8',
          ratingLabel: 'Rating'
        },
        viewText: 'Lihat Case Study',
        link: '#',
        filterCategory: 'education'
      },
      {
        id: 6,
        title: 'Smart Home Control App',
        description: 'Interface sederhana untuk mengontrol smart home devices dengan automasi cerdas dan energy monitoring',
        category: 'IoT',
        image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=600&fit=crop',
        methods: ['IoT UX', 'Smart Automation', 'Voice Interface'],
        stats: {
          result: '50+',
          resultLabel: 'Devices',
          duration: '4 Bln',
          durationLabel: 'Timeline',
          rating: '4.7',
          ratingLabel: 'Rating'
        },
        viewText: 'Lihat Case Study',
        link: '#',
        filterCategory: 'mobile'
      },
      {
        id: 7,
        title: 'SaaS Project Management Tool',
        description: 'Platform manajemen proyek dengan collaboration features, timeline visualization, dan team productivity insights',
        category: 'SaaS',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
        methods: ['Dashboard Design', 'Collaboration UX', 'Data Analytics'],
        stats: {
          result: '+60%',
          resultLabel: 'Productivity',
          duration: '5 Bln',
          durationLabel: 'Timeline',
          rating: '4.9',
          ratingLabel: 'Rating'
        },
        viewText: 'Lihat Case Study',
        link: '#',
        filterCategory: 'saas'
      },
      {
        id: 8,
        title: 'Travel Booking Platform',
        description: 'Platform booking travel dengan advanced search, price comparison, dan seamless booking experience',
        category: 'Travel',
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
        methods: ['Search UX', 'Booking Flow', 'Mobile Optimization'],
        stats: {
          result: '+55%',
          resultLabel: 'Bookings',
          duration: '4 Bln',
          durationLabel: 'Timeline',
          rating: '4.7',
          ratingLabel: 'Rating'
        },
        viewText: 'Lihat Case Study',
        link: '#',
        filterCategory: 'ecommerce'
      },
      {
        id: 9,
        title: 'Fitness Tracking App',
        description: 'Aplikasi fitness dengan workout plans, nutrition tracking, dan social features untuk motivasi komunitas',
        category: 'Health & Fitness',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop',
        methods: ['Health UX', 'Motivation Design', 'Social Features'],
        stats: {
          result: '100K+',
          resultLabel: 'Active Users',
          duration: '4 Bln',
          durationLabel: 'Timeline',
          rating: '4.8',
          ratingLabel: 'Rating'
        },
        viewText: 'Lihat Case Study',
        link: '#',
        filterCategory: 'mobile'
      }
    ],
    cta: {
      title: 'Siap Menciptakan Pengalaman Digital yang Luar Biasa?',
      subtitle: 'Mari berkolaborasi untuk merancang solusi UX yang meningkatkan kepuasan pengguna dan mendorong hasil bisnis Anda',
      button: 'Mulai Proyek UX Anda'
    }
  }), []);

  // Filter projects based on active filter
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return t.projects;
    return t.projects.filter(project => project.filterCategory === activeFilter);
  }, [activeFilter, t.projects]);

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] opacity-30" />
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full blur-3xl opacity-20 animate-pulse" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
          
          <div className="relative container mx-auto max-w-7xl px-6 lg:px-8 py-24 lg:py-32">
            <FadeInSection>
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-8 border border-gray-200 shadow-sm">
                  <Palette className="w-4 h-4 text-[#0066FF]" />
                  <span className="text-sm font-semibold text-gray-700">{t.hero.badge}</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    {t.hero.title}
                  </span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#0052CC] mt-2">
                    {t.hero.subtitle}
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  {t.hero.description}
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

        {/* Stats Section */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-2 bg-blue-100 rounded-full text-sm font-semibold text-[#0066FF] mb-6">
                  {t.stats.badge}
                </div>
              </div>
            </FadeInSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {t.stats.items.map((stat, index) => (
                <FadeInSection key={index} delay={index * 0.1}>
                  <StatCard {...stat} />
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-12 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="flex flex-wrap gap-4 justify-center">
                {t.filters.items.map((filter, index) => (
                  <FilterButton
                    key={filter.id}
                    label={filter.label}
                    icon={filter.icon}
                    isActive={activeFilter === filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                  />
                ))}
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Projects Grid Section */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  index={index}
                />
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <FadeInSection>
                <div className="text-center py-20">
                  <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    {'Tidak ada proyek dalam kategori ini'}
                  </p>
                </div>
              </FadeInSection>
            )}
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-br from-[#0066FF] to-[#0052CC] overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <FadeInSection>
              <div className="text-center max-w-3xl mx-auto">
                <Eye className="w-16 h-16 mx-auto mb-6 text-white" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                  {t.cta.title}
                </h2>
                <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
                  {t.cta.subtitle}
                </p>
                <Link href="/contact">
                  <Button 
                    size="lg"
                    className="bg-white text-[#0066FF] hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    {t.cta.button}
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
        
        .bg-grid-slate-100 {
          background-image: linear-gradient(to right, #f1f5f9 1px, transparent 1px),
                            linear-gradient(to bottom, #f1f5f9 1px, transparent 1px);
          background-size: 32px 32px;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.2;
          }
        }
        
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}