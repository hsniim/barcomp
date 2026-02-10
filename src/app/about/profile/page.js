'use client';

import { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  ChevronRight,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Instagram
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

// Animated Counter Component
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

// StatCard Component
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

// Timeline Item Component
const TimelineItem = memo(({ year, title, description, icon: Icon, isLast = false }) => {
  return (
    <FadeInSection>
      <div className="relative flex gap-6 pb-12">
        {!isLast && (
          <div className="absolute left-6 top-14 w-0.5 h-full bg-gradient-to-b from-[#0066FF] to-[#0052CC]" />
        )}
        
        <div className="relative flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-xl flex items-center justify-center shadow-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
        
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

// Certification Badge Component
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

// Leadership Card Component (NEW)
const LeadershipCard = memo(({ name, position, image, bio, linkedin, email, instagram, cardIndex = 0 }) => {
  return (
    <FadeInSection>
      <Card className="h-full border-gray-200 hover:border-[#0066FF] hover:shadow-xl transition-all duration-300 overflow-hidden group bg-white p-0">
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0066FF] to-[#0052CC] flex items-center justify-center">
                <Users className="w-12 h-12 text-white" />
              </div>
            </div>
          )}
        </div>
        <CardContent className="p-6 pt-0 pb-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#0066FF] transition-colors duration-300">
            {name}
          </h3>
          <p className="text-gray-600 font-semibold text-sm mb-3">{position}</p>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{bio}</p>
        </CardContent>
      </Card>
    </FadeInSection>
  );
});

LeadershipCard.displayName = 'LeadershipCard';

export default function ProfilePage() {
  const t = {
    hero: {
      badge: 'Dedikasi dan Perjalanan Kami',
      title: 'Membangun Masa Depan Digital',
      subtitle: 'Sejak 2015',
      description: 'PT Barcomp Digital Solusindo lahir dari keyakinan sederhana: teknologi yang tepat dapat mengubah cara bisnis tumbuh dan berkembang. Lebih dari sekadar penyedia layanan, kami adalah mitra strategis yang berkomitmen membantu setiap klien mencapai potensi maksimalnya.',
      established: 'Berdiri 2015'
    },
    stats: [
      { number: '9+', label: 'Tahun Pengalaman', icon: Calendar },
      { number: '500+', label: 'Proyek Selesai', icon: Target },
      { number: '200+', label: 'Klien Terpercaya', icon: Users },
      { number: '50+', label: 'Tim Ahli', icon: Award }
    ],
    story: {
      badge: 'Cerita Kami',
      title: 'Dari Visi Sederhana Menuju Kepemimpinan Regional',
      paragraph1: 'Barcomp lahir di tahun 2015 dengan tekad kuat: menghadirkan transformasi digital yang berdampak nyata bagi bisnis Indonesia. Kami memulai dengan tim kecil yang penuh semangat, melayani klien pertama kami dengan dedikasi penuh.',
      paragraph2: 'Sepanjang perjalanan, kami tidak hanya berkembang dalam skala, tetapi juga dalam kedalaman keahlian. Setiap proyek adalah kesempatan untuk belajar, berinovasi, dan memberikan nilai lebih kepada klien.',
      paragraph3: 'Hari ini, dengan lebih dari 500 proyek yang telah diselesaikan dan kepercayaan dari 200+ klien, kami bangga menjadi mitra digital yang diandalkan oleh berbagai industri—dari startup hingga korporasi besar.'
    },
    teamPhoto: {
      badge: 'Tim Kami',
      title: 'Orang-Orang di Balik Kesuksesan Kami',
      subtitle: 'Kenali para profesional berbakat yang membawa inovasi dan keunggulan ke setiap proyek.',
      imagePlaceholder: '/images/team-photo.webp',
    },
    leadership: {
      badge: 'Tim Kepemimpinan',
      title: 'Kenali Pemimpin Kami',
      subtitle: 'Pemimpin berpengalaman yang memandu visi kami dan mendorong inovasi di seluruh organisasi.',
      members: [
        {
          name: 'Agus Subianto',
          position: 'Chief Executive Officer',
          image: '/images/ceo.webp',
          bio: 'Memimpin Barcomp dengan pengalaman 15+ tahun dalam transformasi digital dan inovasi teknologi.',
          linkedin: 'https://linkedin.com/in/your-ceo-profile',
          email: 'ceo@barcomp.co.id',
          instagram: 'https://instagram.com/your-ceo-handle'
        },
        {
          name: 'Ahmad Suhandi',
          position: 'Chief Technology Officer',
          image: '/images/cto.webp',
          bio: 'Mendorong keunggulan teknis dan strategi inovasi dengan keahlian dalam arsitektur cloud dan AI.',
          linkedin: 'https://linkedin.com/in/your-cto-profile',
          email: 'cto@barcomp.co.id',
          instagram: 'https://instagram.com/your-cto-handle'
        },
        {
          name: 'Medina Putri',
          position: 'Chief Operating Officer',
          image: '/images/coo.webp',
          bio: 'Memastikan keunggulan operasional dan kepuasan klien di semua proyek dan tim.',
          linkedin: 'https://linkedin.com/in/your-coo-profile',
          email: 'coo@barcomp.co.id',
          instagram: 'https://instagram.com/your-coo-handle'
        }
      ]
    },
    office: {
      badge: 'Kantor Kami',
      title: 'Tempat Inovasi Terjadi',
      subtitle: 'Ruang kerja modern kami di Jakarta, dirancang untuk mendorong kreativitas, kolaborasi, dan produktivitas.',
      address: 'Jakarta, Indonesia',
      imagePlaceholder: '/images/off.webp'
    },
    legal: {
      title: 'Landasan Legal & Kredibilitas',
      entity: {
        title: 'Badan Hukum',
        subtitle: 'PT Barcomp Digital Solusindo',
        desc: 'Terdaftar resmi dan beroperasi sesuai hukum Indonesia'
      },
      license: {
        title: 'NIB & Izin Usaha',
        subtitle: 'Nomor Induk Berusaha Terintegrasi',
        desc: 'Memenuhi seluruh regulasi pemerintah'
      },
      tax: {
        title: 'NPWP & Pajak',
        subtitle: 'PKP (Pengusaha Kena Pajak)',
        desc: 'Taat pajak dan administrasi keuangan'
      },
      commitment: {
        title: 'Komitmen Transparansi',
        desc: 'Kami beroperasi dengan standar tertinggi dalam tata kelola perusahaan, memastikan setiap klien bekerja dengan mitra yang kredibel dan terpercaya.'
      }
    },
    timeline: {
      badge: 'Perjalanan Kami',
      title: 'Milestone yang Membentuk Kami',
      subtitle: 'Setiap langkah adalah bukti komitmen kami terhadap keunggulan dan inovasi berkelanjutan',
      items: [
        {
          year: '2015',
          title: 'Berdirinya Barcomp',
          description: 'Dimulai dengan visi untuk menghadirkan solusi digital yang mengubah cara bisnis beroperasi di Indonesia. Dari kantor kecil dengan tim 5 orang, kami berkomitmen untuk memberikan kualitas terbaik.',
          icon: Building2
        },
        {
          year: '2017',
          title: 'Ekspansi Layanan',
          description: 'Meluncurkan divisi custom software development dan cloud solutions. Memperluas tim menjadi 20+ profesional dan melayani klien dari berbagai industri.',
          icon: TrendingUp
        },
        {
          year: '2019',
          title: 'Sertifikasi Internasional',
          description: 'Memperoleh sertifikasi ISO 9001:2015 dan menjadi Microsoft Gold Partner. Menandai komitmen kami terhadap standar kualitas global.',
          icon: Award
        },
        {
          year: '2021',
          title: 'Era Partnership',
          description: 'Menjadi AWS Partner dan Google Cloud Partner. Membuka peluang untuk memberikan solusi cloud enterprise-grade kepada klien di seluruh Asia Tenggara.',
          icon: Shield
        },
        {
          year: '2025',
          title: 'Kepemimpinan Regional',
          description: 'Dengan 200+ klien dan 50+ tim ahli, kami terus berinovasi untuk menjadi penyedia solusi digital terkemuka di Asia Tenggara.',
          icon: Sparkles
        }
      ]
    },
    certifications: {
      badge: 'Standar Global',
      title: 'Sertifikasi & Kemitraan',
      subtitle: 'Dipercaya oleh pemimpin teknologi dunia dan berstandar internasional',
      items: [
        { name: 'ISO 9001:2015', issuer: 'Sistem Manajemen Mutu', icon: Shield },
        { name: 'Microsoft Gold Partner', issuer: 'Microsoft Corporation', icon: Award },
        { name: 'AWS Partner', issuer: 'Amazon Web Services', icon: Shield },
        { name: 'Google Cloud Partner', issuer: 'Google Cloud Platform', icon: Award }
      ],
      commitment: {
        title: 'Komitmen pada Keunggulan',
        desc: 'Sertifikasi internasional kami bukan sekadar pencapaian—ini adalah jaminan bahwa setiap solusi yang kami berikan memenuhi standar kualitas tertinggi di industri.'
      }
    },
    cta: {
      title: 'Mari Wujudkan Visi Digital Anda',
      subtitle: 'Bergabunglah dengan 200+ perusahaan yang telah mempercayai kami sebagai mitra transformasi digital mereka',
      button: 'Mulai Konsultasi Gratis'
    }
  };

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0066FF] via-[#0052CC] to-[#003D99] text-white">
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

          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="#f9fafb"/>
            </svg>
          </div>
        </section>

        {/* Stats Section */}
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

        {/* Team Photo Section (NEW) */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-12">
                <div className="inline-block px-4 py-2 bg-blue-100 rounded-full text-sm font-semibold text-[#0066FF] mb-6">
                  {t.teamPhoto.badge}
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {t.teamPhoto.title}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t.teamPhoto.subtitle}
                </p>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <div className="relative h-96 sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                {t.teamPhoto.imagePlaceholder ? (
                  <Image
                    src={t.teamPhoto.imagePlaceholder}
                    alt={t.teamPhoto.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <div className="text-center">
                      <Users className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">
                        {'Placeholder Foto Tim'}
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        {'Ganti dengan: /images/team/team-photo.jpg'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              <FadeInSection>
                <div>
                  <div className="inline-block px-4 py-2 bg-blue-100 rounded-full text-sm font-semibold text-[#0066FF] mb-6">
                    {t.story.badge}
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
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

        {/* Leadership Team Section (NEW) */}
        <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0066FF] rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
            <FadeInSection>
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-2 bg-[#0066FF]/10 rounded-full text-sm font-semibold text-[#0066FF] mb-6">
                  {t.leadership.badge}
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
                  {t.leadership.title}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t.leadership.subtitle}
                </p>
              </div>
            </FadeInSection>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {t.leadership.members.map((member, index) => (
                <LeadershipCard key={index} {...member} cardIndex={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto max-w-5xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-2 bg-purple-100 rounded-full text-sm font-semibold text-purple-600 mb-6">
                  {t.timeline.badge}
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
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

        {/* Office Section (NEW) */}
        <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-12">
                <div className="inline-block px-4 py-2 bg-green-100 rounded-full text-sm font-semibold text-green-600 mb-6">
                  {t.office.badge}
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
                  {t.office.title}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
                  {t.office.subtitle}
                </p>
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>{t.office.address}</span>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <div className="relative h-96 sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                {t.office.imagePlaceholder ? (
                  <Image
                    src={t.office.imagePlaceholder}
                    alt={t.office.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <Building2 className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">
                        {'Placeholder Foto Kantor'}
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        {'Ganti dengan: /images/office/workspace.jpg'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Certifications Section */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <div className="inline-block px-4 py-2 bg-blue-100 rounded-full text-sm font-semibold text-[#0066FF] mb-6">
                  {t.certifications.badge}
                </div>
                <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
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