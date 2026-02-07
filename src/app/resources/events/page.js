'use client';

import { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar,
  MapPin,
  Clock,
  Video,
  Building2,
  Globe,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Ticket
} from 'lucide-react';
import { toast } from 'sonner';
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

// Get Location Icon
const getLocationIcon = (type) => {
  switch (type) {
    case 'online': return <Video className="w-4 h-4" />;
    case 'onsite': return <Building2 className="w-4 h-4" />;
    case 'hybrid': return <Globe className="w-4 h-4" />;
    default: return <MapPin className="w-4 h-4" />;
  }
};

// Format tanggal Indonesia
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    return '';
  }
};

// Format waktu Indonesia
const formatTime = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    return '';
  }
};

// Event Type Colors
const eventTypeColors = {
  workshop: 'bg-purple-500 text-white',
  seminar: 'bg-blue-500 text-white',
  webinar: 'bg-green-500 text-white'
};

// Upcoming Event Card Component
const UpcomingEventCard = memo(({ event }) => {
  const daysUntilEvent = Math.ceil(
    (new Date(event.start_date) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className={cn(
      "overflow-hidden border-2 transition-all duration-300 group h-full p-0",
      event.featured 
        ? "border-[#0066FF] hover:shadow-2xl" 
        : "border-gray-200 hover:border-[#0066FF] hover:shadow-xl"
    )}>
      <Link href={`/resources/events/${event.slug}`}>
        <div className="relative h-56 overflow-hidden">
          <Image
            src={event.cover_image || '/images/placeholder-event.jpg'}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute top-4 left-4 flex gap-2">
            {event.featured && (
              <Badge className="bg-[#0066FF] text-white border-0 flex items-center gap-1 shadow-lg">
                <Sparkles className="w-3 h-3" />
                Featured
              </Badge>
            )}
            <EventStatusBadge status={event.status} />
          </div>

          {event.status === 'upcoming' && daysUntilEvent <= 7 && daysUntilEvent > 0 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              {daysUntilEvent} hari lagi!
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4">
            <span className={cn(
              "inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase",
              eventTypeColors[event.event_type] || eventTypeColors.seminar
            )}>
              {event.event_type}
            </span>
          </div>
        </div>
      </Link>

      <CardContent className="p-6">
        <Link href={`/resources/events/${event.slug}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#0066FF] transition-colors duration-300">
            {event.title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-[#0066FF]" />
            <span>{formatDate(event.start_date)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-[#0066FF]" />
            <span>
              {formatTime(event.start_date)} - {formatTime(event.end_date)} WIB
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            {getLocationIcon(event.location_type)}
            <span className="capitalize">{event.location_type}</span>
            {event.location_venue && (
              <span className="text-gray-400">• {event.location_venue}</span>
            )}
          </div>
        </div>

        <Link href={`/resources/events/${event.slug}`}>
          <Button className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white">
            Lihat Detail
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
});

UpcomingEventCard.displayName = 'UpcomingEventCard';

// Past Event Card Component
const PastEventCard = memo(({ event }) => {
  return (
    <Card className="overflow-hidden border-2 border-gray-200 hover:border-[#0066FF] hover:shadow-lg transition-all duration-300 group">
      <div className="flex flex-col md:flex-row">
        <Link href={`/resources/events/${event.slug}`} className="md:w-48 flex-shrink-0">
          <div className="relative h-48 md:h-full overflow-hidden">
            <Image
              src={event.cover_image || '/images/placeholder-event.jpg'}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 192px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            <div className="absolute top-4 left-4">
              {event.featured && (
                <Badge className="bg-[#0066FF] text-white border-0 flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-3 h-3" />
                  Featured
                </Badge>
              )}
            </div>

            <div className="absolute bottom-4 left-4">
              <span className={cn(
                "inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase",
                eventTypeColors[event.event_type] || eventTypeColors.seminar
              )}>
                {event.event_type}
              </span>
            </div>
          </div>
        </Link>

        <CardContent className="flex-1 p-6">
          <div className="flex items-start justify-between mb-3">
            <Link href={`/resources/events/${event.slug}`}>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors line-clamp-2">
                {event.title}
              </h3>
            </Link>
            <EventStatusBadge status={event.status} />
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>

          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-[#0066FF]" />
              <span>{formatDate(event.start_date)}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              {getLocationIcon(event.location_type)}
              <span className="capitalize">{event.location_type}</span>
            </div>
          </div>

          <Link href={`/resources/events/${event.slug}`}>
            <Button variant="outline" className="border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF] hover:text-white">
              Lihat Dokumentasi
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </div>
    </Card>
  );
});

PastEventCard.displayName = 'PastEventCard';

// Skeleton Loading
const EventSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-56 rounded-t-lg" />
    <div className="p-6 space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-20 bg-gray-200 rounded" />
    </div>
  </div>
);

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events dari API
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/events');
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data event');
      }

      const data = await response.json();
      
      if (data.success) {
        const events = data.data || [];
        
        // Pisahkan upcoming dan past events
        const now = new Date();
        const upcoming = events.filter(event => 
          event.status === 'upcoming' || event.status === 'ongoing'
        ).sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        
        const past = events.filter(event => 
          event.status === 'completed'
        ).sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
        
        setUpcomingEvents(upcoming);
        setPastEvents(past);
      } else {
        throw new Error(data.message || 'Gagal mengambil data event');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error(error.message || 'Terjadi kesalahan saat mengambil data event');
      setUpcomingEvents([]);
      setPastEvents([]);
    } finally {
      setLoading(false);
    }
  };

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
                  Acara & Workshop
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Event & Workshop Barcomp
                </h1>
                
                <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
                  Ikuti workshop, seminar, dan webinar kami untuk meningkatkan pengetahuan 
                  dan keterampilan Anda di berbagai bidang teknologi dan bisnis
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
            <div className="flex items-center justify-center md:justify-start gap-4">
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
                Event Mendatang
                <span className={cn(
                  "ml-2 px-2 py-0.5 rounded-full text-xs",
                  activeTab === 'upcoming' ? "bg-white/20" : "bg-gray-200"
                )}>
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
                Event Selesai
                <span className={cn(
                  "ml-2 px-2 py-0.5 rounded-full text-xs",
                  activeTab === 'past' ? "bg-white/20" : "bg-gray-200"
                )}>
                  {pastEvents.length}
                </span>
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
                    Event yang Akan Datang
                  </h2>
                </FadeInSection>

                {loading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                      <EventSkeleton key={i} />
                    ))}
                  </div>
                ) : upcomingEvents.length === 0 ? (
                  <div className="text-center py-20">
                    <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Belum Ada Event Mendatang
                    </h3>
                    <p className="text-gray-600">
                      Pantau terus halaman ini untuk informasi event terbaru kami
                    </p>
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
                    Event yang Telah Selesai
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
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Belum Ada Event yang Selesai
                    </h3>
                    <p className="text-gray-600">
                      Event yang telah selesai akan ditampilkan di sini
                    </p>
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
                  Ingin Mengadakan Event Bersama?
                </h2>
                <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
                  Mari berkolaborasi mengadakan workshop, seminar, atau webinar yang bermanfaat 
                  untuk komunitas dan industri
                </p>
                <Link href="/contact">
                  <Button 
                    size="lg"
                    className="bg-white text-[#0066FF] hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    Hubungi Kami
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