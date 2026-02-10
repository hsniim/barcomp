'use client';

import { useState, useEffect, useRef, memo, useMemo } from 'react';
import Link from 'next/link';
import { 
  Smartphone,
  Tablet,
  Zap,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Globe,
  Shield,
  Code2,
  Palette,
  Link2,
  Store,
  ChevronRight,
  Star,
  Award,
  Layers,
  Search,
  TestTube,
  Cpu,
  Boxes,
  Settings
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

// Value Card Component
const ValueCard = memo(({ icon: Icon, title, description, accent }) => {
  return (
    <Card className="h-full border-gray-200 hover:border-[#0066FF] hover:shadow-xl transition-all duration-300 group overflow-hidden">
      <CardContent className="p-8 relative">
        <div className={cn(
          "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500",
          accent === 'blue' && 'bg-blue-500',
          accent === 'purple' && 'bg-purple-500',
          accent === 'green' && 'bg-green-500',
          accent === 'orange' && 'bg-orange-500'
        )} />
        
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#0066FF] transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
});

ValueCard.displayName = 'ValueCard';

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

// Platform Badge Component
const PlatformBadge = memo(({ name, icon: Icon, description }) => {
  return (
    <div className="group">
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-[#0066FF] hover:shadow-lg transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
            <Icon className="w-6 h-6 text-[#0066FF]" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors duration-300 mb-1">
              {name}
            </h4>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

PlatformBadge.displayName = 'PlatformBadge';

// Process Step Component
const ProcessStep = memo(({ number, title, description, icon: Icon }) => {
  return (
    <FadeInSection>
      <div className="flex gap-6 group">
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-[#0066FF] font-bold text-sm">
              {number}
            </div>
          </div>
        </div>
        <div className="flex-1 pt-2">
          <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0066FF] transition-colors duration-300">
            {title}
          </h4>
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </FadeInSection>
  );
});

ProcessStep.displayName = 'ProcessStep';

export default function MobileAppDevelopmentPage() {
  const t = useMemo(() => ({
    hero: {
      badge: 'Pengembangan Aplikasi Mobile',
      title: 'Pengalaman Native',
      subtitle: 'di Genggaman Anda',
      description: 'Transformasikan ide Anda menjadi aplikasi mobile yang powerful untuk iOS dan Android. Kami menciptakan aplikasi intuitif dan berkinerja tinggi yang disukai pengguna, memanfaatkan teknologi terdepan dan praktik terbaik dalam pengembangan mobile.',
      cta: {
        primary: 'Mulai Aplikasi Anda',
        secondary: 'Lihat Aplikasi Kami'
      }
    },
    platforms: {
      badge: 'Platform yang Didukung',
      title: 'Bangun Sekali, Deploy di Mana Saja',
      subtitle: 'Jangkau pengguna Anda di perangkat favorit mereka',
      items: [
        {
          name: 'iOS',
          icon: Smartphone,
          description: 'Aplikasi iOS native untuk iPhone dan iPad'
        },
        {
          name: 'Android',
          icon: Tablet,
          description: 'Aplikasi Android berkinerja tinggi'
        },
        {
          name: 'Cross-Platform',
          icon: Layers,
          description: 'Satu codebase untuk berbagai platform'
        },
        {
          name: 'Progressive Web Apps',
          icon: Globe,
          description: 'Aplikasi web yang bekerja seperti aplikasi native'
        }
      ]
    },
    features: {
      badge: 'Fitur Utama',
      title: 'Solusi Mobile Lengkap',
      subtitle: 'Semua yang Anda butuhkan untuk membangun aplikasi mobile kelas dunia',
      items: [
        {
          icon: Layers,
          title: 'Pengembangan Cross-Platform',
          description: 'Bangun sekali, deploy di mana saja dengan Flutter dan React Native. Kurangi waktu dan biaya pengembangan sambil mempertahankan performa native dan pengalaman pengguna di platform iOS dan Android.',
          accent: 'blue'
        },
        {
          icon: Palette,
          title: 'UI/UX yang Berpusat pada Pengguna',
          description: 'Antarmuka yang indah dan intuitif dirancang dengan pengguna sebagai fokus. Kami mengikuti panduan desain spesifik platform sambil menciptakan pengalaman unik yang membuat aplikasi Anda menonjol di pasar.',
          accent: 'purple'
        },
        {
          icon: Link2,
          title: 'Integrasi API yang Mulus',
          description: 'Hubungkan aplikasi Anda ke layanan backend, API pihak ketiga, atau platform cloud mana pun. Kami memastikan sinkronisasi data yang aman dan efisien serta pembaruan real-time untuk performa aplikasi optimal.',
          accent: 'green'
        },
        {
          icon: Store,
          title: 'Dukungan Publikasi App Store',
          description: 'Dari optimasi app store hingga pengiriman dan persetujuan, kami membimbing Anda melalui seluruh proses publikasi untuk Apple App Store dan Google Play Store dengan praktik terbaik.',
          accent: 'orange'
        }
      ]
    },
    process: {
      badge: 'Proses Pengembangan',
      title: 'Dari Konsep hingga Peluncuran',
      subtitle: 'Metodologi terbukti kami untuk pengembangan aplikasi mobile yang sukses',
      steps: [
        {
          number: '01',
          icon: Search,
          title: 'Perencanaan & Penemuan',
          description: 'Kami mulai dengan memahami tujuan bisnis, target audiens, dan persyaratan teknis Anda. Melalui riset mendalam dan analisis kompetitor, kami membuat strategi aplikasi dan roadmap fitur yang komprehensif.'
        },
        {
          number: '02',
          icon: Palette,
          title: 'Desain UI/UX',
          description: 'Desainer kami menciptakan antarmuka yang indah dan intuitif dengan prototipe interaktif. Kami fokus pada alur pengguna, aksesibilitas, dan panduan desain spesifik platform untuk memastikan pengalaman pengguna terbaik.'
        },
        {
          number: '03',
          icon: Code2,
          title: 'Pengembangan & Integrasi',
          description: 'Menggunakan Flutter atau React Native, kami membangun aplikasi Anda dengan kode yang bersih dan scalable. Kami mengintegrasikan API, menerapkan fitur, dan memastikan performa mulus di semua perangkat dan sistem operasi target.'
        },
        {
          number: '04',
          icon: TestTube,
          title: 'QA Testing & Peluncuran',
          description: 'Pengujian ketat di berbagai perangkat dan skenario memastikan performa bebas bug. Kami menangani pengiriman app store, optimasi, dan memberikan dukungan pasca-peluncuran untuk memastikan aplikasi Anda sukses.'
        }
      ]
    },
    technologies: {
      badge: 'Teknologi',
      title: 'Stack Teknologi Terdepan',
      subtitle: 'Kami menggunakan tools terbaik untuk pengembangan aplikasi mobile',
      items: [
        {
          category: 'Framework',
          technologies: ['Flutter', 'React Native', 'Swift', 'Kotlin']
        },
        {
          category: 'Backend',
          technologies: ['Firebase', 'Node.js', 'GraphQL', 'REST APIs']
        },
        {
          category: 'Tools',
          technologies: ['Xcode', 'Android Studio', 'VS Code', 'Figma']
        },
        {
          category: 'Cloud & Layanan',
          technologies: ['AWS', 'Google Cloud', 'Azure', 'Supabase']
        }
      ]
    },
    performance: {
      badge: 'Mengapa Memilih Kami',
      title: 'Keunggulan Mobile yang Terkirim',
      subtitle: 'Komitmen kami terhadap kualitas dan performa',
      stats: [
        { 
          value: '200', 
          suffix: '+',
          label: 'Aplikasi Diluncurkan', 
          icon: Smartphone 
        },
        { 
          value: '4.8', 
          suffix: '★',
          label: 'Rating Rata-rata', 
          icon: Star 
        },
        { 
          value: '1M', 
          suffix: '+',
          label: 'Total Unduhan', 
          icon: TrendingUp 
        },
        { 
          value: '99', 
          suffix: '%',
          label: 'Kepuasan Klien', 
          icon: Award 
        }
      ]
    },
    benefits: {
      badge: 'Manfaat Tambahan',
      title: 'Lebih dari Sekadar Pengembangan',
      subtitle: 'Layanan komprehensif untuk kesuksesan mobile Anda',
      items: [
        {
          icon: Zap,
          title: 'Performa Cepat',
          description: 'Dioptimalkan untuk kecepatan dan efisiensi'
        },
        {
          icon: Shield,
          title: 'Aman & Andal',
          description: 'Langkah keamanan tingkat enterprise'
        },
        {
          icon: Users,
          title: 'Analitik Pengguna',
          description: 'Lacak perilaku dan keterlibatan pengguna'
        },
        {
          icon: Boxes,
          title: 'Arsitektur Scalable',
          description: 'Dibangun untuk tumbuh bersama bisnis Anda'
        },
        {
          icon: Settings,
          title: 'Pemeliharaan Mudah',
          description: 'Kode bersih untuk pembaruan mudah'
        },
        {
          icon: Cpu,
          title: 'Dukungan Offline',
          description: 'Bekerja mulus tanpa internet'
        }
      ]
    },
    cta: {
      title: 'Mari Bangun Aplikasi Mobile Anda Berikutnya',
      subtitle: 'Transformasikan visi Anda menjadi pengalaman mobile yang powerful yang akan disukai pengguna',
      button: 'Mulai Sekarang'
    }
  }), []);

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
                  <Sparkles className="w-4 h-4 text-[#0066FF]" />
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
                
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-10 max-w-3xl mx-auto">
                  {t.hero.description}
                </p>

                <div className="flex flex-wrap gap-4 justify-center">
                  <Link href="/contact">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-[#0066FF] to-[#0052CC] text-white hover:shadow-xl hover:shadow-blue-500/50 px-8 py-6 text-lg font-semibold transition-all duration-300"
                    >
                      {t.hero.cta.primary}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/services/mobile/portfolio">
                    <Button 
                      size="lg"
                      variant="outline"
                      className="border-2 border-gray-300 hover:border-[#0066FF] hover:bg-blue-50 px-8 py-6 text-lg font-semibold transition-all duration-300"
                    >
                      {t.hero.cta.secondary}
                    </Button>
                  </Link>
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

        {/* Platforms Section */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-2 bg-purple-100 rounded-full text-sm font-semibold text-purple-600 mb-6">
                  {t.platforms.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {t.platforms.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {t.platforms.subtitle}
                </p>
              </div>
            </FadeInSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {t.platforms.items.map((platform, index) => (
                <FadeInSection key={index} delay={index * 0.05}>
                  <PlatformBadge {...platform} />
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-2 bg-blue-100 rounded-full text-sm font-semibold text-[#0066FF] mb-6">
                  {t.features.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {t.features.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {t.features.subtitle}
                </p>
              </div>
            </FadeInSection>

            <div className="grid md:grid-cols-2 gap-8">
              {t.features.items.map((feature, index) => (
                <FadeInSection key={index} delay={index * 0.1}>
                  <ValueCard {...feature} />
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-2 bg-green-100 rounded-full text-sm font-semibold text-green-600 mb-6">
                  {t.process.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  {t.process.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                  {t.process.subtitle}
                </p>
              </div>
            </FadeInSection>

            <div className="max-w-4xl mx-auto space-y-12">
              {t.process.steps.map((step, index) => (
                <ProcessStep key={index} {...step} />
              ))}
            </div>
          </div>
        </section>

        {/* Technologies Section */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-2 bg-indigo-100 rounded-full text-sm font-semibold text-indigo-600 mb-6">
                  {t.technologies.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  {t.technologies.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                  {t.technologies.subtitle}
                </p>
              </div>
            </FadeInSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {t.technologies.items.map((item, index) => (
                <FadeInSection key={index} delay={index * 0.05}>
                  <Card className="border-gray-200 hover:border-[#0066FF] hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-gray-900 mb-4 text-lg group-hover:text-[#0066FF] transition-colors duration-300">
                        {item.category}
                      </h4>
                      <div className="space-y-2">
                        {item.technologies.map((tech, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{tech}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* Performance Stats Section */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-2 bg-orange-100 rounded-full text-sm font-semibold text-orange-600 mb-6">
                  {t.performance.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  {t.performance.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                  {t.performance.subtitle}
                </p>
              </div>
            </FadeInSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {t.performance.stats.map((stat, index) => (
                <FadeInSection key={index} delay={index * 0.1}>
                  <StatCard {...stat} />
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Grid Section */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-2 bg-purple-100 rounded-full text-sm font-semibold text-purple-600 mb-6">
                  {t.benefits.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  {t.benefits.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                  {t.benefits.subtitle}
                </p>
              </div>
            </FadeInSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {t.benefits.items.map((benefit, index) => (
                <FadeInSection key={index} delay={index * 0.05}>
                  <Card className="border-gray-200 hover:border-[#0066FF] hover:shadow-xl transition-all duration-300 group h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-[#0066FF] transition-colors duration-300 flex-shrink-0">
                          <benefit.icon className="w-6 h-6 text-[#0066FF] group-hover:text-white transition-colors duration-300" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2 group-hover:text-[#0066FF] transition-colors duration-300">
                            {benefit.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeInSection>
              ))}
            </div>
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