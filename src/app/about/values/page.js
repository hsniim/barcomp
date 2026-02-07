'use client';

import { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import { 
  Heart,
  Lightbulb,
  Shield,
  Users,
  TrendingUp,
  Award,
  Star,
  Zap,
  Target,
  Compass,
  Coffee,
  Code,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Handshake,
  Briefcase,
  GraduationCap,
  Medal
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

// Value Card Component (Large Feature Cards)
const ValueCard = memo(({ icon: Icon, title, description, color }) => {
  return (
    <Card className="h-full border-2 border-gray-200 hover:border-[#0066FF] hover:shadow-2xl transition-all duration-500 group overflow-hidden">
      <CardContent className="p-8 sm:p-10 relative">
        {/* Background decoration */}
        <div className={cn(
          "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700",
          color === 'blue' && 'bg-blue-400',
          color === 'purple' && 'bg-purple-400',
          color === 'green' && 'bg-green-400',
          color === 'orange' && 'bg-orange-400',
          color === 'pink' && 'bg-pink-400',
          color === 'indigo' && 'bg-indigo-400'
        )} />
        
        <div className="relative">
          {/* Icon */}
          <div className={cn(
            "w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500",
            color === 'blue' && 'bg-gradient-to-br from-blue-500 to-blue-600',
            color === 'purple' && 'bg-gradient-to-br from-purple-500 to-purple-600',
            color === 'green' && 'bg-gradient-to-br from-green-500 to-green-600',
            color === 'orange' && 'bg-gradient-to-br from-orange-500 to-orange-600',
            color === 'pink' && 'bg-gradient-to-br from-pink-500 to-pink-600',
            color === 'indigo' && 'bg-gradient-to-br from-indigo-500 to-indigo-600'
          )}>
            <Icon className="w-10 h-10 text-white" />
          </div>
          
          {/* Content */}
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 group-hover:text-[#0066FF] transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed text-lg">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
});

ValueCard.displayName = 'ValueCard';

// Culture Feature Component
const CultureFeature = memo(({ icon: Icon, title, description, items }) => {
  return (
    <FadeInSection>
      <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-[#0066FF] hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-xl group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#0066FF] transition-colors duration-300">
              {title}
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              {description}
            </p>
          </div>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-3 ml-0 sm:ml-16">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </FadeInSection>
  );
});

CultureFeature.displayName = 'CultureFeature';

// Certification Impact Card
const CertificationImpact = memo(({ icon: Icon, certification, impact, standards }) => {
  return (
    <FadeInSection>
      <Card className="h-full border-gray-200 hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors duration-300">
                {certification}
              </h4>
            </div>
          </div>
          
          <div className="mb-6">
            <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Impact on Our Work</h5>
            <p className="text-gray-700 leading-relaxed">
              {impact}
            </p>
          </div>
          
          <div>
            <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Standards We Follow</h5>
            <div className="space-y-2">
              {standards.map((standard, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
                  <span className="text-sm text-gray-700">{standard}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </FadeInSection>
  );
});

CertificationImpact.displayName = 'CertificationImpact';

// Life at Barcomp Item
const LifeAtBarcompItem = memo(({ icon: Icon, title, description }) => {
  return (
    <div className="flex gap-4 p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:border-[#0066FF] hover:shadow-lg transition-all duration-300 group">
      <div className="flex-shrink-0">
        <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-[#0066FF] transition-colors duration-300">
          <Icon className="w-7 h-7 text-[#0066FF] group-hover:text-white transition-colors duration-300" />
        </div>
      </div>
      <div>
        <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#0066FF] transition-colors duration-300">
          {title}
        </h4>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
});

LifeAtBarcompItem.displayName = 'LifeAtBarcompItem';

export default function ValuesPage() {
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
      badge: language === 'en' ? 'Culture & Ethos' : 'Budaya & Etos',
      title: language === 'en' ? 'Values That' : 'Nilai-Nilai Yang',
      subtitle: language === 'en' ? 'Drive Everything We Do' : 'Menggerakkan Semua Yang Kami Lakukan',
      description: language === 'en'
        ? "Our values are not just words on a wall—they are the foundation of how we work, collaborate, and deliver excellence every single day."
        : 'Nilai-nilai kami bukan sekadar kata-kata di dinding—ini adalah fondasi bagaimana kami bekerja, berkolaborasi, dan memberikan keunggulan setiap hari.'
    },
    coreValues: {
      badge: language === 'en' ? 'Core Values' : 'Nilai Inti',
      title: language === 'en' ? 'Six Principles That Define Us' : 'Enam Prinsip Yang Mendefinisikan Kami',
      subtitle: language === 'en'
        ? 'These values guide every decision, every project, and every interaction with our clients and team members.'
        : 'Nilai-nilai ini memandu setiap keputusan, setiap proyek, dan setiap interaksi dengan klien dan anggota tim kami.',
      values: [
        {
          icon: Lightbulb,
          title: language === 'en' ? 'Innovation' : 'Inovasi',
          description: language === 'en'
            ? "We constantly push boundaries and embrace new technologies. Innovation is not just about tools—it's a mindset that drives us to find better solutions every day."
            : 'Kami terus mendorong batasan dan mengadopsi teknologi baru. Inovasi bukan hanya tentang alat—ini adalah pola pikir yang mendorong kami menemukan solusi lebih baik setiap hari.',
          color: 'purple'
        },
        {
          icon: Award,
          title: language === 'en' ? 'Excellence' : 'Keunggulan',
          description: language === 'en'
            ? "We set the bar high and never settle for good enough. Excellence means delivering quality that exceeds expectations in every line of code and every client interaction."
            : 'Kami menetapkan standar tinggi dan tidak pernah puas dengan yang cukup baik. Keunggulan berarti memberikan kualitas yang melampaui ekspektasi di setiap baris kode dan setiap interaksi klien.',
          color: 'blue'
        },
        {
          icon: Shield,
          title: language === 'en' ? 'Integrity' : 'Integritas',
          description: language === 'en'
            ? "Honesty and transparency are non-negotiable. We build trust through ethical practices, clear communication, and always doing the right thing—even when no one is watching."
            : 'Kejujuran dan transparansi tidak bisa ditawar. Kami membangun kepercayaan melalui praktik etis, komunikasi yang jelas, dan selalu melakukan hal yang benar—bahkan ketika tidak ada yang melihat.',
          color: 'green'
        },
        {
          icon: Users,
          title: language === 'en' ? 'Collaboration' : 'Kolaborasi',
          description: language === 'en'
            ? "Great things happen when talented people work together. We foster a culture where diverse perspectives are valued and teamwork leads to extraordinary results."
            : 'Hal-hal besar terjadi ketika orang-orang berbakat bekerja bersama. Kami memupuk budaya di mana perspektif yang beragam dihargai dan kerja tim menghasilkan hasil luar biasa.',
          color: 'orange'
        },
        {
          icon: Heart,
          title: language === 'en' ? 'Client Focus' : 'Fokus pada Klien',
          description: language === 'en'
            ? "Our clients' success is our success. We listen deeply, understand their unique challenges, and go the extra mile to deliver solutions that truly make a difference."
            : 'Kesuksesan klien kami adalah kesuksesan kami. Kami mendengarkan dengan saksama, memahami tantangan unik mereka, dan berusaha ekstra untuk memberikan solusi yang benar-benar membuat perbedaan.',
          color: 'pink'
        },
        {
          icon: TrendingUp,
          title: language === 'en' ? 'Continuous Growth' : 'Pertumbuhan Berkelanjutan',
          description: language === 'en'
            ? "We invest in learning and development for our team and organization. Growth is not just about scaling—it's about becoming better, smarter, and more capable every day."
            : 'Kami berinvestasi dalam pembelajaran dan pengembangan untuk tim dan organisasi kami. Pertumbuhan bukan hanya tentang skala—ini tentang menjadi lebih baik, lebih cerdas, dan lebih mampu setiap hari.',
          color: 'indigo'
        }
      ]
    },
    culture: {
      badge: language === 'en' ? 'Our Culture' : 'Budaya Kami',
      title: language === 'en' ? 'Life at Barcomp' : 'Kehidupan di Barcomp',
      subtitle: language === 'en'
        ? "What makes working here different? It's our commitment to creating an environment where talented people thrive."
        : 'Apa yang membuat bekerja di sini berbeda? Ini adalah komitmen kami untuk menciptakan lingkungan di mana orang-orang berbakat berkembang.',
      features: [
        {
          icon: GraduationCap,
          title: language === 'en' ? 'Continuous Learning' : 'Pembelajaran Berkelanjutan',
          description: language === 'en'
            ? "We believe in investing in our people. From certifications to workshops, we provide the resources you need to grow."
            : 'Kami percaya dalam berinvestasi pada orang-orang kami. Dari sertifikasi hingga workshop, kami menyediakan sumber daya yang Anda butuhkan untuk tumbuh.',
          items: language === 'en' ? [
            'Annual training budget per employee',
            'Access to online learning platforms',
            'Technical certification support',
            'Quarterly internal knowledge sharing'
          ] : [
            'Anggaran pelatihan tahunan per karyawan',
            'Akses ke platform pembelajaran online',
            'Dukungan sertifikasi teknis',
            'Berbagi pengetahuan internal triwulanan'
          ]
        },
        {
          icon: Handshake,
          title: language === 'en' ? 'Work-Life Balance' : 'Keseimbangan Kerja-Hidup',
          description: language === 'en'
            ? "We understand that great work comes from happy, balanced individuals. Flexibility and well-being are priorities."
            : 'Kami memahami bahwa pekerjaan yang hebat datang dari individu yang bahagia dan seimbang. Fleksibilitas dan kesejahteraan adalah prioritas.',
          items: language === 'en' ? [
            'Flexible working hours',
            'Remote work options',
            'Generous paid time off',
            'Health and wellness programs'
          ] : [
            'Jam kerja fleksibel',
            'Opsi kerja remote',
            'Cuti berbayar yang murah hati',
            'Program kesehatan dan kesejahteraan'
          ]
        },
        {
          icon: Sparkles,
          title: language === 'en' ? 'Innovation Time' : 'Waktu Inovasi',
          description: language === 'en'
            ? "We encourage experimentation and creative thinking. Dedicated time for innovation projects and hackathons."
            : 'Kami mendorong eksperimen dan pemikiran kreatif. Waktu khusus untuk proyek inovasi dan hackathon.',
          items: language === 'en' ? [
            '20% time for passion projects',
            'Quarterly innovation challenges',
            'Cross-team collaboration initiatives',
            'Support for open source contributions'
          ] : [
            '20% waktu untuk proyek passion',
            'Tantangan inovasi triwulanan',
            'Inisiatif kolaborasi lintas tim',
            'Dukungan untuk kontribusi open source'
          ]
        },
        {
          icon: Medal,
          title: language === 'en' ? 'Recognition & Growth' : 'Pengakuan & Pertumbuhan',
          description: language === 'en'
            ? "Your contributions matter. We celebrate achievements and provide clear paths for career advancement."
            : 'Kontribusi Anda penting. Kami merayakan pencapaian dan menyediakan jalur yang jelas untuk kemajuan karir.',
          items: language === 'en' ? [
            'Performance-based bonuses',
            'Clear career progression paths',
            'Peer recognition programs',
            'Leadership development opportunities'
          ] : [
            'Bonus berbasis kinerja',
            'Jalur progres karir yang jelas',
            'Program pengakuan dari rekan kerja',
            'Peluang pengembangan kepemimpinan'
          ]
        }
      ]
    },
    certifications: {
      badge: language === 'en' ? 'Standards & Certifications' : 'Standar & Sertifikasi',
      title: language === 'en' ? 'How Certifications Shape Our Excellence' : 'Bagaimana Sertifikasi Membentuk Keunggulan Kami',
      subtitle: language === 'en'
        ? "Our certifications are not just badges—they represent our commitment to world-class quality and continuous improvement in everything we do."
        : 'Sertifikasi kami bukan sekadar lencana—mereka mewakili komitmen kami terhadap kualitas kelas dunia dan perbaikan berkelanjutan dalam semua yang kami lakukan.',
      items: [
        {
          icon: Shield,
          certification: 'ISO 9001:2015',
          impact: language === 'en'
            ? "This quality management certification ensures every project follows rigorous processes. From initial planning to final delivery, we maintain consistent quality standards that clients can rely on."
            : 'Sertifikasi manajemen mutu ini memastikan setiap proyek mengikuti proses yang ketat. Dari perencanaan awal hingga pengiriman akhir, kami mempertahankan standar kualitas yang konsisten yang dapat diandalkan klien.',
          standards: language === 'en' ? [
            'Documented quality procedures',
            'Regular internal audits',
            'Continuous improvement cycles',
            'Client satisfaction tracking'
          ] : [
            'Prosedur mutu terdokumentasi',
            'Audit internal reguler',
            'Siklus perbaikan berkelanjutan',
            'Pelacakan kepuasan klien'
          ]
        },
        {
          icon: Award,
          certification: 'Microsoft Gold Partner',
          impact: language === 'en'
            ? "As a Gold Partner, we have access to the latest Microsoft technologies and training. This means our team stays at the cutting edge, delivering solutions built on proven, enterprise-grade platforms."
            : 'Sebagai Gold Partner, kami memiliki akses ke teknologi dan pelatihan Microsoft terbaru. Ini berarti tim kami tetap di garis depan, memberikan solusi yang dibangun di platform yang terbukti dan kelas enterprise.',
          standards: language === 'en' ? [
            'Advanced technical competencies',
            'Direct Microsoft support access',
            'Early access to new technologies',
            'Certified Microsoft professionals'
          ] : [
            'Kompetensi teknis lanjutan',
            'Akses dukungan langsung Microsoft',
            'Akses awal ke teknologi baru',
            'Profesional tersertifikasi Microsoft'
          ]
        },
        {
          icon: Shield,
          certification: 'AWS Partner',
          impact: language === 'en'
            ? "Our AWS partnership demonstrates expertise in cloud architecture and deployment. We design scalable, secure cloud solutions that help clients innovate faster and reduce infrastructure costs."
            : 'Kemitraan AWS kami menunjukkan keahlian dalam arsitektur dan deployment cloud. Kami merancang solusi cloud yang scalable dan aman yang membantu klien berinovasi lebih cepat dan mengurangi biaya infrastruktur.',
          standards: language === 'en' ? [
            'AWS-certified architects',
            'Security best practices',
            'Cost optimization strategies',
            'High-availability designs'
          ] : [
            'Arsitek tersertifikasi AWS',
            'Praktik terbaik keamanan',
            'Strategi optimisasi biaya',
            'Desain ketersediaan tinggi'
          ]
        },
        {
          icon: Award,
          certification: 'Google Cloud Partner',
          impact: language === 'en'
            ? "Google Cloud partnership enables us to leverage cutting-edge tools for data analytics, AI, and machine learning. We help clients unlock insights and build intelligent applications."
            : 'Kemitraan Google Cloud memungkinkan kami memanfaatkan alat mutakhir untuk analitik data, AI, dan machine learning. Kami membantu klien membuka wawasan dan membangun aplikasi cerdas.',
          standards: language === 'en' ? [
            'GCP-certified engineers',
            'Data privacy compliance',
            'ML/AI implementation expertise',
            'Modern DevOps practices'
          ] : [
            'Insinyur tersertifikasi GCP',
            'Kepatuhan privasi data',
            'Keahlian implementasi ML/AI',
            'Praktik DevOps modern'
          ]
        }
      ]
    },
    workEnvironment: {
      badge: language === 'en' ? 'Work Environment' : 'Lingkungan Kerja',
      title: language === 'en' ? 'A Day in the Life' : 'Sehari di Kehidupan',
      subtitle: language === 'en'
        ? "From collaborative spaces to cutting-edge tools, we've built an environment where great work happens naturally."
        : 'Dari ruang kolaboratif hingga alat mutakhir, kami telah membangun lingkungan di mana pekerjaan hebat terjadi secara alami.',
      items: [
        {
          icon: Coffee,
          title: language === 'en' ? 'Modern Workspace' : 'Ruang Kerja Modern',
          description: language === 'en'
            ? "Ergonomic setups, standing desks, and collaboration spaces designed for productivity and creativity."
            : 'Setup ergonomis, standing desk, dan ruang kolaborasi yang dirancang untuk produktivitas dan kreativitas.'
        },
        {
          icon: Code,
          title: language === 'en' ? 'Latest Technology' : 'Teknologi Terbaru',
          description: language === 'en'
            ? "Access to cutting-edge development tools, cloud platforms, and software that help you work at your best."
            : 'Akses ke alat pengembangan mutakhir, platform cloud, dan perangkat lunak yang membantu Anda bekerja dengan sebaik-baiknya.'
        },
        {
          icon: Users,
          title: language === 'en' ? 'Team Activities' : 'Aktivitas Tim',
          description: language === 'en'
            ? "Regular team building, social events, and celebrations that strengthen our bonds beyond work projects."
            : 'Pembangunan tim reguler, acara sosial, dan perayaan yang memperkuat ikatan kami di luar proyek kerja.'
        },
        {
          icon: Briefcase,
          title: language === 'en' ? 'Professional Development' : 'Pengembangan Profesional',
          description: language === 'en'
            ? "Conference attendance, mentorship programs, and opportunities to speak at industry events."
            : 'Kehadiran di konferensi, program mentorship, dan kesempatan untuk berbicara di acara industri.'
        }
      ]
    },
    cta: {
      title: language === 'en' ? 'Join Our Team' : 'Bergabunglah dengan Tim Kami',
      subtitle: language === 'en'
        ? "If our values resonate with you and you're passionate about building exceptional digital solutions, we'd love to hear from you."
        : 'Jika nilai-nilai kami beresonansi dengan Anda dan Anda bersemangat membangun solusi digital yang luar biasa, kami ingin mendengar dari Anda.',
      button: language === 'en' ? 'View Career Opportunities' : 'Lihat Peluang Karir'
    }
  };

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0066FF] via-[#0052CC] to-[#003D99] text-white">
          <div className="absolute inset-0 bg-grid-white/10" />
          
          {/* Decorative shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 -left-20 w-80 h-80 bg-white rounded-full blur-3xl opacity-10" />
            <div className="absolute bottom-20 -right-20 w-80 h-80 bg-blue-300 rounded-full blur-3xl opacity-10" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-5" />
          </div>
          
          <div className="relative container mx-auto max-w-7xl px-6 lg:px-8 py-24 lg:py-32">
            <FadeInSection>
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/20">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm font-medium">{t.hero.badge}</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                  {t.hero.title}
                  <span className="block mt-2">
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

        {/* Core Values Section */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-2 bg-blue-100 rounded-full text-sm font-semibold text-[#0066FF] mb-6">
                  {t.coreValues.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {t.coreValues.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {t.coreValues.subtitle}
                </p>
              </div>
            </FadeInSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {t.coreValues.values.map((value, index) => (
                <FadeInSection key={index} delay={index * 0.1}>
                  <ValueCard {...value} />
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* Culture Section */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-2 bg-purple-100 rounded-full text-sm font-semibold text-purple-600 mb-6">
                  {t.culture.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  {t.culture.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                  {t.culture.subtitle}
                </p>
              </div>
            </FadeInSection>

            <div className="space-y-8 max-w-6xl mx-auto">
              {t.culture.features.map((feature, index) => (
                <CultureFeature key={index} {...feature} />
              ))}
            </div>
          </div>
        </section>

        {/* Certifications Impact Section */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-2 bg-amber-100 rounded-full text-sm font-semibold text-amber-600 mb-6">
                  {t.certifications.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  {t.certifications.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                  {t.certifications.subtitle}
                </p>
              </div>
            </FadeInSection>

            <div className="grid md:grid-cols-2 gap-8">
              {t.certifications.items.map((cert, index) => (
                <CertificationImpact key={index} {...cert} />
              ))}
            </div>
          </div>
        </section>

        {/* Work Environment Section */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-2 bg-green-100 rounded-full text-sm font-semibold text-green-600 mb-6">
                  {t.workEnvironment.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  {t.workEnvironment.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                  {t.workEnvironment.subtitle}
                </p>
              </div>
            </FadeInSection>

            <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {t.workEnvironment.items.map((item, index) => (
                <FadeInSection key={index} delay={index * 0.1}>
                  <LifeAtBarcompItem {...item} />
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
                <Star className="w-16 h-16 mx-auto mb-6 text-white" />
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
      `}</style>
    </>
  );
}