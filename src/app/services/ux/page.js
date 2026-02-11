'use client';

import { useState, useEffect, useRef, memo, useMemo } from 'react';
import Link from 'next/link';
import { 
  Palette,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Layers,
  Search,
  Eye,
  MousePointer,
  Smartphone,
  Monitor,
  ChevronRight,
  Star,
  Award,
  Target,
  PenTool,
  Layout,
  Zap,
  TestTube,
  BarChart3,
  Figma,
  Compass,
  Grid3x3,
  Lightbulb,
  Rocket,
  Heart,
  GitBranch,
  Workflow
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
          accent === 'orange' && 'bg-orange-500',
          accent === 'pink' && 'bg-pink-500'
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

// Workflow Step Component
const WorkflowStep = memo(({ number, icon: Icon, title, description, items }) => {
  return (
    <FadeInSection>
      <div className="relative">
        <Card className="border-gray-200 hover:border-[#0066FF] hover:shadow-xl transition-all duration-300 group overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
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
              
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#0066FF] transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {description}
                </p>
                
                {items && items.length > 0 && (
                  <div className="space-y-2">
                    {items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FadeInSection>
  );
});

WorkflowStep.displayName = 'WorkflowStep';

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

export default function UXDesignPage() {
  const t = useMemo(() => ({
    hero: {
      badge: 'Keunggulan Desain UI/UX',
      title: 'Desain yang Mengutamakan Pengguna',
      subtitle: '& Konversi',
      description: 'Kami menciptakan antarmuka yang indah dan intuitif yang menyenangkan pengguna dan mendorong hasil bisnis. Proses desain kami menggabungkan riset pengguna, wawasan berbasis data, dan keunggulan kreatif untuk memberikan pengalaman digital yang luar biasa.',
      cta: {
        primary: 'Mulai Proyek Anda',
        secondary: 'Lihat Karya Kami'
      }
    },
    workflow: {
      badge: 'Alur Kerja Desain',
      title: 'Proses Desain Kami',
      subtitle: 'Pendekatan sistematis untuk menciptakan pengalaman pengguna yang luar biasa',
      steps: [
        {
          number: '01',
          icon: Search,
          title: 'Riset Pengguna',
          description: 'Kami memulai dengan memahami pengguna Anda secara mendalam melalui metode riset komprehensif untuk mengungkap kebutuhan, perilaku, dan pain point mereka.',
          items: [
                'Wawancara dan survei pengguna',
                'Analisis kompetitor',
                'Pengembangan persona',
                'Pemetaan perjalanan pengguna',
                'Tinjauan analitik'
              ]
        },
        {
          number: '02',
          icon: PenTool,
          title: 'Wireframing',
          description: 'Transformasikan wawasan riset menjadi wireframe low-fidelity yang memetakan struktur dan alur produk digital Anda.',
          items: [
                'Arsitektur informasi',
                'Diagram alur pengguna',
                'Sketsa low-fidelity',
                'Wireframe interaktif',
                'Prototyping cepat'
              ]
        },
        {
          number: '03',
          icon: Palette,
          title: 'Desain Visual',
          description: 'Ciptakan antarmuka yang memukau dan pixel-perfect yang selaras dengan identitas brand Anda dan memikat target audiens.',
          items: [
                'Sistem desain UI',
                'Tipografi & teori warna',
                'Ikonografi & ilustrasi',
                'Desain responsif',
                'Mikro-interaksi'
              ]
        },
        {
          number: '04',
          icon: TestTube,
          title: 'Pengujian Usabilitas',
          description: 'Validasi keputusan desain melalui pengujian ketat dengan pengguna nyata untuk memastikan usabilitas optimal dan kepuasan pengguna.',
          items: [
                'Pengujian A/B',
                'Pengujian penerimaan pengguna',
                'Analisis heatmap',
                'Pengumpulan feedback',
                'Perbaikan iteratif'
              ]
        }
      ]
    },
    principles: {
      badge: 'Prinsip Desain',
      title: 'Filosofi Desain Berpusat pada Pengguna',
      subtitle: 'Setiap keputusan desain dipandu oleh pemahaman mendalam pengguna dan tujuan bisnis',
      items: [
        {
          icon: Users,
          title: 'Pendekatan Pengguna Pertama',
          description: 'Kami memulai dengan riset pengguna mendalam dan empati untuk memahami kebutuhan, perilaku, dan pain point sebenarnya sebelum mendesain satu pixel pun.',
          accent: 'blue'
        },
        {
          icon: Target,
          title: 'Desain Berorientasi Tujuan',
          description: 'Setiap elemen memiliki tujuan. Kami menyelaraskan keputusan desain dengan tujuan bisnis dan KPI yang terukur untuk memaksimalkan konversi dan engagement.',
          accent: 'purple'
        },
        {
          icon: Sparkles,
          title: 'Keunggulan Estetika',
          description: 'Desain yang indah membangun kepercayaan dan kredibilitas. Kami menciptakan antarmuka visual yang memukau yang mencerminkan brand Anda dan memikat audiens.',
          accent: 'pink'
        },
        {
          icon: Zap,
          title: 'Fokus pada Kinerja',
          description: 'Antarmuka cepat dan responsif yang bekerja mulus di semua perangkat. Kami mengoptimalkan setiap interaksi untuk kecepatan dan efisiensi.',
          accent: 'orange'
        }
      ]
    },
    capabilities: {
      badge: 'Apa yang Kami Berikan',
      title: 'Layanan Desain Komprehensif',
      subtitle: 'Dari strategi hingga implementasi, kami mencakup setiap aspek desain UX/UI',
      items: [
        {
          icon: Compass,
          title: 'Strategi UX',
          description: 'Perencanaan strategis dan roadmap pengalaman pengguna'
        },
        {
          icon: Grid3x3,
          title: 'Sistem Desain',
          description: 'Library komponen scalable dan panduan style'
        },
        {
          icon: Smartphone,
          title: 'Desain Mobile',
          description: 'Antarmuka aplikasi iOS dan Android native'
        },
        {
          icon: Monitor,
          title: 'Desain Web',
          description: 'Website responsif dan aplikasi web'
        },
        {
          icon: Layout,
          title: 'Desain Dashboard',
          description: 'Visualisasi data dan antarmuka admin'
        },
        {
          icon: Figma,
          title: 'Prototyping',
          description: 'Prototipe interaktif untuk pengujian pengguna'
        }
      ]
    },
    stats: {
      badge: 'Dampak Kami',
      title: 'Desain yang Memberikan Hasil',
      subtitle: 'Metrik terbukti dari proyek desain kami',
      items: [
        {
          value: '95',
          suffix: '%',
          label: 'Kepuasan Pengguna',
          icon: Heart
        },
        {
          value: '2.5',
          suffix: 'x',
          label: 'Peningkatan Konversi',
          icon: TrendingUp
        },
        {
          value: '40',
          suffix: '%',
          label: 'Waktu Dihemat',
          icon: Zap
        },
        {
          value: '4.8',
          suffix: '/5',
          label: 'Rating Klien',
          icon: Star
        }
      ]
    },
    tools: {
      badge: 'Tools & Teknologi',
      title: 'Tools Desain Terdepan',
      subtitle: 'Kami menggunakan tools terbaik untuk memberikan hasil luar biasa',
      categories: [
        {
          category: 'Desain',
          tools: ['Figma', 'Adobe XD', 'Sketch', 'Illustrator']
        },
        {
          category: 'Prototyping',
          tools: ['Figma', 'ProtoPie', 'Principle', 'Framer']
        },
        {
          category: 'Riset',
          tools: ['UserTesting', 'Hotjar', 'Google Analytics', 'Maze']
        },
        {
          category: 'Kolaborasi',
          tools: ['Miro', 'FigJam', 'Notion', 'Slack']
        }
      ]
    },
    benefits: {
      badge: 'Mengapa Memilih Kami',
      title: 'Keunggulan Desain Barcomp',
      subtitle: 'Bermitra dengan tim yang berkomitmen pada kesuksesan Anda',
      items: [
        {
          icon: Compass,
          title: 'Pemikiran Strategis',
          description: 'Kami menyelaraskan desain dengan strategi bisnis untuk memastikan setiap pixel berkontribusi pada tujuan Anda.'
        },
        {
          icon: Eye,
          title: 'Keputusan Berbasis Data',
          description: 'Analitik dan pengujian pengguna menginformasikan pilihan desain kami untuk kinerja optimal.'
        },
        {
          icon: Rocket,
          title: 'Iterasi Cepat',
          description: 'Proses desain agile memungkinkan penyempurnaan cepat dan peningkatan berkelanjutan.'
        },
        {
          icon: Layers,
          title: 'Sistem Desain',
          description: 'Sistem desain scalable memastikan konsistensi dan efisiensi di semua touchpoint.'
        },
        {
          icon: Smartphone,
          title: 'Keahlian Multi-Platform',
          description: 'Pengalaman mulus di web, mobile, tablet, dan platform yang sedang berkembang.'
        },
        {
          icon: Award,
          title: 'Karya Pemenang Penghargaan',
          description: 'Pengakuan dari pemimpin industri untuk keunggulan dan inovasi desain.'
        }
      ]
    },
    cta: {
      title: 'Siap Menciptakan Pengalaman Luar Biasa?',
      subtitle: 'Mari berkolaborasi untuk mendesain antarmuka yang akan disukai pengguna Anda dan menguntungkan bisnis Anda',
      button: 'Mulai Proyek Desain Anda'
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
                  <Link href="/services/ux/portfolio">
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

        {/* Design Workflow Section */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-2 bg-blue-100 rounded-full text-sm font-semibold text-[#0066FF] mb-6">
                  {t.workflow.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {t.workflow.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {t.workflow.subtitle}
                </p>
              </div>
            </FadeInSection>

            <div className="max-w-5xl mx-auto space-y-8">
              {t.workflow.steps.map((step, index) => (
                <WorkflowStep key={index} {...step} />
              ))}
            </div>
          </div>
        </section>

        {/* Design Principles Section */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-2 bg-purple-100 rounded-full text-sm font-semibold text-purple-600 mb-6">
                  {t.principles.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {t.principles.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {t.principles.subtitle}
                </p>
              </div>
            </FadeInSection>

            <div className="grid md:grid-cols-2 gap-8">
              {t.principles.items.map((principle, index) => (
                <FadeInSection key={index} delay={index * 0.1}>
                  <ValueCard {...principle} />
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-2 bg-green-100 rounded-full text-sm font-semibold text-green-600 mb-6">
                  {t.capabilities.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {t.capabilities.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {t.capabilities.subtitle}
                </p>
              </div>
            </FadeInSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.capabilities.items.map((item, index) => (
                <FadeInSection key={index} delay={index * 0.05}>
                  <Card className="border-gray-200 hover:border-[#0066FF] hover:shadow-xl transition-all duration-300 group h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-[#0066FF] transition-colors duration-300 flex-shrink-0">
                          <item.icon className="w-6 h-6 text-[#0066FF] group-hover:text-white transition-colors duration-300" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2 group-hover:text-[#0066FF] transition-colors duration-300">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {item.description}
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

        {/* Stats Section */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-2 bg-orange-100 rounded-full text-sm font-semibold text-orange-600 mb-6">
                  {t.stats.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {t.stats.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {t.stats.subtitle}
                </p>
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

        {/* Tools Section */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-2 bg-indigo-100 rounded-full text-sm font-semibold text-indigo-600 mb-6">
                  {t.tools.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {t.tools.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {t.tools.subtitle}
                </p>
              </div>
            </FadeInSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {t.tools.categories.map((item, index) => (
                <FadeInSection key={index} delay={index * 0.05}>
                  <Card className="border-gray-200 hover:border-[#0066FF] hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-gray-900 mb-4 text-lg group-hover:text-[#0066FF] transition-colors duration-300">
                        {item.category}
                      </h4>
                      <div className="space-y-2">
                        {item.tools.map((tool, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{tool}</span>
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

        {/* Benefits Section */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-2 bg-pink-100 rounded-full text-sm font-semibold text-pink-600 mb-6">
                  {t.benefits.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {t.benefits.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
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
                <Palette className="w-16 h-16 mx-auto mb-6 text-white" />
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