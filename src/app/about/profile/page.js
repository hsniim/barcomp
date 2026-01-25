'use client';

import { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Calendar, 
  Award, 
  TrendingUp, 
  Users, 
  Shield,
  Sparkles,
  Target,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Fade-in Section Component (matching landing page pattern)
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

// animated counter component
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

// StatCard component
const StatCard = memo(({ number, label, icon: Icon, delay = 0 }) => {
  return (
    <FadeInSection delay={delay}>
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-[#0066FF] transition-colors duration-300">
            <Icon className="w-8 h-8 text-[#0066FF] group-hover:text-white transition-colors duration-300" />
          </div>
        </div>
        <div className="text-5xl font-bold text-[#0066FF] mb-2">
          <AnimatedCounter end={parseInt(number)} suffix={number.includes('+') ? '+' : ''} />
        </div>
        <div className="text-gray-600 font-medium">{label}</div>
      </div>
    </FadeInSection>
  );
});

StatCard.displayName = 'StatCard';

// timeline item component
const TimelineItem = memo(({ year, title, description, icon: Icon, isLast = false }) => {
  return (
    <FadeInSection>
      <div className="relative flex gap-6 pb-12">
        {/* timeline line */}
        {!isLast && (
          <div className="absolute left-6 top-14 w-0.5 h-full bg-gradient-to-b from-[#0066FF] to-[#0052CC]" />
        )}
        
        {/* icon */}
        <div className="relative flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-xl flex items-center justify-center shadow-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        {/* content */}
        <div className="flex-1 pt-1">
          <div className="inline-block px-3 py-1 bg-blue-100 rounded-full text-sm font-semibold text-[#0066FF] mb-3">
            {year}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </FadeInSection>
  );
});

TimelineItem.displayName = 'TimelineItem';

// certificarions and badge components
const CertificationBadge = memo(({ name, issuer, icon: Icon }) => {
  return (
    <Card className="h-full border-gray-200 hover:border-[#0066FF] hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-[#0066FF] transition-colors duration-300 flex-shrink-0">
            <Icon className="w-7 h-7 text-[#0066FF] group-hover:text-white transition-colors duration-300" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 mb-1 group-hover:text-[#0066FF] transition-colors duration-300">
              {name}
            </h4>
            <p className="text-sm text-gray-600">{issuer}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#0066FF] group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </CardContent>
    </Card>
  );
});

CertificationBadge.displayName = 'CertificationBadge';

export default function ProfilePage() {
  const [language, setLanguage] = useState('en');

  // initialize lang and listen for changes
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);

    const handleLanguageChange = (e) => {
      setLanguage(e.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  // Translation object
  const t = {
    hero: {
      badge: language === 'en' ? 'Our Dedication and Journey' : 'Dedikasi dan Perjalanan Kami',
      title: language === 'en' ? 'Building Digital Future' : 'Membangun Masa Depan Digital',
      subtitle: language === 'en' ? 'Since 2015' : 'Sejak 2015',
      description: language === 'en' 
        ? 'PT Barcomp Digital Solusindo was born from a simple belief: the right technology can transform the way businesses grow and evolve. More than just a service provider, we are strategic partners committed to helping every client reach their maximum potential.'
        : 'PT Barcomp Digital Solusindo lahir dari keyakinan sederhana: teknologi yang tepat dapat mengubah cara bisnis tumbuh dan berkembang. Lebih dari sekadar penyedia layanan, kami adalah mitra strategis yang berkomitmen membantu setiap klien mencapai potensi maksimalnya.',
      established: language === 'en' ? 'Established 2015' : 'Berdiri 2015'
    },
    stats: [
      { number: '9+', label: language === 'en' ? 'Years Experience' : 'Tahun Pengalaman', icon: Calendar },
      { number: '500+', label: language === 'en' ? 'Projects Completed' : 'Proyek Selesai', icon: Target },
      { number: '200+', label: language === 'en' ? 'Trusted Clients' : 'Klien Terpercaya', icon: Users },
      { number: '50+', label: language === 'en' ? 'Expert Team' : 'Tim Ahli', icon: Award }
    ],
    story: {
      badge: language === 'en' ? 'Our Story' : 'Cerita Kami',
      title: language === 'en' ? 'From Simple Vision to Regional Leadership' : 'Dari Visi Sederhana Menuju Kepemimpinan Regional',
      paragraph1: language === 'en'
        ? 'Barcomp was founded in 2015 with a strong determination: to bring digital transformation that makes a real impact for Indonesian businesses. We started with a small, passionate team, serving our first clients with full dedication.'
        : 'Barcomp lahir di tahun 2015 dengan tekad kuat: menghadirkan transformasi digital yang berdampak nyata bagi bisnis Indonesia. Kami memulai dengan tim kecil yang penuh semangat, melayani klien pertama kami dengan dedikasi penuh.',
      paragraph2: language === 'en'
        ? 'Throughout our journey, we have grown not only in scale but also in depth of expertise. Every project is an opportunity to learn, innovate, and deliver greater value to our clients.'
        : 'Sepanjang perjalanan, kami tidak hanya berkembang dalam skala, tetapi juga dalam kedalaman keahlian. Setiap proyek adalah kesempatan untuk belajar, berinovasi, dan memberikan nilai lebih kepada klien.',
      paragraph3: language === 'en'
        ? 'Today, with over 500 completed projects and the trust of 200+ clients, we are proud to be a digital partner relied upon by various industries—from startups to large corporations.'
        : 'Hari ini, dengan lebih dari 500 proyek yang telah diselesaikan dan kepercayaan dari 200+ klien, kami bangga menjadi mitra digital yang diandalkan oleh berbagai industri—dari startup hingga korporasi besar.'
    },
    legal: {
      title: language === 'en' ? 'Legal Foundation & Credibility' : 'Landasan Legal & Kredibilitas',
      entity: {
        title: language === 'en' ? 'Legal Entity' : 'Badan Hukum',
        subtitle: 'PT Barcomp Digital Solusindo',
        desc: language === 'en' ? 'Officially registered and operating in accordance with Indonesian law' : 'Terdaftar resmi dan beroperasi sesuai hukum Indonesia'
      },
      license: {
        title: language === 'en' ? 'NIB & Business License' : 'NIB & Izin Usaha',
        subtitle: language === 'en' ? 'Integrated Business Identification Number' : 'Nomor Induk Berusaha Terintegrasi',
        desc: language === 'en' ? 'Meeting all government regulations' : 'Memenuhi seluruh regulasi pemerintah'
      },
      tax: {
        title: language === 'en' ? 'NPWP & Tax' : 'NPWP & Pajak',
        subtitle: language === 'en' ? 'PKP (Taxable Enterprise)' : 'PKP (Pengusaha Kena Pajak)',
        desc: language === 'en' ? 'Tax compliant and financial administration' : 'Taat pajak dan administrasi keuangan'
      },
      commitment: {
        title: language === 'en' ? 'Commitment to Transparency' : 'Komitmen Transparansi',
        desc: language === 'en'
          ? 'We operate with the highest standards in corporate governance, ensuring every client works with a credible and trusted partner.'
          : 'Kami beroperasi dengan standar tertinggi dalam tata kelola perusahaan, memastikan setiap klien bekerja dengan mitra yang kredibel dan terpercaya.'
      }
    },
    timeline: {
      badge: language === 'en' ? 'Our Journey' : 'Perjalanan Kami',
      title: language === 'en' ? 'Milestones That Shape Us' : 'Milestone yang Membentuk Kami',
      subtitle: language === 'en' 
        ? 'Every step is proof of our commitment to excellence and continuous innovation'
        : 'Setiap langkah adalah bukti komitmen kami terhadap keunggulan dan inovasi berkelanjutan',
      items: [
        {
          year: '2015',
          title: language === 'en' ? 'Founding of Barcomp' : 'Berdirinya Barcomp',
          description: language === 'en'
            ? 'Started with a vision to deliver digital solutions that transform how businesses operate in Indonesia. From a small office with a team of 5, we committed to delivering the best quality.'
            : 'Dimulai dengan visi untuk menghadirkan solusi digital yang mengubah cara bisnis beroperasi di Indonesia. Dari kantor kecil dengan tim 5 orang, kami berkomitmen untuk memberikan kualitas terbaik.',
          icon: Building2
        },
        {
          year: '2017',
          title: language === 'en' ? 'Service Expansion' : 'Ekspansi Layanan',
          description: language === 'en'
            ? 'Launched custom software development and cloud solutions divisions. Expanded our team to 20+ professionals and served clients from various industries.'
            : 'Meluncurkan divisi custom software development dan cloud solutions. Memperluas tim menjadi 20+ profesional dan melayani klien dari berbagai industri.',
          icon: TrendingUp
        },
        {
          year: '2019',
          title: language === 'en' ? 'International Certification' : 'Sertifikasi Internasional',
          description: language === 'en'
            ? 'Obtained ISO 9001:2015 certification and became a Microsoft Gold Partner. Marking our commitment to global quality standards.'
            : 'Memperoleh sertifikasi ISO 9001:2015 dan menjadi Microsoft Gold Partner. Menandai komitmen kami terhadap standar kualitas global.',
          icon: Award
        },
        {
          year: '2021',
          title: language === 'en' ? 'Partnership Era' : 'Era Partnership',
          description: language === 'en'
            ? 'Became AWS Partner and Google Cloud Partner. Opening opportunities to deliver enterprise-grade cloud solutions to clients across Southeast Asia.'
            : 'Menjadi AWS Partner dan Google Cloud Partner. Membuka peluang untuk memberikan solusi cloud enterprise-grade kepada klien di seluruh Asia Tenggara.',
          icon: Shield
        },
        {
          year: '2025',
          title: language === 'en' ? 'Regional Leadership' : 'Kepemimpinan Regional',
          description: language === 'en'
            ? 'With 200+ clients and 50+ expert team members, we continue to innovate to become a leading digital solutions provider in Southeast Asia.'
            : 'Dengan 200+ klien dan 50+ tim ahli, kami terus berinovasi untuk menjadi penyedia solusi digital terkemuka di Asia Tenggara.',
          icon: Sparkles
        }
      ]
    },
    certifications: {
      badge: language === 'en' ? 'Global Standards' : 'Standar Global',
      title: language === 'en' ? 'Certifications & Partnerships' : 'Sertifikasi & Kemitraan',
      subtitle: language === 'en'
        ? 'Trusted by world technology leaders and internationally certified'
        : 'Dipercaya oleh pemimpin teknologi dunia dan berstandar internasional',
      items: [
        { name: 'ISO 9001:2015', issuer: language === 'en' ? 'Quality Management System' : 'Sistem Manajemen Mutu', icon: Shield },
        { name: 'Microsoft Gold Partner', issuer: 'Microsoft Corporation', icon: Award },
        { name: 'AWS Partner', issuer: 'Amazon Web Services', icon: Shield },
        { name: 'Google Cloud Partner', issuer: 'Google Cloud Platform', icon: Award }
      ],
      commitment: {
        title: language === 'en' ? 'Commitment to Excellence' : 'Komitmen pada Keunggulan',
        desc: language === 'en'
          ? 'Our international certifications are not just achievements, they are guarantees that every solution we provide meets the highest quality standards in the industry.'
          : 'Sertifikasi internasional kami bukan sekadar pencapaian, ini adalah jaminan bahwa setiap solusi yang kami berikan memenuhi standar kualitas tertinggi di industri.'
      }
    },
    cta: {
      title: language === 'en' ? "Let's Realize Your Digital Vision" : 'Mari Wujudkan Visi Digital Anda',
      subtitle: language === 'en'
        ? 'Join 200+ companies that have trusted us as their digital transformation partner'
        : 'Bergabunglah dengan 200+ perusahaan yang telah mempercayai kami sebagai mitra transformasi digital mereka',
      button: language === 'en' ? 'Start Free Consultation' : 'Mulai Konsultasi Gratis'
    }
  };

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        {/* hero section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0066FF] via-[#0052CC] to-[#003D99] text-white">
          {/* decorative elements */}
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
          </div>
          
          <div className="relative container mx-auto max-w-7xl px-6 lg:px-8 py-24 lg:py-32">
            <FadeInSection>
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm font-medium">{t.hero.badge}</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  {t.hero.title}
                  <span className="block text-blue-200 mt-2">{t.hero.subtitle}</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-blue-100 leading-relaxed mb-8">
                  {t.hero.description}
                </p>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <Building2 className="w-5 h-5" />
                    <span className="font-semibold text-sm sm:text-base">PT Barcomp Digital Solusindo</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                    <Calendar className="w-5 h-5" />
                    <span className="font-semibold text-sm sm:text-base">{t.hero.established}</span>
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>

          {/* wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="#f9fafb"/>
            </svg>
          </div>
        </section>

        {/* stats */}
        <section className="container mx-auto max-w-7xl px-6 lg:px-8 -mt-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.stats.map((stat, index) => (
              <StatCard 
                key={index}
                number={stat.number}
                label={stat.label}
                icon={stat.icon}
                delay={index * 0.1}
              />
            ))}
          </div>
        </section>

        {/* story section */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              <FadeInSection>
                <div>
                  <div className="inline-block px-4 py-2 bg-blue-100 rounded-full text-sm font-semibold text-[#0066FF] mb-6">
                    {t.story.badge}
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                    {t.story.title}
                  </h2>
                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>{t.story.paragraph1}</p>
                    <p>{t.story.paragraph2}</p>
                    <p>{t.story.paragraph3}</p>
                  </div>
                </div>
              </FadeInSection>

              <FadeInSection delay={0.2}>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">{t.legal.title}</h3>
                  
                  <div className="space-y-4">
                    <Card className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                            <Building2 className="w-5 h-5 text-[#0066FF]" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{t.legal.entity.title}</div>
                            <div className="text-sm text-gray-600">{t.legal.entity.subtitle}</div>
                            <div className="text-xs text-gray-500 mt-1">{t.legal.entity.desc}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                            <Shield className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{t.legal.license.title}</div>
                            <div className="text-sm text-gray-600">{t.legal.license.subtitle}</div>
                            <div className="text-xs text-gray-500 mt-1">{t.legal.license.desc}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                            <Award className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{t.legal.tax.title}</div>
                            <div className="text-sm text-gray-600">{t.legal.tax.subtitle}</div>
                            <div className="text-xs text-gray-500 mt-1">{t.legal.tax.desc}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-[#0066FF] to-[#0052CC] text-white rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-6 h-6" />
                      <span className="font-bold text-lg">{t.legal.commitment.title}</span>
                    </div>
                    <p className="text-sm text-blue-100">
                      {t.legal.commitment.desc}
                    </p>
                  </div>
                </div>
              </FadeInSection>
            </div>
          </div>
        </section>

        {/* timeline section */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto max-w-5xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-2 bg-indigo-100 rounded-full text-sm font-semibold text-indigo-600 mb-6">
                  {t.timeline.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  {t.timeline.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                  {t.timeline.subtitle}
                </p>
              </div>
            </FadeInSection>

            <div className="relative">
              {t.timeline.items.map((item, index) => (
                <TimelineItem 
                  key={index}
                  {...item}
                  isLast={index === t.timeline.items.length - 1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* certifications section */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-2 bg-blue-100 rounded-full text-sm font-semibold text-[#0066FF] mb-6">
                  {t.certifications.badge}
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  {t.certifications.title}
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                  {t.certifications.subtitle}
                </p>
              </div>
            </FadeInSection>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {t.certifications.items.map((cert, index) => (
                <FadeInSection key={index} delay={index * 0.1}>
                  <CertificationBadge {...cert} />
                </FadeInSection>
              ))}
            </div>

            <FadeInSection delay={0.4}>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-12 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
                </div>
                <div className="relative">
                  <Award className="w-16 h-16 mx-auto mb-6 text-blue-400" />
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4">{t.certifications.commitment.title}</h3>
                  <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    {t.certifications.commitment.desc}
                  </p>
                </div>
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* cta */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-br from-[#0066FF] to-[#0052CC] overflow-hidden">
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
      `}</style>
    </>
  );
}