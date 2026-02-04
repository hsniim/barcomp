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
  const [language, setLanguage] = useState('en');

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
      badge: language === 'en' ? 'UI/UX Design Excellence' : 'Keunggulan Desain UI/UX',
      title: language === 'en' ? 'Design that Prioritizes Users' : 'Desain yang Mengutamakan Pengguna',
      subtitle: language === 'en' 
        ? '& Conversion'
        : '& Konversi',
      description: language === 'en'
        ? 'We craft beautiful, intuitive interfaces that delight users and drive business results. Our design process combines user research, data-driven insights, and creative excellence to deliver exceptional digital experiences.'
        : 'Kami menciptakan antarmuka yang indah dan intuitif yang menyenangkan pengguna dan mendorong hasil bisnis. Proses desain kami menggabungkan riset pengguna, wawasan berbasis data, dan keunggulan kreatif untuk memberikan pengalaman digital yang luar biasa.',
      cta: {
        primary: language === 'en' ? 'Start Your Project' : 'Mulai Proyek Anda',
        secondary: language === 'en' ? 'View Our Work' : 'Lihat Karya Kami'
      }
    },
    workflow: {
      badge: language === 'en' ? 'Design Workflow' : 'Alur Kerja Desain',
      title: language === 'en' ? 'Our Design Process' : 'Proses Desain Kami',
      subtitle: language === 'en'
        ? 'A systematic approach to creating exceptional user experiences'
        : 'Pendekatan sistematis untuk menciptakan pengalaman pengguna yang luar biasa',
      steps: [
        {
          number: '01',
          icon: Search,
          title: language === 'en' ? 'User Research' : 'Riset Pengguna',
          description: language === 'en'
            ? 'We start by deeply understanding your users through comprehensive research methods to uncover their needs, behaviors, and pain points.'
            : 'Kami memulai dengan memahami pengguna Anda secara mendalam melalui metode riset komprehensif untuk mengungkap kebutuhan, perilaku, dan pain point mereka.',
          items: language === 'en' 
            ? [
                'User interviews and surveys',
                'Competitive analysis',
                'Persona development',
                'User journey mapping',
                'Analytics review'
              ]
            : [
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
          title: language === 'en' ? 'Wireframing' : 'Wireframing',
          description: language === 'en'
            ? 'Transform research insights into low-fidelity wireframes that map out the structure and flow of your digital product.'
            : 'Transformasikan wawasan riset menjadi wireframe low-fidelity yang memetakan struktur dan alur produk digital Anda.',
          items: language === 'en'
            ? [
                'Information architecture',
                'User flow diagrams',
                'Low-fidelity sketches',
                'Interactive wireframes',
                'Rapid prototyping'
              ]
            : [
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
          title: language === 'en' ? 'Visual Design' : 'Desain Visual',
          description: language === 'en'
            ? 'Create stunning, pixel-perfect interfaces that align with your brand identity and captivate your target audience.'
            : 'Ciptakan antarmuka yang memukau dan pixel-perfect yang selaras dengan identitas brand Anda dan memikat target audiens.',
          items: language === 'en'
            ? [
                'UI design system',
                'Typography & color theory',
                'Iconography & illustrations',
                'Responsive design',
                'Micro-interactions'
              ]
            : [
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
          title: language === 'en' ? 'Usability Testing' : 'Pengujian Usabilitas',
          description: language === 'en'
            ? 'Validate design decisions through rigorous testing with real users to ensure optimal usability and user satisfaction.'
            : 'Validasi keputusan desain melalui pengujian ketat dengan pengguna nyata untuk memastikan usabilitas optimal dan kepuasan pengguna.',
          items: language === 'en'
            ? [
                'A/B testing',
                'User acceptance testing',
                'Heatmap analysis',
                'Feedback collection',
                'Iterative improvements'
              ]
            : [
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
      badge: language === 'en' ? 'Design Principles' : 'Prinsip Desain',
      title: language === 'en' ? 'User-Centered Design Philosophy' : 'Filosofi Desain Berpusat pada Pengguna',
      subtitle: language === 'en'
        ? 'Every design decision is guided by deep user understanding and business goals'
        : 'Setiap keputusan desain dipandu oleh pemahaman mendalam pengguna dan tujuan bisnis',
      items: [
        {
          icon: Users,
          title: language === 'en' ? 'User-First Approach' : 'Pendekatan Pengguna Pertama',
          description: language === 'en'
            ? 'We start with deep user research and empathy to understand real needs, behaviors, and pain points before designing a single pixel.'
            : 'Kami memulai dengan riset pengguna mendalam dan empati untuk memahami kebutuhan, perilaku, dan pain point sebenarnya sebelum mendesain satu pixel pun.',
          accent: 'blue'
        },
        {
          icon: Target,
          title: language === 'en' ? 'Goal-Driven Design' : 'Desain Berorientasi Tujuan',
          description: language === 'en'
            ? 'Every element serves a purpose. We align design decisions with business objectives and measurable KPIs to maximize conversion and engagement.'
            : 'Setiap elemen memiliki tujuan. Kami menyelaraskan keputusan desain dengan tujuan bisnis dan KPI yang terukur untuk memaksimalkan konversi dan engagement.',
          accent: 'purple'
        },
        {
          icon: Sparkles,
          title: language === 'en' ? 'Aesthetic Excellence' : 'Keunggulan Estetika',
          description: language === 'en'
            ? 'Beautiful design builds trust and credibility. We create visually stunning interfaces that reflect your brand and captivate your audience.'
            : 'Desain yang indah membangun kepercayaan dan kredibilitas. Kami menciptakan antarmuka visual yang memukau yang mencerminkan brand Anda dan memikat audiens.',
          accent: 'pink'
        },
        {
          icon: Zap,
          title: language === 'en' ? 'Performance Focused' : 'Fokus pada Kinerja',
          description: language === 'en'
            ? 'Fast, responsive interfaces that work seamlessly across all devices. We optimize every interaction for speed and efficiency.'
            : 'Antarmuka cepat dan responsif yang bekerja mulus di semua perangkat. Kami mengoptimalkan setiap interaksi untuk kecepatan dan efisiensi.',
          accent: 'orange'
        }
      ]
    },
    capabilities: {
      badge: language === 'en' ? 'What We Deliver' : 'Apa yang Kami Berikan',
      title: language === 'en' ? 'Comprehensive Design Services' : 'Layanan Desain Komprehensif',
      subtitle: language === 'en'
        ? 'From strategy to implementation, we cover every aspect of UX/UI design'
        : 'Dari strategi hingga implementasi, kami mencakup setiap aspek desain UX/UI',
      items: [
        {
          icon: Compass,
          title: language === 'en' ? 'UX Strategy' : 'Strategi UX',
          description: language === 'en'
            ? 'Strategic planning and user experience roadmaps'
            : 'Perencanaan strategis dan roadmap pengalaman pengguna'
        },
        {
          icon: Grid3x3,
          title: language === 'en' ? 'Design Systems' : 'Sistem Desain',
          description: language === 'en'
            ? 'Scalable component libraries and style guides'
            : 'Library komponen scalable dan panduan style'
        },
        {
          icon: Smartphone,
          title: language === 'en' ? 'Mobile Design' : 'Desain Mobile',
          description: language === 'en'
            ? 'Native iOS and Android app interfaces'
            : 'Antarmuka aplikasi iOS dan Android native'
        },
        {
          icon: Monitor,
          title: language === 'en' ? 'Web Design' : 'Desain Web',
          description: language === 'en'
            ? 'Responsive websites and web applications'
            : 'Website responsif dan aplikasi web'
        },
        {
          icon: Layout,
          title: language === 'en' ? 'Dashboard Design' : 'Desain Dashboard',
          description: language === 'en'
            ? 'Data visualization and admin interfaces'
            : 'Visualisasi data dan antarmuka admin'
        },
        {
          icon: Figma,
          title: language === 'en' ? 'Prototyping' : 'Prototyping',
          description: language === 'en'
            ? 'Interactive prototypes for user testing'
            : 'Prototipe interaktif untuk pengujian pengguna'
        }
      ]
    },
    stats: {
      badge: language === 'en' ? 'Our Impact' : 'Dampak Kami',
      title: language === 'en' ? 'Design That Delivers Results' : 'Desain yang Memberikan Hasil',
      subtitle: language === 'en'
        ? 'Proven metrics from our design projects'
        : 'Metrik terbukti dari proyek desain kami',
      items: [
        {
          value: '95',
          suffix: '%',
          label: language === 'en' ? 'User Satisfaction' : 'Kepuasan Pengguna',
          icon: Heart
        },
        {
          value: '2.5',
          suffix: 'x',
          label: language === 'en' ? 'Conversion Increase' : 'Peningkatan Konversi',
          icon: TrendingUp
        },
        {
          value: '40',
          suffix: '%',
          label: language === 'en' ? 'Time Saved' : 'Waktu Dihemat',
          icon: Zap
        },
        {
          value: '4.8',
          suffix: '/5',
          label: language === 'en' ? 'Client Rating' : 'Rating Klien',
          icon: Star
        }
      ]
    },
    tools: {
      badge: language === 'en' ? 'Tools & Technologies' : 'Tools & Teknologi',
      title: language === 'en' ? 'Industry-Leading Design Tools' : 'Tools Desain Terdepan',
      subtitle: language === 'en'
        ? 'We use the best tools to deliver exceptional results'
        : 'Kami menggunakan tools terbaik untuk memberikan hasil luar biasa',
      categories: [
        {
          category: language === 'en' ? 'Design' : 'Desain',
          tools: ['Figma', 'Adobe XD', 'Sketch', 'Illustrator']
        },
        {
          category: language === 'en' ? 'Prototyping' : 'Prototyping',
          tools: ['Figma', 'ProtoPie', 'Principle', 'Framer']
        },
        {
          category: language === 'en' ? 'Research' : 'Riset',
          tools: ['UserTesting', 'Hotjar', 'Google Analytics', 'Maze']
        },
        {
          category: language === 'en' ? 'Collaboration' : 'Kolaborasi',
          tools: ['Miro', 'FigJam', 'Notion', 'Slack']
        }
      ]
    },
    benefits: {
      badge: language === 'en' ? 'Why Choose Us' : 'Mengapa Memilih Kami',
      title: language === 'en' ? 'The Barcomp Design Advantage' : 'Keunggulan Desain Barcomp',
      subtitle: language === 'en'
        ? 'Partner with a team committed to your success'
        : 'Bermitra dengan tim yang berkomitmen pada kesuksesan Anda',
      items: [
        {
          icon: Compass,
          title: language === 'en' ? 'Strategic Thinking' : 'Pemikiran Strategis',
          description: language === 'en'
            ? 'We align design with business strategy to ensure every pixel contributes to your goals.'
            : 'Kami menyelaraskan desain dengan strategi bisnis untuk memastikan setiap pixel berkontribusi pada tujuan Anda.'
        },
        {
          icon: Eye,
          title: language === 'en' ? 'Data-Driven Decisions' : 'Keputusan Berbasis Data',
          description: language === 'en'
            ? 'Analytics and user testing inform our design choices for optimal performance.'
            : 'Analitik dan pengujian pengguna menginformasikan pilihan desain kami untuk kinerja optimal.'
        },
        {
          icon: Rocket,
          title: language === 'en' ? 'Fast Iteration' : 'Iterasi Cepat',
          description: language === 'en'
            ? 'Agile design process allows for quick refinements and continuous improvement.'
            : 'Proses desain agile memungkinkan penyempurnaan cepat dan peningkatan berkelanjutan.'
        },
        {
          icon: Layers,
          title: language === 'en' ? 'Design Systems' : 'Sistem Desain',
          description: language === 'en'
            ? 'Scalable design systems ensure consistency and efficiency across all touchpoints.'
            : 'Sistem desain scalable memastikan konsistensi dan efisiensi di semua touchpoint.'
        },
        {
          icon: Smartphone,
          title: language === 'en' ? 'Multi-Platform Expertise' : 'Keahlian Multi-Platform',
          description: language === 'en'
            ? 'Seamless experiences across web, mobile, tablet, and emerging platforms.'
            : 'Pengalaman mulus di web, mobile, tablet, dan platform yang sedang berkembang.'
        },
        {
          icon: Award,
          title: language === 'en' ? 'Award-Winning Work' : 'Karya Pemenang Penghargaan',
          description: language === 'en'
            ? 'Recognition from industry leaders for design excellence and innovation.'
            : 'Pengakuan dari pemimpin industri untuk keunggulan dan inovasi desain.'
        }
      ]
    },
    cta: {
      title: language === 'en' ? 'Ready to Create Exceptional Experiences?' : 'Siap Menciptakan Pengalaman Luar Biasa?',
      subtitle: language === 'en'
        ? "Let's collaborate to design interfaces that your users will love and your business will benefit from"
        : 'Mari berkolaborasi untuk mendesain antarmuka yang akan disukai pengguna Anda dan menguntungkan bisnis Anda',
      button: language === 'en' ? 'Start Your Design Project' : 'Mulai Proyek Desain Anda'
    }
  }), [language]);

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