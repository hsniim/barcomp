'use client';

import { useEffect, useRef, useState, useMemo, memo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Code, 
  Smartphone, 
  Palette, 
  TrendingUp, 
  Cloud,
  Award,
  Users,
  Briefcase,
  ArrowRight,
  Calendar,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Dynamic imports for heavy components (code splitting)
const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), {
  ssr: false,
  loading: () => <div className="min-h-[50px]" />
});

// Optimized animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// Memoized Animated Counter Component
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

// Lightweight Fade-in wrapper
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

// Static data
const RECENT_ARTICLES = [
  {
    id: 1,
    title: "Web Development Trends 2026",
    excerpt: "Explore the latest technologies shaping the future of web development, from AI integration to progressive web apps.",
    date: "January 15, 2026",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop&q=80"
  },
  {
    id: 2,
    title: "Mobile-First Design Best Practices",
    excerpt: "Learn how to create seamless mobile experiences that engage users and drive conversions.",
    date: "January 10, 2026",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&q=80"
  },
  {
    id: 3,
    title: "Cloud Migration Success Stories",
    excerpt: "Discover how businesses are leveraging cloud solutions to scale efficiently and reduce costs.",
    date: "January 5, 2026",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&q=80"
  }
];

const UPCOMING_EVENTS = [
  {
    id: 1,
    title: "Tech Innovation Summit 2026",
    description: "Join industry leaders discussing the future of technology and digital transformation.",
    date: "February 20, 2026",
    time: "9:00 AM - 5:00 PM"
  },
  {
    id: 2,
    title: "UI/UX Design Workshop",
    description: "Hands-on workshop covering modern design principles and user experience optimization.",
    date: "March 5, 2026",
    time: "2:00 PM - 6:00 PM"
  },
  {
    id: 3,
    title: "Cloud Computing Masterclass",
    description: "Deep dive into cloud architecture, security, and best practices for enterprise applications.",
    date: "March 18, 2026",
    time: "10:00 AM - 4:00 PM"
  }
];

const CLIENT_LOGOS = [
  "Google", "Amazon", "Microsoft", "Meta", "Apple", "Netflix"
];

