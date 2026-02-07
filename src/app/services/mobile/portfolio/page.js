'use client';

import { useState, useEffect, useRef, memo, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Smartphone,
  Code2,
  ShoppingCart,
  Building2,
  Layers,
  TrendingUp,
  Award,
  Users,
  Globe,
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
  return (
    <FadeInSection delay={index * 0.05}>
      <Card className="border-gray-200 hover:border-[#0066FF] hover:shadow-2xl transition-all duration-300 group overflow-hidden h-full">
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
              className="bg-white text-[#0066FF] hover:bg-gray-100 shadow-xl"
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

          {/* Tech Stack Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech, idx) => (
              <span 
                key={idx}
                className="px-2 py-1 bg-blue-50 text-[#0066FF] rounded-md text-xs font-medium"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{project.stats.completion}</div>
              <div className="text-xs text-gray-500">{project.stats.completionLabel}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{project.stats.duration}</div>
              <div className="text-xs text-gray-500">{project.stats.durationLabel}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{project.stats.team}</div>
              <div className="text-xs text-gray-500">{project.stats.teamLabel}</div>
            </div>
          </div>
        </CardContent>
      </Card>
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

export default function MobilePortfolioPage() {
  const [language, setLanguage] = useState('en');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);

    const handleLanguageChange = (e) => {
      setLanguage(e.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const t = useMemo(() => ({
    hero: {
      badge: language === 'en' ? 'Mobile Portfolio' : 'Portofolio Mobile',
      title: language === 'en' ? 'Crafting Excellence' : 'Menciptakan Keunggulan',
      subtitle: language === 'en' 
        ? 'One App at a Time'
        : 'Satu Aplikasi pada Satu Waktu',
      description: language === 'en'
        ? 'Explore our collection of innovative mobile applications designed for iOS and Android. Each project represents our commitment to quality, user experience, and cutting-edge technology.'
        : 'Jelajahi koleksi aplikasi mobile inovatif kami yang dirancang untuk iOS dan Android. Setiap proyek mewakili komitmen kami terhadap kualitas, pengalaman pengguna, dan teknologi terdepan.'
    },
    stats: {
      badge: language === 'en' ? 'Our Impact' : 'Dampak Kami',
      items: [
        {
          value: '80',
          suffix: '+',
          label: language === 'en' ? 'Mobile Apps' : 'Aplikasi Mobile',
          icon: Smartphone
        },
        {
          value: '2M',
          suffix: '+',
          label: language === 'en' ? 'Active Users' : 'Pengguna Aktif',
          icon: Users
        },
        {
          value: '4.8',
          suffix: '/5',
          label: language === 'en' ? 'Avg. Rating' : 'Rating Rata-rata',
          icon: Star
        },
        {
          value: '15',
          suffix: '+',
          label: language === 'en' ? 'Awards' : 'Penghargaan',
          icon: Award
        }
      ]
    },
    filters: {
      items: [
        {
          id: 'all',
          label: language === 'en' ? 'All Apps' : 'Semua Aplikasi',
          icon: Layers
        },
        {
          id: 'fintech',
          label: language === 'en' ? 'Fintech' : 'Fintech',
          icon: TrendingUp
        },
        {
          id: 'ecommerce',
          label: language === 'en' ? 'E-Commerce' : 'E-Commerce',
          icon: ShoppingCart
        },
        {
          id: 'social',
          label: language === 'en' ? 'Social' : 'Sosial',
          icon: Users
        },
        {
          id: 'enterprise',
          label: language === 'en' ? 'Enterprise' : 'Enterprise',
          icon: Building2
        }
      ]
    },
    projects: [
      {
        id: 1,
        title: language === 'en' ? 'FinanceFlow - Digital Banking' : 'FinanceFlow - Perbankan Digital',
        description: language === 'en' 
          ? 'A comprehensive mobile banking solution with advanced security, real-time transactions, and AI-powered financial insights for modern users.'
          : 'Solusi perbankan mobile komprehensif dengan keamanan canggih, transaksi real-time, dan wawasan keuangan bertenaga AI untuk pengguna modern.',
        category: 'Fintech',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop',
        technologies: ['React Native', 'Node.js', 'PostgreSQL', 'AWS'],
        stats: {
          completion: '2024',
          completionLabel: language === 'en' ? 'Year' : 'Tahun',
          duration: '9 mo',
          durationLabel: language === 'en' ? 'Duration' : 'Durasi',
          team: '8',
          teamLabel: language === 'en' ? 'Team' : 'Tim'
        },
        viewText: language === 'en' ? 'View Project' : 'Lihat Proyek',
        filterCategory: 'fintech'
      },
      {
        id: 2,
        title: language === 'en' ? 'ShopMart - Shopping Experience' : 'ShopMart - Pengalaman Berbelanja',
        description: language === 'en'
          ? 'Feature-rich e-commerce mobile app with AR try-on, personalized recommendations, and seamless checkout experience.'
          : 'Aplikasi mobile e-commerce kaya fitur dengan AR try-on, rekomendasi personal, dan pengalaman checkout yang mulus.',
        category: 'E-Commerce',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop',
        technologies: ['Flutter', 'Firebase', 'Stripe', 'TensorFlow'],
        stats: {
          completion: '2024',
          completionLabel: language === 'en' ? 'Year' : 'Tahun',
          duration: '7 mo',
          durationLabel: language === 'en' ? 'Duration' : 'Durasi',
          team: '10',
          teamLabel: language === 'en' ? 'Team' : 'Tim'
        },
        viewText: language === 'en' ? 'View Project' : 'Lihat Proyek',
        filterCategory: 'ecommerce'
      },
      {
        id: 3,
        title: language === 'en' ? 'SocialConnect - Community Platform' : 'SocialConnect - Platform Komunitas',
        description: language === 'en'
          ? 'Innovative social networking app with video sharing, live streaming, and AI-moderated content for safe community building.'
          : 'Aplikasi jejaring sosial inovatif dengan berbagi video, live streaming, dan konten yang dimoderasi AI untuk membangun komunitas yang aman.',
        category: language === 'en' ? 'Social' : 'Sosial',
        image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
        technologies: ['React Native', 'WebRTC', 'MongoDB', 'Redis'],
        stats: {
          completion: '2024',
          completionLabel: language === 'en' ? 'Year' : 'Tahun',
          duration: '10 mo',
          durationLabel: language === 'en' ? 'Duration' : 'Durasi',
          team: '12',
          teamLabel: language === 'en' ? 'Team' : 'Tim'
        },
        viewText: language === 'en' ? 'View Project' : 'Lihat Proyek',
        filterCategory: 'social'
      },
      {
        id: 4,
        title: language === 'en' ? 'HealthTrack - Wellness Companion' : 'HealthTrack - Pendamping Kesehatan',
        description: language === 'en'
          ? 'Personal health and fitness tracking app with AI coach, nutrition planning, and wearable device integration.'
          : 'Aplikasi pelacakan kesehatan dan kebugaran pribadi dengan pelatih AI, perencanaan nutrisi, dan integrasi perangkat wearable.',
        category: language === 'en' ? 'Health' : 'Kesehatan',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
        technologies: ['Flutter', 'Firebase', 'TensorFlow', 'HealthKit'],
        stats: {
          completion: '2023',
          completionLabel: language === 'en' ? 'Year' : 'Tahun',
          duration: '8 mo',
          durationLabel: language === 'en' ? 'Duration' : 'Durasi',
          team: '6',
          teamLabel: language === 'en' ? 'Team' : 'Tim'
        },
        viewText: language === 'en' ? 'View Project' : 'Lihat Proyek',
        filterCategory: 'all'
      },
      {
        id: 5,
        title: language === 'en' ? 'TaskMaster Pro - Productivity' : 'TaskMaster Pro - Produktivitas',
        description: language === 'en'
          ? 'Enterprise-grade task management app with team collaboration, time tracking, and advanced project analytics.'
          : 'Aplikasi manajemen tugas tingkat enterprise dengan kolaborasi tim, pelacakan waktu, dan analitik proyek canggih.',
        category: 'Enterprise',
        image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop',
        technologies: ['React Native', 'GraphQL', 'PostgreSQL', 'AWS'],
        stats: {
          completion: '2024',
          completionLabel: language === 'en' ? 'Year' : 'Tahun',
          duration: '11 mo',
          durationLabel: language === 'en' ? 'Duration' : 'Durasi',
          team: '14',
          teamLabel: language === 'en' ? 'Team' : 'Tim'
        },
        viewText: language === 'en' ? 'View Project' : 'Lihat Proyek',
        filterCategory: 'enterprise'
      },
      {
        id: 6,
        title: language === 'en' ? 'FoodieDelight - Food Delivery' : 'FoodieDelight - Pengiriman Makanan',
        description: language === 'en'
          ? 'On-demand food delivery app with real-time tracking, smart recommendations, and contactless delivery options.'
          : 'Aplikasi pengiriman makanan on-demand dengan pelacakan real-time, rekomendasi pintar, dan opsi pengiriman tanpa kontak.',
        category: 'E-Commerce',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
        technologies: ['Flutter', 'Node.js', 'MongoDB', 'Socket.io'],
        stats: {
          completion: '2024',
          completionLabel: language === 'en' ? 'Year' : 'Tahun',
          duration: '6 mo',
          durationLabel: language === 'en' ? 'Duration' : 'Durasi',
          team: '9',
          teamLabel: language === 'en' ? 'Team' : 'Tim'
        },
        viewText: language === 'en' ? 'View Project' : 'Lihat Proyek',
        filterCategory: 'ecommerce'
      },
      {
        id: 7,
        title: language === 'en' ? 'InvestSmart - Trading Platform' : 'InvestSmart - Platform Trading',
        description: language === 'en'
          ? 'Advanced investment app with real-time market data, portfolio management, and AI-driven trading insights.'
          : 'Aplikasi investasi canggih dengan data pasar real-time, manajemen portofolio, dan wawasan trading bertenaga AI.',
        category: 'Fintech',
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop',
        technologies: ['React Native', 'Python', 'Redis', 'WebSocket'],
        stats: {
          completion: '2023',
          completionLabel: language === 'en' ? 'Year' : 'Tahun',
          duration: '12 mo',
          durationLabel: language === 'en' ? 'Duration' : 'Durasi',
          team: '15',
          teamLabel: language === 'en' ? 'Team' : 'Tim'
        },
        viewText: language === 'en' ? 'View Project' : 'Lihat Proyek',
        filterCategory: 'fintech'
      },
      {
        id: 8,
        title: language === 'en' ? 'LearnHub - Education App' : 'LearnHub - Aplikasi Edukasi',
        description: language === 'en'
          ? 'Interactive learning platform with video courses, quizzes, and gamification for engaging educational experience.'
          : 'Platform pembelajaran interaktif dengan kursus video, kuis, dan gamifikasi untuk pengalaman edukasi yang menarik.',
        category: language === 'en' ? 'Education' : 'Edukasi',
        image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop',
        technologies: ['Flutter', 'Django', 'PostgreSQL', 'WebRTC'],
        stats: {
          completion: '2024',
          completionLabel: language === 'en' ? 'Year' : 'Tahun',
          duration: '8 mo',
          durationLabel: language === 'en' ? 'Duration' : 'Durasi',
          team: '7',
          teamLabel: language === 'en' ? 'Team' : 'Tim'
        },
        viewText: language === 'en' ? 'View Project' : 'Lihat Proyek',
        filterCategory: 'all'
      },
      {
        id: 9,
        title: language === 'en' ? 'RideShare - Transportation' : 'RideShare - Transportasi',
        description: language === 'en'
          ? 'Smart ride-sharing app with route optimization, driver matching, and secure payment integration for seamless travel.'
          : 'Aplikasi ride-sharing pintar dengan optimasi rute, pencocokan driver, dan integrasi pembayaran aman untuk perjalanan mulus.',
        category: language === 'en' ? 'Transportation' : 'Transportasi',
        image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=600&fit=crop',
        technologies: ['React Native', 'Node.js', 'Google Maps', 'Stripe'],
        stats: {
          completion: '2023',
          completionLabel: language === 'en' ? 'Year' : 'Tahun',
          duration: '10 mo',
          durationLabel: language === 'en' ? 'Duration' : 'Durasi',
          team: '11',
          teamLabel: language === 'en' ? 'Team' : 'Tim'
        },
        viewText: language === 'en' ? 'View Project' : 'Lihat Proyek',
        filterCategory: 'all'
      }
    ],
    cta: {
      title: language === 'en' 
        ? "Ready to Build Your App?" 
        : 'Siap Membangun Aplikasi Anda?',
      subtitle: language === 'en'
        ? "Let's create a mobile experience that your users will love and your business will benefit from"
        : 'Mari ciptakan pengalaman mobile yang akan disukai pengguna Anda dan menguntungkan bisnis Anda',
      button: language === 'en' ? 'Start Your Project' : 'Mulai Proyek Anda'
    }
  }), [language]);

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
                  <Smartphone className="w-4 h-4 text-[#0066FF]" />
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
                    {language === 'en' ? 'No projects found in this category' : 'Tidak ada proyek dalam kategori ini'}
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
                <Smartphone className="w-16 h-16 mx-auto mb-6 text-white" />
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
      `}</style>
    </>
  );
}