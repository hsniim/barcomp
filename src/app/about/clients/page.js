'use client';

import { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Building2, 
  Users, 
  TrendingUp,
  Star,
  Quote,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  ShoppingCart,
  GraduationCap,
  HeartPulse,
  Factory,
  Cpu,
  Landmark,
  Globe,
  Award,
  CheckCircle2,
  Sparkles,
  FileText,
  ArrowRight,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Fade-in Section Component (sama seperti di profile)
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

// Animated Counter Component (sama seperti di profile)
const AnimatedCounter = memo(({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      setCount(Math.floor(end * percentage));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView]);

  return <span ref={ref}>{count}{suffix}</span>;
});

AnimatedCounter.displayName = 'AnimatedCounter';

// Client Logo Card Component
const ClientLogoCard = memo(({ name, logo, industry, delay = 0 }) => {
  return (
    <FadeInSection delay={delay}>
      <Card className="h-full border-gray-200 hover:border-[#0066FF] hover:shadow-lg transition-all duration-300 group bg-white">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[140px]">
          {logo ? (
            <div className="flex flex-col items-center justify-center w-full">
              <div className="relative w-full h-16 grayscale group-hover:grayscale-0 transition-all duration-300 mb-3">
                <Image
                  src={logo}
                  alt={name}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-sm font-medium text-gray-600 group-hover:text-[#0066FF] transition-colors duration-300 text-center">
                {name}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Building2 className="w-12 h-12 text-gray-300 group-hover:text-[#0066FF] transition-colors duration-300 mb-2" />
              <p className="text-sm font-medium text-gray-600 group-hover:text-[#0066FF] transition-colors duration-300 text-center">
                {name}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </FadeInSection>
  );
});

ClientLogoCard.displayName = 'ClientLogoCard';

// Industry Category Card Component
const IndustryCategoryCard = memo(({ icon: Icon, name, count, description, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-[#0066FF] group-hover:bg-[#0066FF]',
    purple: 'bg-purple-100 text-purple-600 group-hover:bg-purple-600',
    green: 'bg-green-100 text-green-600 group-hover:bg-green-600',
    orange: 'bg-orange-100 text-orange-600 group-hover:bg-orange-600',
    pink: 'bg-pink-100 text-pink-600 group-hover:bg-pink-600',
    indigo: 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600',
    teal: 'bg-teal-100 text-teal-600 group-hover:bg-teal-600',
    red: 'bg-red-100 text-red-600 group-hover:bg-red-600'
  };

  return (
    <FadeInSection>
      <Card className="h-full border-gray-200 hover:border-[#0066FF] hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-6">
          <div className={cn(
            'w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300',
            colorClasses[color]
          )}>
            <Icon className="w-7 h-7 group-hover:text-white transition-colors duration-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0066FF] transition-colors duration-300">
            {name}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl font-bold text-[#0066FF]">
              <AnimatedCounter end={count} suffix="+" />
            </span>
            <span className="text-sm text-gray-500">klien</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </FadeInSection>
  );
});

IndustryCategoryCard.displayName = 'IndustryCategoryCard';

// Testimonial Card Component
const TestimonialCard = memo(({ quote, author, position, company, image, rating = 5 }) => {
  return (
    <FadeInSection>
      <Card className="h-full border-gray-200 hover:border-[#0066FF] hover:shadow-xl transition-all duration-300 bg-white">
        <CardContent className="p-8">
          {/* Quote Icon */}
          <div className="mb-4">
            <Quote className="w-10 h-10 text-[#0066FF] opacity-20" />
          </div>

          {/* Rating Stars */}
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={cn(
                  'w-5 h-5',
                  i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                )} 
              />
            ))}
          </div>

          {/* Quote Text */}
          <blockquote className="text-gray-700 leading-relaxed mb-6 text-base">
            "{quote}"
          </blockquote>

          {/* Author Info */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-[#0066FF] to-[#0052CC] flex-shrink-0">
              {image ? (
                <Image
                  src={image}
                  alt={author}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            <div>
              <p className="font-bold text-gray-900">{author}</p>
              <p className="text-sm text-gray-600">{position}</p>
              <p className="text-sm text-[#0066FF] font-medium">{company}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </FadeInSection>
  );
});

TestimonialCard.displayName = 'TestimonialCard';

// Trust Badge Component
const TrustBadge = memo(({ icon: Icon, title, description }) => {
  return (
    <div className="flex items-start gap-4 p-6 bg-white rounded-xl border border-gray-100 hover:border-[#0066FF] hover:shadow-lg transition-all duration-300 group">
      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#0066FF] transition-colors duration-300">
        <Icon className="w-6 h-6 text-[#0066FF] group-hover:text-white transition-colors duration-300" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
});

TrustBadge.displayName = 'TrustBadge';

// Case Study Card Component
const CaseStudyCard = memo(({ client, industry, challenge, solution, results, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    pink: 'from-pink-500 to-pink-600',
    indigo: 'from-indigo-500 to-indigo-600'
  };

  // Check if icon is a string (SVG path) or a component (Lucide React)
  const isIconString = typeof icon === 'string';
  const IconComponent = !isIconString ? icon : null;

  return (
    <Card className="h-full border-gray-200 hover:border-[#0066FF] hover:shadow-xl transition-all duration-300 overflow-hidden group bg-white p-0">
      {/* Header with Gradient - No extra space */}
      <div className={cn(
        'bg-gradient-to-br p-6 relative',
        colorClasses[color]
      )}>
        <div className="relative flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
            {isIconString ? (
              <img
                src={icon}
                alt={client}
                className="w-6 h-6 object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            ) : IconComponent ? (
              <IconComponent className="w-6 h-6 text-white" />
            ) : (
              <Briefcase className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white mb-1 leading-tight">{client}</h3>
            <p className="text-white/90 text-sm font-medium">{industry}</p>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Challenge Badge */}
        <div className="bg-red-50 rounded-lg p-4 mb-4 border border-red-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs font-bold text-red-700 uppercase tracking-wide">Tantangan</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{challenge}</p>
        </div>

        {/* Solution */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-[#0066FF]" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Solusi</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{solution}</p>
        </div>

        {/* Results */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Hasil</span>
          </div>
          <p className="text-sm font-semibold text-gray-900 leading-relaxed">{results}</p>
        </div>
      </CardContent>
    </Card>
  );
});

CaseStudyCard.displayName = 'CaseStudyCard';

// Main Component
export default function ClientsPage() {
  const testimonialsScrollRef = useRef(null);
  const clientsScrollRef = useRef(null);
  const industriesScrollRef = useRef(null);
  const caseStudiesScrollRef = useRef(null);

  const scrollTestimonials = (direction) => {
    if (testimonialsScrollRef.current) {
      const scrollAmount = 400;
      testimonialsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollClients = (direction) => {
    if (clientsScrollRef.current) {
      const scrollAmount = 400;
      clientsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollIndustries = (direction) => {
    if (industriesScrollRef.current) {
      const scrollAmount = 400;
      industriesScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollCaseStudies = (direction) => {
    if (caseStudiesScrollRef.current) {
      const scrollAmount = 400;
      caseStudiesScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const content = {
    id: {
      hero: {
        badge: "Mitra Kepercayaan",
        title: "Dipercaya oleh 200+ Perusahaan",
        subtitle: "Dari startup hingga korporasi multinasional, kami bangga menjadi mitra digital terpercaya dalam perjalanan transformasi dan inovasi mereka.",
        stats: [
          { number: "200+", label: "Klien Aktif", icon: Users },
          { number: "500+", label: "Proyek Selesai", icon: Briefcase },
          { number: "98", label: "Tingkat Kepuasan", icon: Star, suffix: "%" },
          { number: "15", label: "Negara Dilayani", icon: Globe }
        ]
      },
      industries: {
        badge: "Keahlian Industri",
        title: "Melayani Berbagai Industri",
        subtitle: "Pengalaman mendalam di berbagai sektor memungkinkan kami menghadirkan solusi yang tepat sasaran",
        categories: [
          {
            icon: ShoppingCart,
            name: "E-Commerce & Retail",
            count: 45,
            description: "Platform e-commerce, sistem POS, dan solusi omnichannel untuk retail modern",
            color: 'blue'
          },
          {
            icon: Landmark,
            name: "Perbankan & Fintech",
            count: 38,
            description: "Aplikasi perbankan digital, payment gateway, dan sistem finansial terintegrasi",
            color: 'purple'
          },
          {
            icon: HeartPulse,
            name: "Kesehatan & Medis",
            count: 32,
            description: "Sistem informasi rumah sakit, telemedicine, dan manajemen rekam medis elektronik",
            color: 'green'
          },
          {
            icon: GraduationCap,
            name: "Pendidikan & E-Learning",
            count: 28,
            description: "Learning management system, platform kursus online, dan aplikasi edukasi",
            color: 'orange'
          },
          {
            icon: Factory,
            name: "Manufaktur & Logistik",
            count: 25,
            description: "ERP, sistem manajemen gudang, tracking logistik, dan supply chain management",
            color: 'pink'
          },
          {
            icon: Cpu,
            name: "Teknologi & Software",
            count: 22,
            description: "SaaS products, API development, cloud infrastructure, dan tech consulting",
            color: 'indigo'
          },
          {
            icon: Building2,
            name: "Real Estate & Properti",
            count: 18,
            description: "Marketplace properti, sistem manajemen gedung, dan virtual tour 3D",
            color: 'teal'
          },
          {
            icon: TrendingUp,
            name: "Startup & UMKM",
            count: 42,
            description: "MVP development, produk digital scalable, dan konsultasi teknologi untuk startup",
            color: 'red'
          }
        ]
      },
      clients: {
        badge: "Portofolio Klien",
        title: "Mitra yang Telah Mempercayai Kami",
        subtitle: "Beberapa perusahaan terkemuka yang telah berkolaborasi dengan Barcomp",
        featured: [
          { name: "Aetheric Systems", logo: "/logos/aetheric.svg", industry: "Technology" },
          { name: "Velocart Global", logo: "/logos/velocart.svg", industry: "Retail" },
          { name: "Zenith Capital Trust", logo: "/logos/zenith.svg", industry: "Finance" },
          { name: "IronPath Logistics", logo: "/logos/ironpath.svg", industry: "Logistics" },
          { name: "BioGenix Laboratories", logo: "/logos/biogenix.svg", industry: "Healthcare" },
          { name: "Veridian Academy", logo: "/logos/veridian.svg", industry: "Education" },
          { name: "Skyline Heritage Group", logo: "/logos/skyline.svg", industry: "Real Estate" },
          { name: "Bloom Catalyst", logo: "/logos/bloom.svg", industry: "Startup" },
          { name: "Apex Global Manufacturing", logo: "/logos/apex.svg", industry: "Manufacturing" },
          { name: "Urban Retail Collective", logo: "/logos/urban.svg", industry: "E-Commerce" },
          { name: "Fortis Digital Bank", logo: "/logos/fortis.svg", industry: "Finance" },
          { name: "EduPulse Global", logo: "/logos/edupulse.svg", industry: "Education" }
        ]
      },
      testimonials: {
        badge: "Testimoni Klien",
        title: "Apa Kata Mereka Tentang Kami",
        subtitle: "Kepuasan dan kesuksesan klien adalah prioritas utama kami",
        items: [
          {
            quote: "Barcomp tidak hanya mengembangkan aplikasi, tetapi benar-benar memahami kebutuhan bisnis kami. Tim mereka responsif dan solusinya selalu tepat waktu dengan kualitas terbaik.",
            author: "Budi Santoso",
            position: "CTO",
            company: "Aetheric Systems",
            image: null,
            rating: 5
          },
          {
            quote: "Transformasi digital kami tidak akan berhasil tanpa Barcomp. Mereka membimbing kami dari konsep hingga implementasi dengan sangat profesional. ROI yang kami dapatkan melebihi ekspektasi.",
            author: "Sarah Wijaya",
            position: "Head of Digital",
            company: "Zenith Capital Trust",
            image: null,
            rating: 5
          },
          {
            quote: "Platform e-learning yang dikembangkan Barcomp meningkatkan engagement siswa kami hingga 85%. User interface-nya intuitif dan scalable untuk pertumbuhan kami ke depan.",
            author: "Dr. Ahmad Rizki",
            position: "Direktur Teknologi",
            company: "Veridian Academy",
            image: null,
            rating: 5
          },
          {
            quote: "Sebagai startup, kami membutuhkan partner yang agile dan understand our vision. Barcomp delivered beyond expectations. Mereka seperti extension dari tim kami sendiri.",
            author: "Linda Kusuma",
            position: "Co-Founder & CEO",
            company: "Bloom Catalyst",
            image: null,
            rating: 5
          },
          {
            quote: "Sistem ERP yang dibangun Barcomp mengintegrasikan seluruh operasional kami dengan sempurna. Efisiensi meningkat 40% dalam 6 bulan pertama implementasi.",
            author: "Ir. Hendra Gunawan",
            position: "Operations Director",
            company: "Apex Global Manufacturing",
            image: null,
            rating: 5
          },
          {
            quote: "Partnership dengan Barcomp adalah keputusan terbaik kami. Mereka tidak hanya deliver project, tapi juga provide continuous support dan innovation recommendations.",
            author: "Michelle Tan",
            position: "VP of Technology",
            company: "Velocart Global",
            image: null,
            rating: 5
          }
        ]
      },
      caseStudies: {
        badge: "Studi Kasus",
        title: "Kisah Sukses Transformasi Digital",
        subtitle: "Lihat bagaimana kami membantu klien mengatasi tantangan bisnis mereka dengan solusi digital yang tepat",
        items: [
          {
            client: "Fortis Digital Bank",
            industry: "Fintech & Perbankan",
            challenge: "Proses onboarding nasabah memakan waktu 3-5 hari dengan banyak dokumen fisik, menyebabkan tingkat konversi rendah dan biaya operasional tinggi.",
            solution: "Mengembangkan aplikasi mobile banking dengan fitur e-KYC, digital signature, dan OCR untuk verifikasi dokumen otomatis.",
            results: "Waktu onboarding turun 90% menjadi 15 menit, konversi meningkat 65%, dan biaya operasional berkurang 40%.",
            icon: "/logos/fortis.svg",
            color: 'blue'
          },
          {
            client: "EduPulse Global",
            industry: "Pendidikan & E-Learning",
            challenge: "Platform pembelajaran online yang ada tidak dapat menangani 10,000+ siswa bersamaan, sering crash saat jam sibuk dengan tingkat engagement siswa hanya 35%.",
            solution: "Membangun cloud-based LMS dengan arsitektur microservices, kolaborasi real-time, gamifikasi, dan personalisasi berbasis AI.",
            results: "Platform stabil menangani 50,000+ pengguna bersamaan, engagement meningkat 85%, dan tingkat penyelesaian naik 120%.",
            icon: "/logos/edupulse.svg",
            color: 'blue'
          },
          {
            client: "Urban Retail Collective",
            industry: "Retail & E-Commerce",
            challenge: "Tingkat pembatalan checkout mencapai 68% karena proses pembayaran yang rumit, integrasi payment gateway terbatas, dan waktu loading lama di mobile.",
            solution: "Redesain UX dengan one-click checkout, integrasi 15+ metode pembayaran, implementasi PWA, dan optimasi performa.",
            results: "Pembatalan checkout turun ke 22%, transaksi mobile naik 180%, dan pendapatan meningkat 210% dalam 6 bulan.",
            icon: "/logos/urban.svg",
            color: 'blue'
          },
          {
            client: "Lumina Healthcare Int.",
            industry: "Kesehatan & Medis",
            challenge: "Sistem rekam medis manual menyebabkan data pasien tercecer, resep sering salah terbaca, dan koordinasi antar dokter tidak efisien.",
            solution: "Mengimplementasikan Hospital Information System (HIS) terintegrasi dengan EMR, e-prescription, dan modul telemedicine.",
            results: "Kesalahan pengobatan turun 95%, waktu administrasi berkurang 60%, dan kepuasan pasien meningkat dari 72% ke 94%.",
            icon: "/logos/lumina.svg",
            color: 'blue'
          },
          {
            client: "IronPath Logistics",
            industry: "Manufaktur & Logistik",
            challenge: "Manajemen inventori manual menyebabkan ketidaksesuaian stok 15%, sering kehabisan stok produk populer, dan kelebihan stok produk yang lambat terjual.",
            solution: "Mengembangkan sistem ERP dengan pelacakan inventori real-time, analitik prediktif, pemesanan ulang otomatis, dan manajemen gudang.",
            results: "Akurasi stok 99.5%, kehabisan stok turun 88%, biaya penyimpanan inventori berkurang 35%, dan efisiensi operasional naik 45%.",
            icon: "/logos/ironpath.svg",
            color: 'blue'
          },
          {
            client: "SwiftScale Hub",
            industry: "Technology Startup",
            challenge: "Startup membutuhkan MVP marketplace dalam 2 bulan untuk presentasi investor dengan anggaran terbatas, namun memerlukan fitur lengkap dan dapat berkembang.",
            solution: "Pengembangan agile dengan sprint 2 minggu, menggunakan teknologi modern, fokus pada fitur inti, dan infrastruktur cloud.",
            results: "MVP diluncurkan tepat waktu, berhasil mendapat pendanaan awal $500K, dan platform berkembang dari 100 ke 10,000 pengguna tanpa perlu refactor.",
            icon: "/logos/swift.svg",
            color: 'blue'
          }
        ]
      },
      trust: {
        badge: "Mengapa Memilih Kami",
        title: "Kepercayaan yang Dibangun Bersama",
        subtitle: "Komitmen kami untuk memberikan hasil terbaik bagi setiap klien",
        badges: [
          {
            icon: Award,
            title: "Sertifikasi Internasional",
            description: "ISO 9001:2015, Microsoft Gold Partner, AWS Partner Network untuk jaminan kualitas standar global"
          },
          {
            icon: CheckCircle2,
            title: "Track Record Terbukti",
            description: "98% tingkat kepuasan klien dengan 500+ proyek sukses di berbagai industri sejak 2015"
          },
          {
            icon: Users,
            title: "Tim Ahli Berpengalaman",
            description: "50+ profesional bersertifikasi dengan keahlian di berbagai teknologi dan domain bisnis"
          },
          {
            icon: Sparkles,
            title: "Inovasi Berkelanjutan",
            description: "Selalu mengadopsi teknologi terkini untuk memberikan solusi yang future-proof"
          }
        ]
      },
      cta: {
        title: "Bergabunglah dengan 200+ Perusahaan yang Telah Mempercayai Kami",
        subtitle: "Mari wujudkan transformasi digital perusahaan Anda bersama tim expert kami",
        button: "Mulai Konsultasi Gratis"
      }
    },
    en: {
      hero: {
        badge: "Trusted Partners",
        title: "Trusted by 200+ Companies",
        subtitle: "From startups to multinational corporations, we're proud to be their trusted digital partner in transformation and innovation.",
        stats: [
          { number: "200+", label: "Active Clients", icon: Users },
          { number: "500+", label: "Completed Projects", icon: Briefcase },
          { number: "98", label: "Satisfaction Rate", icon: Star, suffix: "%" },
          { number: "15", label: "Countries Served", icon: Globe }
        ]
      },
      industries: {
        badge: "Industry Expertise",
        title: "Serving Various Industries",
        subtitle: "Deep experience across sectors enables us to deliver targeted solutions",
        categories: [
          {
            icon: ShoppingCart,
            name: "E-Commerce & Retail",
            count: 45,
            description: "E-commerce platforms, POS systems, and omnichannel solutions for modern retail",
            color: 'blue'
          },
          {
            icon: Landmark,
            name: "Banking & Fintech",
            count: 38,
            description: "Digital banking apps, payment gateways, and integrated financial systems",
            color: 'purple'
          },
          {
            icon: HeartPulse,
            name: "Healthcare & Medical",
            count: 32,
            description: "Hospital information systems, telemedicine, and electronic medical records",
            color: 'green'
          },
          {
            icon: GraduationCap,
            name: "Education & E-Learning",
            count: 28,
            description: "Learning management systems, online course platforms, and educational apps",
            color: 'orange'
          },
          {
            icon: Factory,
            name: "Manufacturing & Logistics",
            count: 25,
            description: "ERP, warehouse management, logistics tracking, and supply chain management",
            color: 'pink'
          },
          {
            icon: Cpu,
            name: "Technology & Software",
            count: 22,
            description: "SaaS products, API development, cloud infrastructure, and tech consulting",
            color: 'indigo'
          },
          {
            icon: Building2,
            name: "Real Estate & Property",
            count: 18,
            description: "Property marketplace, building management systems, and 3D virtual tours",
            color: 'teal'
          },
          {
            icon: TrendingUp,
            name: "Startups & SMEs",
            count: 42,
            description: "MVP development, scalable digital products, and technology consulting for startups",
            color: 'red'
          }
        ]
      },
      clients: {
        badge: "Client Portfolio",
        title: "Partners Who Trust Us",
        subtitle: "Some leading companies that have collaborated with Barcomp",
        featured: [
          { name: "Aetheric Systems", logo: null, industry: "Technology" },
          { name: "Velocart Global", logo: null, industry: "Retail" },
          { name: "Zenith Capital Trust", logo: null, industry: "Finance" },
          { name: "IronPath Logistics", logo: null, industry: "Logistics" },
          { name: "BioGenix Laboratories", logo: null, industry: "Healthcare" },
          { name: "Veridian Academy", logo: null, industry: "Education" },
          { name: "Skyline Heritage Group", logo: null, industry: "Real Estate" },
          { name: "Bloom Catalyst", logo: null, industry: "Startup" },
          { name: "Apex Global Manufacturing", logo: null, industry: "Manufacturing" },
          { name: "Urban Retail Collective", logo: null, industry: "E-Commerce" },
          { name: "Fortis Digital Bank", logo: null, industry: "Finance" },
          { name: "EduPulse Global", logo: null, industry: "Education" }
        ]
      },
      testimonials: {
        badge: "Client Testimonials",
        title: "What They Say About Us",
        subtitle: "Client satisfaction and success are our top priorities",
        items: [
          {
            quote: "Barcomp doesn't just develop applications, they truly understand our business needs. Their team is responsive and solutions are always delivered on time with the best quality.",
            author: "Budi Santoso",
            position: "CTO",
            company: "Aetheric Systems",
            image: null,
            rating: 5
          },
          {
            quote: "Our digital transformation wouldn't have succeeded without Barcomp. They guided us from concept to implementation very professionally. The ROI we achieved exceeded expectations.",
            author: "Sarah Wijaya",
            position: "Head of Digital",
            company: "Zenith Capital Trust",
            image: null,
            rating: 5
          },
          {
            quote: "The e-learning platform developed by Barcomp increased our student engagement by 85%. The user interface is intuitive and scalable for our future growth.",
            author: "Dr. Ahmad Rizki",
            position: "Technology Director",
            company: "Veridian Academy",
            image: null,
            rating: 5
          },
          {
            quote: "As a startup, we needed an agile partner who understands our vision. Barcomp delivered beyond expectations. They're like an extension of our own team.",
            author: "Linda Kusuma",
            position: "Co-Founder & CEO",
            company: "Bloom Catalyst",
            image: null,
            rating: 5
          },
          {
            quote: "The ERP system built by Barcomp integrated our entire operations seamlessly. Efficiency increased by 40% in the first 6 months of implementation.",
            author: "Ir. Hendra Gunawan",
            position: "Operations Director",
            company: "Apex Global Manufacturing",
            image: null,
            rating: 5
          },
          {
            quote: "Partnership with Barcomp was our best decision. They don't just deliver projects, but also provide continuous support and innovation recommendations.",
            author: "Michelle Tan",
            position: "VP of Technology",
            company: "Velocart Global",
            image: null,
            rating: 5
          }
        ]
      },
      caseStudies: {
        badge: "Case Studies",
        title: "Digital Transformation Success Stories",
        subtitle: "See how we help clients overcome their business challenges with the right digital solutions",
        items: [
          {
            client: "Fortis Digital Bank",
            industry: "Fintech & Banking",
            challenge: "Customer onboarding took 3-5 days with physical documents, causing low conversion rates and high operational costs.",
            solution: "Developed mobile banking app with e-KYC, digital signature, and OCR for automatic document verification.",
            results: "Onboarding time reduced 90% to 15 minutes, conversion increased 65%, and operational costs decreased 40%.",
            icon: "/logos/fortis.svg",
            color: 'blue'
          },
          {
            client: "EduPulse Global",
            industry: "Education & E-Learning",
            challenge: "Existing online learning platform not scalable for 10,000+ simultaneous students, frequent crashes during peak hours with only 35% student engagement.",
            solution: "Built cloud-based LMS with microservices architecture, real-time collaboration, gamification, and AI-powered personalization.",
            results: "Platform handles 50,000+ concurrent users stably, engagement increased 85%, and completion rate rose 120%.",
            icon: "/logos/edupulse.svg",
            color: 'orange'
          },
          {
            client: "Urban Retail Collective",
            industry: "Retail & E-Commerce",
            challenge: "68% checkout abandonment rate due to complicated payment process, limited payment gateway integrations, and slow mobile loading times.",
            solution: "Redesigned UX with one-click checkout, integrated 15+ payment methods, implemented PWA, and optimized performance.",
            results: "Checkout abandonment dropped to 22%, mobile transactions increased 180%, and revenue grew 210% in 6 months.",
            icon: "/logos/urban.svg",
            color: 'green'
          },
          {
            client: "Lumina Healthcare Int.",
            industry: "Healthcare & Medical",
            challenge: "Manual medical records caused scattered patient data, prescription reading errors, and inefficient doctor coordination.",
            solution: "Implemented integrated Hospital Information System (HIS) with EMR, e-prescription, and telemedicine modules.",
            results: "Medication errors reduced 95%, administrative time decreased 60%, and patient satisfaction increased from 72% to 94%.",
            icon: "/logos/lumina.svg",
            color: 'pink'
          },
          {
            client: "IronPath Logistics",
            industry: "Manufacturing & Logistics",
            challenge: "Manual inventory management caused 15% stock discrepancy, frequent stockouts of popular products, and excess slow-moving inventory.",
            solution: "Developed ERP system with real-time inventory tracking, predictive analytics, automated reordering, and warehouse management.",
            results: "Stock accuracy 99.5%, stockouts decreased 88%, inventory carrying cost reduced 35%, and operational efficiency increased 45%.",
            icon: "/logos/ironpath.svg",
            color: 'purple'
          },
          {
            client: "SwiftScale Hub",
            industry: "Technology Startup",
            challenge: "Startup needed MVP marketplace in 2 months for investor pitch with limited budget, but required complete and scalable features.",
            solution: "Agile development with 2-week sprints, using modern tech stack, focusing on core features, and cloud infrastructure.",
            results: "MVP launched on time, successfully raised $500K seed funding, and platform scaled from 100 to 10,000 users without refactoring.",
            icon: "/logos/swift.svg",
            color: 'indigo'
          }
        ]
      },
      trust: {
        badge: "Why Choose Us",
        title: "Trust Built Together",
        subtitle: "Our commitment to deliver the best results for every client",
        badges: [
          {
            icon: Award,
            title: "International Certifications",
            description: "ISO 9001:2015, Microsoft Gold Partner, AWS Partner Network for global standard quality assurance"
          },
          {
            icon: CheckCircle2,
            title: "Proven Track Record",
            description: "98% client satisfaction rate with 500+ successful projects across industries since 2015"
          },
          {
            icon: Users,
            title: "Expert Team",
            description: "50+ certified professionals with expertise in various technologies and business domains"
          },
          {
            icon: Sparkles,
            title: "Continuous Innovation",
            description: "Always adopting the latest technology to deliver future-proof solutions"
          }
        ]
      },
      cta: {
        title: "Join 200+ Companies That Trust Us",
        subtitle: "Let's realize your company's digital transformation with our expert team",
        button: "Start Free Consultation"
      }
    }
  };

  const t = content.id;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-to-br from-[#0066FF] to-[#0052CC] overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <FadeInSection>
              <div className="text-center max-w-4xl mx-auto">
                <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold text-white mb-6">
                  {t.hero.badge}
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  {t.hero.title}
                </h1>
                <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                  {t.hero.subtitle}
                </p>
              </div>
            </FadeInSection>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 max-w-6xl mx-auto">
              {t.hero.stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <FadeInSection key={index} delay={index * 0.1}>
                    <div className="text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                      <Icon className="w-10 h-10 text-white mx-auto mb-3" />
                      <div className="text-4xl font-bold text-white mb-1">
                        <AnimatedCounter end={parseInt(stat.number)} suffix={stat.suffix || (stat.number.includes('+') ? '+' : '')} />
                      </div>
                      <div className="text-blue-100 text-sm font-medium">{stat.label}</div>
                    </div>
                  </FadeInSection>
                );
              })}
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section className="py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-12">
                <div className="inline-block px-4 py-2 bg-[#0066FF]/10 rounded-full text-sm font-semibold text-[#0066FF] mb-6">
                  {t.industries.badge}
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
                  {t.industries.title}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t.industries.subtitle}
                </p>
              </div>
            </FadeInSection>

            {/* Carousel Container */}
            <div className="relative">
              {/* Navigation Buttons */}
              <button
                onClick={() => scrollIndustries('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center border border-gray-200 hover:border-[#0066FF] transition-all duration-300 group"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-[#0066FF]" />
              </button>
              
              <button
                onClick={() => scrollIndustries('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center border border-gray-200 hover:border-[#0066FF] transition-all duration-300 group"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-[#0066FF]" />
              </button>

              {/* Scrollable Container */}
              <div 
                ref={industriesScrollRef}
                className="overflow-x-auto scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="flex gap-6 pb-4" style={{ minWidth: 'max-content' }}>
                  {t.industries.categories.map((category, index) => (
                    <div key={index} className="w-80 flex-shrink-0">
                      <IndustryCategoryCard {...category} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Client Logos Section */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-12">
                <div className="inline-block px-4 py-2 bg-purple-100 rounded-full text-sm font-semibold text-purple-600 mb-6">
                  {t.clients.badge}
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
                  {t.clients.title}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t.clients.subtitle}
                </p>
              </div>
            </FadeInSection>

            {/* Carousel Container */}
            <div className="relative">
              {/* Navigation Buttons */}
              <button
                onClick={() => scrollClients('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center border border-gray-200 hover:border-[#0066FF] transition-all duration-300 group"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-[#0066FF]" />
              </button>
              
              <button
                onClick={() => scrollClients('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center border border-gray-200 hover:border-[#0066FF] transition-all duration-300 group"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-[#0066FF]" />
              </button>

              {/* Scrollable Container */}
              <div 
                ref={clientsScrollRef}
                className="overflow-x-auto scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="flex gap-6 pb-4" style={{ minWidth: 'max-content' }}>
                  {t.clients.featured.map((client, index) => (
                    <div key={index} className="w-64 flex-shrink-0">
                      <ClientLogoCard {...client} delay={0} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <FadeInSection delay={0.3}>
              <div className="mt-12 text-center">
                <p className="text-gray-600 mb-6">
                  {'Dan masih banyak lagi perusahaan terkemuka lainnya...'}
                </p>
                <Link href="/contact">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-[#0066FF] bg-blue-600 text-white hover:bg-[#0658d5]"
                  >
                    {'Join Them'}
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Case Studies Section */}
        <section className="py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0066FF] rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <FadeInSection>
              <div className="text-center mb-12">
                <div className="inline-block px-4 py-2 bg-indigo-100 rounded-full text-sm font-semibold text-indigo-600 mb-6">
                  {t.caseStudies.badge}
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
                  {t.caseStudies.title}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t.caseStudies.subtitle}
                </p>
              </div>
            </FadeInSection>

            {/* Carousel Container */}
            <div className="relative">
              {/* Navigation Buttons */}
              <button
                onClick={() => scrollCaseStudies('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center border border-gray-200 hover:border-[#0066FF] transition-all duration-300 group"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-[#0066FF]" />
              </button>
              
              <button
                onClick={() => scrollCaseStudies('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center border border-gray-200 hover:border-[#0066FF] transition-all duration-300 group"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-[#0066FF]" />
              </button>

              {/* Scrollable Container */}
              <div 
                ref={caseStudiesScrollRef}
                className="overflow-x-auto scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="flex gap-6" style={{ minWidth: 'max-content' }}>
                  {t.caseStudies.items.map((caseStudy, index) => (
                    <div key={index} className="w-96 flex-shrink-0">
                      <CaseStudyCard {...caseStudy} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0066FF] rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <FadeInSection>
              <div className="text-center mb-12">
                <div className="inline-block px-4 py-2 bg-yellow-100 rounded-full text-sm font-semibold text-yellow-600 mb-6">
                  {t.testimonials.badge}
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
                  {t.testimonials.title}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t.testimonials.subtitle}
                </p>
              </div>
            </FadeInSection>

            {/* Carousel Container */}
            <div className="relative">
              {/* Navigation Buttons */}
              <button
                onClick={() => scrollTestimonials('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center border border-gray-200 hover:border-[#0066FF] transition-all duration-300 group"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-[#0066FF]" />
              </button>
              
              <button
                onClick={() => scrollTestimonials('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center border border-gray-200 hover:border-[#0066FF] transition-all duration-300 group"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-[#0066FF]" />
              </button>

              {/* Scrollable Container */}
              <div 
                ref={testimonialsScrollRef}
                className="overflow-x-auto scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="flex gap-6 pb-4" style={{ minWidth: 'max-content' }}>
                  {t.testimonials.items.map((testimonial, index) => (
                    <div key={index} className="w-96 flex-shrink-0">
                      <TestimonialCard {...testimonial} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto max-w-6xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-12">
                <div className="inline-block px-4 py-2 bg-green-100 rounded-full text-sm font-semibold text-green-600 mb-6">
                  {t.trust.badge}
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
                  {t.trust.title}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t.trust.subtitle}
                </p>
              </div>
            </FadeInSection>

            <div className="grid md:grid-cols-2 gap-6">
              {t.trust.badges.map((badge, index) => (
                <FadeInSection key={index} delay={index * 0.1}>
                  <TrustBadge {...badge} />
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-16 lg:py-20 bg-gradient-to-br from-[#0066FF] to-[#0052CC] overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <FadeInSection>
              <div className="text-center max-w-3xl mx-auto">
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
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}

//