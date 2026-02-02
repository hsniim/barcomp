'use client';

import { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import { 
  Target,
  Rocket,
  Globe,
  TrendingUp,
  Zap,
  Star,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Users,
  Building2,
  Award,
  Compass,
  Map,
  Flag,
  Sparkles,
  ChevronRight
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

// Vision Card Component
const VisionCard = memo(({ icon: Icon, title, description, accent }) => {
  return (
    <Card className="h-full border-gray-200 hover:border-[#0066FF] hover:shadow-xl transition-all duration-300 group overflow-hidden">
      <CardContent className="p-8 relative">
        <div className={cn(
          "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500",
          accent === 'blue' && 'bg-blue-500',
          accent === 'purple' && 'bg-purple-500',
          accent === 'green' && 'bg-green-500'
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

VisionCard.displayName = 'VisionCard';

// Mission Item Component
const MissionItem = memo(({ icon: Icon, title, description, index }) => {
  return (
    <FadeInSection delay={index * 0.1}>
      <div className="flex gap-4 group">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-[#0066FF] transition-colors duration-300">
            <Icon className="w-6 h-6 text-[#0066FF] group-hover:text-white transition-colors duration-300" />
          </div>
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#0066FF] transition-colors duration-300">
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

MissionItem.displayName = 'MissionItem';

// Roadmap Card Component
const RoadmapCard = memo(({ year, phase, title, goals, status, isHighlight }) => {
  return (
    <FadeInSection>
      <Card className={cn(
        "border-2 transition-all duration-300 hover:shadow-xl",
        isHighlight 
          ? "border-[#0066FF] bg-gradient-to-br from-blue-50 to-indigo-50" 
          : "border-gray-200 hover:border-[#0066FF]"
      )}>
        <CardContent className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl font-bold text-[#0066FF]">{year}</span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide",
                  status === 'current' && "bg-green-100 text-green-700",
                  status === 'upcoming' && "bg-blue-100 text-blue-700",
                  status === 'future' && "bg-purple-100 text-purple-700"
                )}>
                  {status === 'current' && '● Current'}
                  {status === 'upcoming' && '◐ Upcoming'}
                  {status === 'future' && '○ Future'}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {phase}
              </h4>
              <h3 className="text-2xl font-bold text-gray-900">
                {title}
              </h3>
            </div>
            {isHighlight && (
              <Sparkles className="w-8 h-8 text-[#0066FF]" />
            )}
          </div>
          
          <div className="space-y-3">
            {goals.map((goal, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 leading-relaxed">{goal}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </FadeInSection>
  );
});

RoadmapCard.displayName = 'RoadmapCard';

// Pillar Card Component
const PillarCard = memo(({ icon: Icon, title, description, initiatives }) => {
  return (
    <FadeInSection>
      <Card className="h-full border-gray-200 hover:border-[#0066FF] hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0066FF] transition-colors duration-300">
                {title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            {initiatives.map((initiative, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
                <span>{initiative}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </FadeInSection>
  );
});

PillarCard.displayName = 'PillarCard';

export default function VisionPage() {
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

  const t = {
    hero: {
      badge: language === 'en' ? 'Our Aspirations and Goals' : 'Aspirasi dan Tujuan Kami',
      title: language === 'en' ? 'Shaping the Future of' : 'Membentuk Masa Depan',
      subtitle: language === 'en' ? 'Digital Innovation' : 'Inovasi Digital',
      description: language === 'en'
        ? "We envision a future where technology empowers every business to reach its full potential. Through innovation, collaboration, and unwavering commitment to excellence, we are building tomorrow's digital landscape today."
        : 'Kami membayangkan masa depan di mana teknologi memberdayakan setiap bisnis untuk mencapai potensi penuhnya. Melalui inovasi, kolaborasi, dan komitmen teguh pada keunggulan, kami membangun lanskap digital masa depan hari ini.'
    },
    vision: {
      badge: language === 'en' ? 'Our Vision' : 'Visi Kami',
      title: language === 'en' ? 'Leading Digital Transformation in Southeast Asia' : 'Memimpin Transformasi Digital di Asia Tenggara',
      subtitle: language === 'en'
        ? 'By 2030, we aspire to be the most trusted and innovative digital solutions provider, empowering businesses across the region to thrive in the digital age.'
        : 'Pada tahun 2030, kami bercita-cita menjadi penyedia solusi digital paling terpercaya dan inovatif, memberdayakan bisnis di seluruh region untuk berkembang di era digital.',
      cards: [
        {
          icon: Globe,
          title: language === 'en' ? 'Regional Leadership' : 'Kepemimpinan Regional',
          description: language === 'en'
            ? 'Establish presence across Southeast Asia, serving 1000+ enterprises with world-class digital solutions and setting industry standards for innovation.'
            : 'Membangun kehadiran di seluruh Asia Tenggara, melayani 1000+ perusahaan dengan solusi digital kelas dunia dan menetapkan standar industri untuk inovasi.',
          accent: 'blue'
        },
        {
          icon: Lightbulb,
          title: language === 'en' ? 'Innovation Pioneer' : 'Pelopor Inovasi',
          description: language === 'en'
            ? 'Lead the adoption of emerging technologies including AI, blockchain, and cloud computing to create transformative solutions for our clients.'
            : 'Memimpin adopsi teknologi emerging termasuk AI, blockchain, dan cloud computing untuk menciptakan solusi transformatif bagi klien kami.',
          accent: 'purple'
        },
        {
          icon: Users,
          title: language === 'en' ? 'Empowering Teams' : 'Memberdayakan Tim',
          description: language === 'en'
            ? 'Build a team of 200+ exceptional professionals, fostering a culture of continuous learning, innovation, and excellence in everything we do.'
            : 'Membangun tim 200+ profesional luar biasa, memupuk budaya pembelajaran berkelanjutan, inovasi, dan keunggulan dalam segala yang kami lakukan.',
          accent: 'green'
        }
      ]
    },
    mission: {
      badge: language === 'en' ? 'Our Mission' : 'Misi Kami',
      title: language === 'en' ? 'How We Make It Happen' : 'Bagaimana Kami Mewujudkannya',
      subtitle: language === 'en'
        ? 'Our mission drives every decision, every project, and every innovation we pursue.'
        : 'Misi kami mendorong setiap keputusan, setiap proyek, dan setiap inovasi yang kami kejar.',
      items: [
        {
          icon: Zap,
          title: language === 'en' ? 'Deliver Excellence' : 'Memberikan Keunggulan',
          description: language === 'en'
            ? 'Create cutting-edge digital solutions that exceed client expectations and drive measurable business results.'
            : 'Menciptakan solusi digital mutakhir yang melampaui ekspektasi klien dan mendorong hasil bisnis yang terukur.'
        },
        {
          icon: Target,
          title: language === 'en' ? 'Client Success First' : 'Kesuksesan Klien Utama',
          description: language === 'en'
            ? "Partner closely with clients to understand their unique challenges and deliver tailored solutions that truly make a difference."
            : 'Bermitra erat dengan klien untuk memahami tantangan unik mereka dan memberikan solusi yang disesuaikan yang benar-benar membuat perbedaan.'
        },
        {
          icon: Rocket,
          title: language === 'en' ? 'Continuous Innovation' : 'Inovasi Berkelanjutan',
          description: language === 'en'
            ? 'Stay at the forefront of technology by investing in research, development, and the continuous upskilling of our team.'
            : 'Tetap di garis depan teknologi dengan berinvestasi dalam penelitian, pengembangan, dan peningkatan keterampilan berkelanjutan tim kami.'
        },
        {
          icon: Building2,
          title: language === 'en' ? 'Build Lasting Partnerships' : 'Membangun Kemitraan Jangka Panjang',
          description: language === 'en'
            ? 'Foster long-term relationships based on trust, transparency, and mutual growth with clients, partners, and communities.'
            : 'Membangun hubungan jangka panjang berdasarkan kepercayaan, transparansi, dan pertumbuhan bersama dengan klien, mitra, dan komunitas.'
        },
        {
          icon: Award,
          title: language === 'en' ? 'Maintain Quality Standards' : 'Menjaga Standar Kualitas',
          description: language === 'en'
            ? 'Uphold the highest standards of quality, security, and reliability in every solution we deliver, certified by international standards.'
            : 'Menjunjung standar kualitas, keamanan, dan keandalan tertinggi dalam setiap solusi yang kami berikan, tersertifikasi oleh standar internasional.'
        },
        {
          icon: Compass,
          title: language === 'en' ? 'Lead with Integrity' : 'Memimpin dengan Integritas',
          description: language === 'en'
            ? 'Conduct business with honesty, ethical practices, and social responsibility in everything we do.'
            : 'Menjalankan bisnis dengan kejujuran, praktik etis, dan tanggung jawab sosial dalam segala yang kami lakukan.'
        }
      ]
    },
    roadmap: {
      badge: language === 'en' ? 'Strategic Roadmap' : 'Roadmap Strategis',
      title: language === 'en' ? 'Our Journey to 2030' : 'Perjalanan Kami Menuju 2030',
      subtitle: language === 'en'
        ? 'A clear, ambitious path forward with measurable milestones and transformative goals.'
        : 'Jalur yang jelas dan ambisius dengan milestone yang terukur dan tujuan transformatif.',
      items: [
        {
          year: '2025-2026',
          phase: language === 'en' ? 'Phase I: Consolidation' : 'Fase I: Konsolidasi',
          title: language === 'en' ? 'Strengthening Foundations' : 'Memperkuat Fondasi',
          status: 'current',
          isHighlight: true,
          goals: language === 'en' ? [
            'Expand team to 75+ professionals across specialized departments',
            'Achieve ISO 27001 (Information Security) certification',
            'Launch 3 new service offerings in AI/ML and automation',
            'Establish strategic partnerships with 5 major tech providers',
            'Serve 250+ active clients with 98% satisfaction rate'
          ] : [
            'Memperluas tim menjadi 75+ profesional di berbagai departemen khusus',
            'Meraih sertifikasi ISO 27001 (Keamanan Informasi)',
            'Meluncurkan 3 penawaran layanan baru dalam AI/ML dan otomasi',
            'Membangun kemitraan strategis dengan 5 penyedia teknologi besar',
            'Melayani 250+ klien aktif dengan tingkat kepuasan 98%'
          ]
        },
        {
          year: '2027-2028',
          phase: language === 'en' ? 'Phase II: Expansion' : 'Fase II: Ekspansi',
          title: language === 'en' ? 'Regional Growth' : 'Pertumbuhan Regional',
          status: 'upcoming',
          isHighlight: false,
          goals: language === 'en' ? [
            'Open branch offices in Singapore and Malaysia',
            'Grow team to 150+ professionals with international talent',
            'Launch Barcomp Academy for client training and certification',
            'Develop proprietary SaaS products for enterprise clients',
            'Achieve 500+ enterprise clients across Southeast Asia',
            'Establish venture capital arm for tech startups'
          ] : [
            'Membuka kantor cabang di Singapura dan Malaysia',
            'Menumbuhkan tim menjadi 150+ profesional dengan talenta internasional',
            'Meluncurkan Barcomp Academy untuk pelatihan dan sertifikasi klien',
            'Mengembangkan produk SaaS proprietary untuk klien enterprise',
            'Meraih 500+ klien enterprise di seluruh Asia Tenggara',
            'Membangun divisi venture capital untuk startup teknologi'
          ]
        },
        {
          year: '2029-2030',
          phase: language === 'en' ? 'Phase III: Leadership' : 'Fase III: Kepemimpinan',
          title: language === 'en' ? 'Industry Pioneer' : 'Pelopor Industri',
          status: 'future',
          isHighlight: false,
          goals: language === 'en' ? [
            'Establish presence in 6+ Southeast Asian countries',
            'Team of 200+ elite professionals and thought leaders',
            'Lead industry conferences and publish thought leadership',
            'Launch innovation lab for R&D in emerging technologies',
            'Achieve 1000+ clients with 50+ Fortune 500 companies',
            'Recognized as Top 10 digital solutions provider in SEA'
          ] : [
            'Membangun kehadiran di 6+ negara Asia Tenggara',
            'Tim 200+ profesional elite dan pemimpin pemikiran',
            'Memimpin konferensi industri dan menerbitkan thought leadership',
            'Meluncurkan innovation lab untuk R&D dalam teknologi emerging',
            'Meraih 1000+ klien dengan 50+ perusahaan Fortune 500',
            'Diakui sebagai Top 10 penyedia solusi digital di SEA'
          ]
        }
      ]
    },
    pillars: {
      badge: language === 'en' ? 'Strategic Pillars' : 'Pilar Strategis',
      title: language === 'en' ? 'Four Pillars of Growth' : 'Empat Pilar Pertumbuhan',
      subtitle: language === 'en'
        ? 'Our strategic focus areas that guide investment, innovation, and organizational development.'
        : 'Area fokus strategis kami yang memandu investasi, inovasi, dan pengembangan organisasi.',
      items: [
        {
          icon: TrendingUp,
          title: language === 'en' ? 'Technology Excellence' : 'Keunggulan Teknologi',
          description: language === 'en'
            ? 'Leading the adoption and mastery of cutting-edge technologies'
            : 'Memimpin adopsi dan penguasaan teknologi mutakhir',
          initiatives: language === 'en' ? [
            'AI & Machine Learning Center of Excellence',
            'Cloud Architecture & DevOps practices',
            'Blockchain & Web3 innovation lab',
            'Cybersecurity & data protection expertise'
          ] : [
            'AI & Machine Learning Center of Excellence',
            'Praktik Cloud Architecture & DevOps',
            'Lab inovasi Blockchain & Web3',
            'Keahlian Cybersecurity & perlindungan data'
          ]
        },
        {
          icon: Users,
          title: language === 'en' ? 'Talent Development' : 'Pengembangan Talenta',
          description: language === 'en'
            ? 'Building and nurturing world-class teams'
            : 'Membangun dan memelihara tim kelas dunia',
          initiatives: language === 'en' ? [
            'Continuous learning & certification programs',
            'Leadership development initiatives',
            'Innovation challenges & hackathons',
            'Competitive compensation & benefits'
          ] : [
            'Program pembelajaran berkelanjutan & sertifikasi',
            'Inisiatif pengembangan kepemimpinan',
            'Tantangan inovasi & hackathon',
            'Kompensasi & benefit kompetitif'
          ]
        },
        {
          icon: Globe,
          title: language === 'en' ? 'Market Expansion' : 'Ekspansi Pasar',
          description: language === 'en'
            ? 'Growing our footprint across Southeast Asia'
            : 'Mengembangkan jejak kami di seluruh Asia Tenggara',
          initiatives: language === 'en' ? [
            'Strategic partnerships with regional players',
            'Industry-specific solution development',
            'Multi-country service delivery capability',
            'Local market expertise & cultural understanding'
          ] : [
            'Kemitraan strategis dengan pemain regional',
            'Pengembangan solusi spesifik industri',
            'Kapabilitas penyampaian layanan multi-negara',
            'Keahlian pasar lokal & pemahaman budaya'
          ]
        },
        {
          icon: Star,
          title: language === 'en' ? 'Client Success' : 'Kesuksesan Klien',
          description: language === 'en'
            ? 'Ensuring exceptional outcomes for every client'
            : 'Memastikan hasil luar biasa untuk setiap klien',
          initiatives: language === 'en' ? [
            'Dedicated success management teams',
            'Outcome-based engagement models',
            'Regular business reviews & optimization',
            'Long-term partnership approach'
          ] : [
            'Tim manajemen kesuksesan khusus',
            'Model engagement berbasis hasil',
            'Tinjauan bisnis reguler & optimisasi',
            'Pendekatan kemitraan jangka panjang'
          ]
        }
      ]
    },
    cta: {
      title: language === 'en' ? 'Join Us on This Journey' : 'Bergabunglah Bersama Kami',
      subtitle: language === 'en'
        ? "Whether you're a client, partner, or future team member, we'd love to have you be part of our vision for the future."
        : 'Baik Anda klien, mitra, atau calon anggota tim, kami ingin Anda menjadi bagian dari visi kami untuk masa depan.',
      button: language === 'en' ? 'Explore Opportunities' : 'Jelajahi Peluang'
    }
  };

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0066FF] via-[#0052CC] to-[#003D99] text-white">
          <div className="absolute inset-0 bg-grid-white/10" />
          
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl opacity-10 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          
          <div className="relative container mx-auto max-w-7xl px-6 lg:px-8 py-24 lg:py-32">
            <FadeInSection>
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/20">
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-medium">{t.hero.badge}</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                  {t.hero.title}
                  <span className="block bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent mt-2">
                    {t.hero.subtitle}
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
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

        {/* Vision Section */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-2 bg-blue-100 rounded-full text-sm font-semibold text-[#0066FF] mb-6">
                  {t.vision.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {t.vision.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {t.vision.subtitle}
                </p>
              </div>
            </FadeInSection>

            <div className="grid md:grid-cols-3 gap-8">
              {t.vision.cards.map((card, index) => (
                <FadeInSection key={index} delay={index * 0.1}>
                  <VisionCard {...card} />
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-2 bg-indigo-100 rounded-full text-sm font-semibold text-indigo-600 mb-6">
                  {t.mission.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  {t.mission.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                  {t.mission.subtitle}
                </p>
              </div>
            </FadeInSection>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {t.mission.items.map((item, index) => (
                <MissionItem key={index} {...item} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-2 bg-purple-100 rounded-full text-sm font-semibold text-purple-600 mb-6">
                  {t.roadmap.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  {t.roadmap.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                  {t.roadmap.subtitle}
                </p>
              </div>
            </FadeInSection>

            <div className="space-y-8 max-w-5xl mx-auto">
              {t.roadmap.items.map((item, index) => (
                <RoadmapCard key={index} {...item} />
              ))}
            </div>

            {/* Timeline Visual */}
            <FadeInSection delay={0.3}>
              <div className="mt-16 relative">
                <div className="flex items-center justify-between max-w-4xl mx-auto">
                  <div className="text-center flex-1">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3 shadow-lg">
                      <Flag className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">2025-2026</p>
                    <p className="text-xs text-gray-500">Current</p>
                  </div>
                  
                  <div className="flex-1 h-1 bg-gradient-to-r from-green-500 to-blue-500" />
                  
                  <div className="text-center flex-1">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3 shadow-lg">
                      <Map className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">2027-2028</p>
                    <p className="text-xs text-gray-500">Upcoming</p>
                  </div>
                  
                  <div className="flex-1 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                  
                  <div className="text-center flex-1">
                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3 shadow-lg">
                      <Star className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">2029-2030</p>
                    <p className="text-xs text-gray-500">Future</p>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Strategic Pillars Section */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-2 bg-green-100 rounded-full text-sm font-semibold text-green-600 mb-6">
                  {t.pillars.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  {t.pillars.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                  {t.pillars.subtitle}
                </p>
              </div>
            </FadeInSection>

            <div className="grid md:grid-cols-2 gap-8">
              {t.pillars.items.map((pillar, index) => (
                <PillarCard key={index} {...pillar} />
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
                <Rocket className="w-16 h-16 mx-auto mb-6 text-white" />
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