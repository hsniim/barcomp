'use client';

import { useState, useEffect, useRef, memo, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Briefcase,
  Code2,
  ShoppingCart,
  Building2,
  Smartphone,
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
  Zap
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

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const t = useMemo(() => ({
    hero: {
      badge: 'Karya Kami',
      title: 'Menghadirkan Keunggulan',
      subtitle: 'Melalui Setiap Proyek',
      description: 'Jelajahi portofolio proyek sukses kami di berbagai industri. Dari platform enterprise hingga startup inovatif, kami mewujudkan ide dengan teknologi terdepan dan desain yang luar biasa.',
    },
    stats: {
      badge: 'Dalam Angka',
      items: [
        { 
          value: '500', 
          suffix: '+',
          label: 'Proyek Selesai', 
          icon: Briefcase 
        },
        { 
          value: '200', 
          suffix: '+',
          label: 'Klien Puas', 
          icon: Users 
        },
        { 
          value: '15', 
          suffix: '+',
          label: 'Negara Dilayani', 
          icon: Globe 
        },
        { 
          value: '98', 
          suffix: '%',
          label: 'Kepuasan Klien', 
          icon: Star 
        }
      ]
    },
    filters: {
      title: 'Filter berdasarkan Kategori',
      all: 'Semua Proyek',
      items: [
        { id: 'all', label: 'Semua Proyek', icon: Layers },
        { id: 'web', label: 'Pengembangan Web', icon: Code2 },
        { id: 'ecommerce', label: 'E-commerce', icon: ShoppingCart },
        { id: 'mobile', label: 'Aplikasi Mobile', icon: Smartphone },
        { id: 'enterprise', label: 'Enterprise', icon: Building2 }
      ]
    },
    projects: [
      {
        id: 1,
        title: 'Platform Enterprise TechCorp',
        description: 'Sistem perencanaan sumber daya enterprise yang komprehensif dengan analitik bertenaga AI dan fitur kolaborasi real-time.',
        category: 'Enterprise',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
        technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'AWS'],
        stats: {
          completion: '2024',
          completionLabel: 'Tahun',
          duration: '8 mo',
          durationLabel: 'Durasi',
          team: '12',
          teamLabel: 'Tim'
        },
        viewText: 'Lihat Proyek',
        filterCategory: 'enterprise'
      },
      {
        id: 2,
        title: 'FashionHub E-commerce',
        description: 'Platform e-commerce modern dengan checkout mulus, manajemen inventori, dan pengalaman belanja personal.',
        category: 'E-commerce',
        image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop',
        technologies: ['React', 'Shopify', 'Stripe', 'Tailwind'],
        stats: {
          completion: '2024',
          completionLabel: 'Tahun',
          duration: '5 mo',
          durationLabel: 'Durasi',
          team: '8',
          teamLabel: 'Tim'
        },
        viewText: 'Lihat Proyek',
        filterCategory: 'ecommerce'
      },
      {
        id: 3,
        title: 'Aplikasi Mobile HealthTrack',
        description: 'Aplikasi pelacakan kesehatan komprehensif dengan monitoring real-time, konsultasi dokter, dan wawasan kesehatan.',
        category: 'Aplikasi Mobile',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
        technologies: ['React Native', 'Firebase', 'Node.js', 'MongoDB'],
        stats: {
          completion: '2024',
          completionLabel: 'Tahun',
          duration: '6 mo',
          durationLabel: 'Durasi',
          team: '10',
          teamLabel: 'Tim'
        },
        viewText: 'Lihat Proyek',
        filterCategory: 'mobile'
      },
      {
        id: 4,
        title: 'Dashboard FinanceFlow',
        description: 'Dashboard analitik keuangan canggih dengan visualisasi data real-time dan wawasan prediktif.',
        category: 'Pengembangan Web',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
        technologies: ['Vue.js', 'D3.js', 'Python', 'PostgreSQL'],
        stats: {
          completion: '2023',
          completionLabel: 'Tahun',
          duration: '7 mo',
          durationLabel: 'Durasi',
          team: '9',
          teamLabel: 'Tim'
        },
        viewText: 'Lihat Proyek',
        filterCategory: 'web'
      },
      {
        id: 5,
        title: 'Sistem Manajemen Pembelajaran EduLearn',
        description: 'Platform LMS lengkap dengan kursus interaktif, kelas live, penilaian, dan pelacakan progres.',
        category: 'Pengembangan Web',
        image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop',
        technologies: ['Next.js', 'WebRTC', 'Redis', 'AWS'],
        stats: {
          completion: '2023',
          completionLabel: 'Tahun',
          duration: '10 mo',
          durationLabel: 'Durasi',
          team: '15',
          teamLabel: 'Tim'
        },
        viewText: 'Lihat Proyek',
        filterCategory: 'web'
      },
      {
        id: 6,
        title: 'Aplikasi Pengiriman FoodieExpress',
        description: 'Platform pengiriman makanan on-demand dengan pelacakan real-time, berbagai opsi pembayaran, dan rewards loyalitas.',
        category: 'Aplikasi Mobile',
        image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&h=600&fit=crop',
        technologies: ['Flutter', 'Firebase', 'Google Maps', 'Stripe'],
        stats: {
          completion: '2023',
          completionLabel: 'Tahun',
          duration: '6 mo',
          durationLabel: 'Durasi',
          team: '11',
          teamLabel: 'Tim'
        },
        viewText: 'Lihat Proyek',
        filterCategory: 'mobile'
      },
      {
        id: 7,
        title: 'Platform Multi-Toko GlobalRetail',
        description: 'Solusi e-commerce enterprise yang mengelola banyak toko, mata uang, dan bahasa dengan inventori terpusat.',
        category: 'E-commerce',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
        technologies: ['Next.js', 'Microservices', 'Kubernetes', 'PostgreSQL'],
        stats: {
          completion: '2024',
          completionLabel: 'Tahun',
          duration: '12 mo',
          durationLabel: 'Durasi',
          team: '18',
          teamLabel: 'Tim'
        },
        viewText: 'Lihat Proyek',
        filterCategory: 'ecommerce'
      },
      {
        id: 8,
        title: 'Suite Manajemen SmartOffice',
        description: 'Sistem manajemen kantor terintegrasi dengan HR, manajemen proyek, pelacakan waktu, dan alat komunikasi.',
        category: 'Enterprise',
        image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop',
        technologies: ['React', 'Node.js', 'MongoDB', 'Docker'],
        stats: {
          completion: '2023',
          completionLabel: 'Tahun',
          duration: '9 mo',
          durationLabel: 'Durasi',
          team: '14',
          teamLabel: 'Tim'
        },
        viewText: 'Lihat Proyek',
        filterCategory: 'enterprise'
      },
      {
        id: 9,
        title: 'Platform Booking TravelMate',
        description: 'Sistem booking travel komprehensif untuk penerbangan, hotel, dan pengalaman dengan rekomendasi bertenaga AI.',
        category: 'Pengembangan Web',
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
        technologies: ['Next.js', 'Python', 'TensorFlow', 'Redis'],
        stats: {
          completion: '2024',
          completionLabel: 'Tahun',
          duration: '11 mo',
          durationLabel: 'Durasi',
          team: '16',
          teamLabel: 'Tim'
        },
        viewText: 'Lihat Proyek',
        filterCategory: 'web'
      }
    ],
    cta: {
      title: 'Siap Memulai Proyek Anda?',
      subtitle: 'Mari berkolaborasi untuk menciptakan sesuatu yang luar biasa yang mendorong bisnis Anda maju',
      button: 'Mulai Proyek Anda'
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
                  <Briefcase className="w-4 h-4 text-[#0066FF]" />
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
                <Target className="w-16 h-16 mx-auto mb-6 text-white" />
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