// Memoized Service Card Component
const ServiceCard = memo(({ service, learnMoreText, index }) => (
  <Card className="h-full border-gray-200 hover:border-[#0066FF] hover:shadow-lg transition-all duration-300 group">
    <CardHeader>
      <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#0066FF] transition-colors">
        <service.icon className="w-7 h-7 text-[#0066FF] group-hover:text-white transition-colors" />
      </div>
      <CardTitle className="text-xl font-bold text-gray-900">
        {service.title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-gray-600 mb-4 leading-relaxed">
        {service.description}
      </CardDescription>
      <Link 
        href={service.link}
        className="inline-flex items-center text-[#0066FF] font-semibold hover:underline group"
      >
        {learnMoreText}
        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </CardContent>
  </Card>
));

ServiceCard.displayName = 'ServiceCard';

// Memoized Article Card Component
const ArticleCard = memo(({ article, readMoreText }) => (
  <Card className="h-full border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group">
    <div className="relative h-48 overflow-hidden">
      <Image
        src={article.image}
        alt={article.title}
        width={800}
        height={600}
        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      />
    </div>
    <CardHeader>
      <div className="text-sm text-gray-500 mb-2">{article.date}</div>
      <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2">
        {article.title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-gray-600 mb-4 line-clamp-3">
        {article.excerpt}
      </CardDescription>
      <Link 
        href={`/resources/articles/${article.id}`}
        className="inline-flex items-center text-[#0066FF] font-semibold hover:underline"
      >
        {readMoreText}
        <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
    </CardContent>
  </Card>
));

ArticleCard.displayName = 'ArticleCard';

// Memoized Event Card Component
const EventCard = memo(({ event, learnMoreText }) => (
  <Card className="h-full border-gray-200 hover:border-[#0066FF] hover:shadow-lg transition-all duration-300">
    <CardHeader>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
        <Calendar className="w-4 h-4" />
        <span>{event.date}</span>
      </div>
      <CardTitle className="text-xl font-bold text-gray-900">
        {event.title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-gray-600 mb-4">
        {event.description}
      </CardDescription>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Clock className="w-4 h-4" />
        <span>{event.time}</span>
      </div>
      <Link 
        href={`/resources/events/${event.id}`}
        className="inline-flex items-center text-[#0066FF] font-semibold hover:underline mt-4"
      >
        {learnMoreText}
        <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
    </CardContent>
  </Card>
));

EventCard.displayName = 'EventCard';

export default function Home() {
  const [language, setLanguage] = useState('en');

  // Optimized language sync - listen to custom events from Navbar
  useEffect(() => {
    // Initial load
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);

    // Listen for language changes from Navbar
    const handleLanguageChange = (e) => {
      if (e.detail) {
        setLanguage(e.detail);
      }
    };

    // Listen for storage changes (cross-tab)
    const handleStorageChange = (e) => {
      if (e.key === 'language' && e.newValue) {
        setLanguage(e.newValue);
      }
    };

    window.addEventListener('languageChange', handleLanguageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Memoized translations
  const t = useMemo(() => ({
    hero: {
      title: language === 'en' 
        ? 'Barcomp: Innovative IT Solutions for Your Business'
        : 'Barcomp: Solusi IT Inovatif untuk Bisnis Anda',
      subtitle: language === 'en'
        ? 'We deliver cutting-edge web development, mobile apps, UI/UX design, digital marketing, and cloud solutions to transform your business and drive growth in the digital age.'
        : 'Kami menghadirkan pengembangan web terkini, aplikasi mobile, desain UI/UX, pemasaran digital, dan solusi cloud untuk mentransformasi bisnis Anda dan mendorong pertumbuhan di era digital.',
      cta: language === 'en' ? 'Start Your Project' : 'Mulai Proyek Anda',
      imageAlt: language === 'en' 
        ? 'Modern workspace with laptop showing code - Barcomp web development services'
        : 'Ruang kerja modern dengan laptop menampilkan kode - layanan pengembangan web Barcomp'
    },
    trustedBy: language === 'en' ? 'Trusted By Industry Leaders' : 'Dipercaya oleh Industri Terbaik',
    services: {
      title: language === 'en' ? 'Our Services' : 'Layanan Kami',
      subtitle: language === 'en' 
        ? 'Comprehensive IT solutions tailored to your business needs'
        : 'Solusi IT komprehensif yang disesuaikan dengan kebutuhan bisnis Anda',
      items: [
        {
          icon: Code,
          title: language === 'en' ? 'Web Development' : 'Pengembangan Web',
          description: language === 'en'
            ? 'Custom web applications built with cutting-edge technologies for optimal performance and scalability.'
            : 'Aplikasi web khusus yang dibangun dengan teknologi terkini untuk performa dan skalabilitas optimal.',
          link: '/services/web-development'
        },
        {
          icon: Smartphone,
          title: language === 'en' ? 'Mobile App Development' : 'Pengembangan Aplikasi Mobile',
          description: language === 'en'
            ? 'Native and cross-platform mobile applications that deliver exceptional user experiences on iOS and Android.'
            : 'Aplikasi mobile native dan cross-platform yang memberikan pengalaman pengguna luar biasa di iOS dan Android.',
          link: '/services/mobile'
        },
        {
          icon: Palette,
          title: language === 'en' ? 'UI/UX Design' : 'Desain UI/UX',
          description: language === 'en'
            ? 'Beautiful, intuitive interfaces designed with users in mind, combining aesthetics with functionality.'
            : 'Antarmuka yang indah dan intuitif dirancang dengan mempertimbangkan pengguna, menggabungkan estetika dengan fungsi.',
          link: '/services/ui-ux'
        },
        {
          icon: TrendingUp,
          title: language === 'en' ? 'Digital Marketing' : 'Pemasaran Digital',
          description: language === 'en'
            ? 'Data-driven marketing strategies to grow your online presence and reach your target audience effectively.'
            : 'Strategi pemasaran berbasis data untuk mengembangkan kehadiran online Anda dan menjangkau audiens target secara efektif.',
          link: '/services/marketing'
        },
        {
          icon: Cloud,
          title: language === 'en' ? 'Cloud Solutions' : 'Solusi Cloud',
          description: language === 'en'
            ? 'Scalable cloud infrastructure and migration services to modernize your IT operations.'
            : 'Infrastruktur cloud yang skalabel dan layanan migrasi untuk memodernisasi operasi IT Anda.',
          link: '/services/cloud'
        }
      ],
      learnMore: language === 'en' ? 'Learn More' : 'Pelajari Lebih Lanjut'
    },
    about: {
      title: language === 'en' ? 'Why Should Barcomp' : 'Kenapa Harus Barcomp',
      subtitle: language === 'en' 
        ? 'We delivering excellence through innovation and expertise'
        : 'Kami menghadirkan keunggulan melalui inovasi dan keahlian',
      stats: {
        years: language === 'en' ? 'Years Experience' : 'Tahun Pengalaman',
        projects: language === 'en' ? 'Successful Projects' : 'Proyek Sukses',
        clients: language === 'en' ? 'Satisfied Clients' : 'Klien Puas'
      },
      valuesTitle: language === 'en' ? 'Our Core Values' : 'Nilai Inti Kami',
      values: [
        {
          icon: Award,
          title: language === 'en' ? 'Innovation' : 'Inovasi',
          description: language === 'en'
            ? 'We stay ahead of technology trends to deliver cutting-edge solutions.'
            : 'Kami selalu mengikuti tren teknologi untuk menghadirkan solusi terkini.'
        },
        {
          icon: Users,
          title: language === 'en' ? 'Quality' : 'Kualitas',
          description: language === 'en'
            ? 'Excellence in every project, from code to customer service.'
            : 'Keunggulan di setiap proyek, dari kode hingga layanan pelanggan.'
        },
        {
          icon: Briefcase,
          title: language === 'en' ? 'Collaboration' : 'Kolaborasi',
          description: language === 'en'
            ? 'We work closely with clients as partners in success.'
            : 'Kami bekerja sama erat dengan klien sebagai mitra kesuksesan.'
        }
      ]
    },
    news: {
      title: language === 'en' ? 'Latest News & Events' : 'Berita & Acara Terbaru',
      subtitle: language === 'en'
        ? 'Stay updated with our latest insights and upcoming events'
        : 'Tetap update dengan wawasan terbaru dan acara mendatang kami',
      articlesTitle: language === 'en' ? 'Recent Articles' : 'Artikel Terbaru',
      eventsTitle: language === 'en' ? 'Upcoming Events' : 'Acara Mendatang',
      readMore: language === 'en' ? 'Read More' : 'Baca Selengkapnya',
      learnMore: language === 'en' ? 'Learn More' : 'Pelajari Lebih Lanjut'
    },
    cta: {
      title: language === 'en' 
        ? 'Ready to Transform Your Business?'
        : 'Siap Mentransformasi Bisnis Anda?',
      subtitle: language === 'en'
        ? "Let's collaborate to bring your vision to life with innovative IT solutions tailored to your needs."
        : 'Mari berkolaborasi untuk mewujudkan visi Anda dengan solusi IT inovatif yang disesuaikan dengan kebutuhan Anda.',
      button: language === 'en' ? 'Contact Us Now' : 'Hubungi Kami Sekarang'
    }
  }), [language]);

  return (
    <>
      <Navbar />
      
      <main className="bg-white">
        {/* Hero Section - 2 Columns (Text Left, Image Right) */}
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-white pt-20 lg:pt-24">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text Content */}
              <FadeInSection>
                <div className="space-y-6">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    {t.hero.title}
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                    {t.hero.subtitle}
                  </p>
                  <div className="pt-2">
                    <Link href="/contact">
                      <Button 
                        size="lg"
                        className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all duration-300"
                      >
                        {t.hero.cta}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </FadeInSection>

              {/* Right Column - Image */}
              <FadeInSection delay={0.2}>
                <div className="relative">
                  <Image
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=900&fit=crop&q=80"
                    alt={t.hero.imageAlt}
                    width={1200}
                    height={900}
                    priority
                    className="rounded-2xl shadow-2xl"
                  />
                </div>
              </FadeInSection>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-12 bg-gray-50 overflow-hidden">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <h2 className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
                {t.trustedBy}
              </h2>
            </FadeInSection>
            <div className="relative">
              <div className="flex animate-scroll space-x-12 items-center">
                {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((logo, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 flex items-center justify-center w-40 h-20 text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    <span>{logo}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  {t.services.title}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t.services.subtitle}
                </p>
              </div>
            </FadeInSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {t.services.items.map((service, index) => (
                <FadeInSection key={service.link} delay={index * 0.1}>
                  <ServiceCard 
                    service={service} 
                    learnMoreText={t.services.learnMore}
                    index={index}
                  />
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  {t.about.title}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t.about.subtitle}
                </p>
              </div>
            </FadeInSection>

            {/* Stats */}
            <FadeInSection delay={0.2}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="text-5xl font-bold text-[#0066FF] mb-2">
                    <AnimatedCounter end={10} suffix="+" />
                  </div>
                  <div className="text-gray-600 font-medium">{t.about.stats.years}</div>
                </div>
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="text-5xl font-bold text-[#0066FF] mb-2">
                    <AnimatedCounter end={500} suffix="+" />
                  </div>
                  <div className="text-gray-600 font-medium">{t.about.stats.projects}</div>
                </div>
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="text-5xl font-bold text-[#0066FF] mb-2">
                    <AnimatedCounter end={200} suffix="+" />
                  </div>
                  <div className="text-gray-600 font-medium">{t.about.stats.clients}</div>
                </div>
              </div>
            </FadeInSection>

            {/* Core Values */}
            <div>
              <FadeInSection delay={0.3}>
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  {t.about.valuesTitle}
                </h3>
              </FadeInSection>
              
              <FadeInSection delay={0.4}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {t.about.values.map((value) => {
                    const IconComponent = value.icon;
                    return (
                      <Card key={value.title} className="border-gray-200 hover:border-[#0066FF] hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <IconComponent className="w-6 h-6 text-[#0066FF]" />
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-gray-900 mb-2">
                                {value.title}
                              </h4>
                              <p className="text-gray-600 leading-relaxed">
                                {value.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </FadeInSection>
            </div>
          </div>
        </section>

        {/* News & Events Section */}
        <section id="news" className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <FadeInSection>
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  {t.news.title}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {t.news.subtitle}
                </p>
              </div>
            </FadeInSection>

            {/* Recent Articles */}
            <div className="mb-16">
              <FadeInSection delay={0.1}>
                <h3 className="text-2xl font-bold text-gray-900 mb-8">{t.news.articlesTitle}</h3>
              </FadeInSection>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {RECENT_ARTICLES.map((article, index) => (
                  <FadeInSection key={article.id} delay={0.1 + index * 0.1}>
                    <ArticleCard article={article} readMoreText={t.news.readMore} />
                  </FadeInSection>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <FadeInSection delay={0.2}>
                <h3 className="text-2xl font-bold text-gray-900 mb-8">{t.news.eventsTitle}</h3>
              </FadeInSection>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {UPCOMING_EVENTS.map((event, index) => (
                  <FadeInSection key={event.id} delay={0.2 + index * 0.1}>
                    <EventCard event={event} learnMoreText={t.news.learnMore} />
                  </FadeInSection>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-br from-[#0066FF] to-[#0052CC] overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="container mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <FadeInSection>
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                  {t.cta.title}
                </h2>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  {t.cta.subtitle}
                </p>
                <Link href="/contact">
                  <Button 
                    size="lg"
                    className="bg-white text-[#0066FF] hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    {t.cta.button}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </FadeInSection>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }

        .bg-grid-white\/10 {
          background-image: linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </>
  );
}