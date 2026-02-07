'use client';

import { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  Video,
  Building2,
  Globe,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
  ChevronRight,
  User,
  Ticket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Fade-in Animation Component
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

// Event Status Badge Component
const EventStatusBadge = memo(({ status }) => {
  const statusConfig = {
    upcoming: {
      label: 'Segera Hadir',
      icon: Clock,
      className: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    ongoing: {
      label: 'Sedang Berlangsung',
      icon: TrendingUp,
      className: 'bg-green-100 text-green-700 border-green-200'
    },
    completed: {
      label: 'Selesai',
      icon: CheckCircle2,
      className: 'bg-gray-100 text-gray-700 border-gray-200'
    },
    cancelled: {
      label: 'Dibatalkan',
      icon: AlertCircle,
      className: 'bg-red-100 text-red-700 border-red-200'
    }
  };

  const config = statusConfig[status] || statusConfig.upcoming;
  const Icon = config.icon;

  return (
    <Badge className={cn("border flex items-center gap-1 px-3 py-1", config.className)}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
});

EventStatusBadge.displayName = 'EventStatusBadge';

// Upcoming Event Card Component
const UpcomingEventCard = memo(({ event }) => {
  const daysUntilEvent = Math.ceil(
    (new Date(event.startDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const getLocationIcon = () => {
    switch (event.location.type) {
      case 'online': return <Video className="w-4 h-4" />;
      case 'onsite': return <Building2 className="w-4 h-4" />;
      case 'hybrid': return <Globe className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden border-2 transition-all duration-300 group h-full p-0",
      event.featured 
        ? "border-[#0066FF] hover:shadow-2xl" 
        : "border-gray-200 hover:border-[#0066FF] hover:shadow-xl"
    )}>
      <div className="relative h-56 overflow-hidden">
        <Image
          src={event.coverImage}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute top-4 left-4 flex gap-2">
          {event.featured && (
            <Badge className="bg-[#0066FF] text-white border-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Featured
            </Badge>
          )}
          <EventStatusBadge status={event.status} />
        </div>

        {event.status === 'upcoming' && daysUntilEvent <= 7 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {daysUntilEvent} hari lagi!
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4">
          <span className={cn(
            "inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase",
            event.eventType === 'workshop' && "bg-purple-500 text-white",
            event.eventType === 'seminar' && "bg-blue-500 text-white",
            event.eventType === 'webinar' && "bg-green-500 text-white",
            event.eventType === 'conference' && "bg-red-500 text-white",
            event.eventType === 'training' && "bg-yellow-500 text-white"
          )}>
            {event.eventType}
          </span>
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#0066FF] transition-colors duration-300">
          {event.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-[#0066FF]" />
            <span>
              {new Date(event.startDate).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-[#0066FF]" />
            <span>
              {new Date(event.startDate).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
              })} - {new Date(event.endDate).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
              })} WIB
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            {getLocationIcon()}
            <span className="capitalize">{event.location.type}</span>
            {event.location.venue && (
              <span className="text-gray-400">• {event.location.venue}</span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-[#0066FF]" />
            <span>{event.registeredCount} / {event.capacity} peserta</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2 ml-2">
              <div 
                className="bg-[#0066FF] h-2 rounded-full transition-all duration-500"
                style={{ width: `${(event.registeredCount / event.capacity) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Speakers Preview */}
        {event.speakers && event.speakers.length > 0 && (
          <div className="mb-4 pb-4 border-b border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Pembicara:</p>
            <div className="flex items-center gap-2">
              {event.speakers.slice(0, 3).map((speaker, idx) => (
                <div key={idx} className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
                  <Image
                    src={speaker.avatar}
                    alt={speaker.name}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
              ))}
              {event.speakers.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{event.speakers.length - 3} lainnya
                </span>
              )}
            </div>
          </div>
        )}

        {/* Price & Registration */}
        <div className="flex items-center justify-between">
          <div>
            {event.price.isFree ? (
              <span className="text-xl font-bold text-green-600">Gratis</span>
            ) : (
              <div>
                <p className="text-xs text-gray-500">Biaya</p>
                <span className="text-xl font-bold text-gray-900">
                  Rp {event.price.amount.toLocaleString('id-ID')}
                </span>
              </div>
            )}
          </div>

          <Link href={event.registrationUrl}>
            <Button 
              className="bg-[#0066FF] hover:bg-[#0052CC] text-white"
              disabled={event.registeredCount >= event.capacity}
            >
              {event.registeredCount >= event.capacity ? 'Penuh' : 'Daftar'}
              {event.registeredCount < event.capacity && (
                <ArrowRight className="ml-2 w-4 h-4" />
              )}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
});

UpcomingEventCard.displayName = 'UpcomingEventCard';

// Past Event Card (Archive) Component
const PastEventCard = memo(({ event }) => {
  return (
    <Card className="overflow-hidden border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 group p-0">
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full md:w-48 h-48 md:h-auto overflow-hidden">
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent" />
          <div className="absolute top-3 left-3">
            <EventStatusBadge status={event.status} />
          </div>
        </div>

        <CardContent className="p-5 flex-1">
          <div className="flex items-start justify-between mb-2">
            <span className={cn(
              "px-2 py-1 rounded text-xs font-semibold uppercase",
              event.eventType === 'workshop' && "bg-purple-100 text-purple-700",
              event.eventType === 'seminar' && "bg-blue-100 text-blue-700",
              event.eventType === 'webinar' && "bg-green-100 text-green-700",
              event.eventType === 'conference' && "bg-red-100 text-red-700",
              event.eventType === 'training' && "bg-yellow-100 text-yellow-700"
            )}>
              {event.eventType}
            </span>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#0066FF] transition-colors duration-300">
            {event.title}
          </h3>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {event.description}
          </p>

          <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(event.startDate).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {event.registeredCount} peserta
            </span>
          </div>

          <Link href={`/resources/events/${event.slug}`}>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-[#0066FF] hover:text-[#0052CC] p-0 h-auto"
            >
              Lihat Detail
              <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          </Link>
        </CardContent>
      </div>
    </Card>
  );
});

PastEventCard.displayName = 'PastEventCard';

// Main Events Page Component
export default function EventsPage() {
  const [language, setLanguage] = useState('id');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Translations
  const t = {
    id: {
      hero: {
        badge: 'Acara & Pelatihan',
        title: 'Event & Workshop Mendatang',
        subtitle: 'Bergabunglah dengan berbagai acara, workshop, dan pelatihan untuk meningkatkan skills dan memperluas network Anda di industri teknologi.'
      },
      tabs: {
        upcoming: 'Akan Datang',
        past: 'Arsip'
      },
      upcoming: {
        title: 'Event Mendatang',
        empty: 'Belum ada event yang dijadwalkan'
      },
      past: {
        title: 'Event Sebelumnya',
        empty: 'Belum ada event yang selesai'
      },
      cta: {
        title: 'Ingin Mengadakan Event Bersama?',
        subtitle: 'Kami terbuka untuk kolaborasi dalam mengadakan workshop, seminar, atau pelatihan. Hubungi kami untuk mendiskusikan ide Anda.',
        button: 'Hubungi Kami'
      }
    },
    en: {
      hero: {
        badge: 'Events & Training',
        title: 'Upcoming Events & Workshops',
        subtitle: 'Join various events, workshops, and training sessions to enhance your skills and expand your network in the tech industry.'
      },
      tabs: {
        upcoming: 'Upcoming',
        past: 'Archive'
      },
      upcoming: {
        title: 'Upcoming Events',
        empty: 'No events scheduled yet'
      },
      past: {
        title: 'Past Events',
        empty: 'No completed events yet'
      },
      cta: {
        title: 'Want to Host an Event Together?',
        subtitle: 'We are open to collaborations in hosting workshops, seminars, or training sessions. Contact us to discuss your ideas.',
        button: 'Contact Us'
      }
    }
  };

  const content = t[language];

  // Mock data - Replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Mock upcoming events
      const mockUpcoming = [
        {
          id: 'evt-001',
          title: 'Web Development Masterclass 2026',
          slug: 'web-development-masterclass-2026',
          description: 'Intensive workshop covering modern web development with Next.js, React, and cutting-edge tools.',
          coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
          eventType: 'workshop',
          location: {
            type: 'hybrid',
            venue: 'Barcomp Innovation Center',
            address: 'Jl. Teknologi No. 123',
            city: 'Cikarang'
          },
          startDate: '2026-02-15T09:00:00Z',
          endDate: '2026-02-15T17:00:00Z',
          capacity: 50,
          registeredCount: 32,
          status: 'upcoming',
          featured: true,
          speakers: [
            {
              name: 'John Doe',
              title: 'Senior Full-Stack Developer',
              avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop'
            },
            {
              name: 'Jane Smith',
              title: 'UX Engineer',
              avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop'
            }
          ],
          registrationUrl: '/events/register/web-masterclass-2026',
          price: {
            amount: 500000,
            currency: 'IDR',
            isFree: false
          }
        },
        {
          id: 'evt-002',
          title: 'Cloud Computing Fundamentals',
          slug: 'cloud-computing-fundamentals',
          description: 'Learn the basics of cloud infrastructure, deployment strategies, and best practices.',
          coverImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=600&fit=crop',
          eventType: 'webinar',
          location: {
            type: 'online',
            venue: null
          },
          startDate: '2026-02-20T14:00:00Z',
          endDate: '2026-02-20T16:00:00Z',
          capacity: 100,
          registeredCount: 67,
          status: 'upcoming',
          featured: false,
          speakers: [
            {
              name: 'Michael Chen',
              title: 'Cloud Architect',
              avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop'
            }
          ],
          registrationUrl: '/events/register/cloud-fundamentals',
          price: {
            amount: 0,
            currency: 'IDR',
            isFree: true
          }
        },
        {
          id: 'evt-003',
          title: 'Digital Marketing Strategy Summit 2026',
          slug: 'digital-marketing-strategy-summit-2026',
          description: 'Join industry leaders discussing the latest trends and strategies in digital marketing.',
          coverImage: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=600&fit=crop',
          eventType: 'conference',
          location: {
            type: 'onsite',
            venue: 'Jakarta Convention Center',
            address: 'Jl. Gatot Subroto',
            city: 'Jakarta'
          },
          startDate: '2026-03-10T08:00:00Z',
          endDate: '2026-03-11T17:00:00Z',
          capacity: 500,
          registeredCount: 423,
          status: 'upcoming',
          featured: true,
          speakers: [
            {
              name: 'Sarah Williams',
              title: 'Marketing Director',
              avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop'
            },
            {
              name: 'David Lee',
              title: 'SEO Specialist',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
            },
            {
              name: 'Lisa Anderson',
              title: 'Content Strategist',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'
            }
          ],
          registrationUrl: '/events/register/marketing-summit-2026',
          price: {
            amount: 1500000,
            currency: 'IDR',
            isFree: false
          }
        }
      ];

      // Mock past events
      const mockPast = [
        {
          id: 'evt-past-001',
          title: 'React Performance Optimization Workshop',
          slug: 'react-performance-optimization-workshop',
          description: 'Deep dive into React performance optimization techniques and best practices.',
          coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
          eventType: 'workshop',
          location: {
            type: 'hybrid',
            venue: 'Barcomp Office'
          },
          startDate: '2025-12-15T09:00:00Z',
          endDate: '2025-12-15T17:00:00Z',
          registeredCount: 45,
          status: 'completed'
        },
        {
          id: 'evt-past-002',
          title: 'AI & Machine Learning Seminar',
          slug: 'ai-machine-learning-seminar',
          description: 'Exploring the future of AI and practical machine learning applications.',
          coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
          eventType: 'seminar',
          location: {
            type: 'online',
            venue: null
          },
          startDate: '2025-11-20T14:00:00Z',
          endDate: '2025-11-20T17:00:00Z',
          registeredCount: 230,
          status: 'completed'
        }
      ];

      setTimeout(() => {
        setUpcomingEvents(mockUpcoming);
        setPastEvents(mockPast);
        setLoading(false);
      }, 500);
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-to-br from-[#0066FF] via-[#0052CC] to-[#003D99] overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="container mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <FadeInSection>
              <div className="text-center max-w-4xl mx-auto">
                <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold text-white mb-6 shadow-lg">
                  <Calendar className="w-4 h-4 inline-block mr-2" />
                  {content.hero.badge}
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  {content.hero.title}
                </h1>
                
                <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
                  {content.hero.subtitle}
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

        {/* Tabs Navigation */}
        <section className="py-8 border-b border-gray-200 bg-white shadow-sm">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={cn(
                    "px-6 py-3 rounded-lg font-semibold transition-all duration-300",
                    activeTab === 'upcoming'
                      ? "bg-[#0066FF] text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  <Ticket className="w-4 h-4 inline-block mr-2" />
                  {content.tabs.upcoming}
                  <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {upcomingEvents.length}
                  </span>
                </button>
                
                <button
                  onClick={() => setActiveTab('past')}
                  className={cn(
                    "px-6 py-3 rounded-lg font-semibold transition-all duration-300",
                    activeTab === 'past'
                      ? "bg-[#0066FF] text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  <CheckCircle2 className="w-4 h-4 inline-block mr-2" />
                  {content.tabs.past}
                  <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {pastEvents.length}
                  </span>
                </button>
              </div>

              <button
                onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {language === 'id' ? 'EN' : 'ID'}
              </button>
            </div>
          </div>
        </section>

        {/* Events Content */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto max-w-7xl px-6 lg:px-8">
            {activeTab === 'upcoming' && (
              <>
                <FadeInSection>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    {content.upcoming.title}
                  </h2>
                </FadeInSection>

                {loading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 h-56 rounded-t-lg" />
                        <div className="p-6 space-y-4">
                          <div className="h-4 bg-gray-200 rounded w-3/4" />
                          <div className="h-4 bg-gray-200 rounded w-1/2" />
                          <div className="h-20 bg-gray-200 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : upcomingEvents.length === 0 ? (
                  <div className="text-center py-20">
                    <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-xl text-gray-500">{content.upcoming.empty}</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {upcomingEvents.map((event, index) => (
                      <FadeInSection key={event.id} delay={index * 0.1}>
                        <UpcomingEventCard event={event} />
                      </FadeInSection>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'past' && (
              <>
                <FadeInSection>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    {content.past.title}
                  </h2>
                </FadeInSection>

                {loading ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse flex gap-4">
                        <div className="bg-gray-200 w-48 h-32 rounded" />
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4" />
                          <div className="h-4 bg-gray-200 rounded w-1/2" />
                          <div className="h-16 bg-gray-200 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : pastEvents.length === 0 ? (
                  <div className="text-center py-20">
                    <CheckCircle2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-xl text-gray-500">{content.past.empty}</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pastEvents.map((event, index) => (
                      <FadeInSection key={event.id} delay={index * 0.1}>
                        <PastEventCard event={event} />
                      </FadeInSection>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-br from-[#0066FF] to-[#0052CC] overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <FadeInSection>
              <div className="text-center max-w-3xl mx-auto">
                <Calendar className="w-16 h-16 mx-auto mb-6 text-white" />
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                  {content.cta.title}
                </h2>
                <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
                  {content.cta.subtitle}
                </p>
                <Link href="/contact">
                  <Button 
                    size="lg"
                    className="bg-white text-[#0066FF] hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    {content.cta.button}
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