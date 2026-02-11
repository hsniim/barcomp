'use client';

import { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { 
  Calendar,
  Clock,
  MapPin,
  Video,
  Building2,
  Globe,
  ChevronLeft,
  Users,
  Share2,
  Bookmark,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Tag,
  FileText,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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

// Event Status Badge (sama dengan list page)
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

// Event Type Colors (sama dengan list page)
const eventTypeColors = {
  workshop: 'bg-purple-500 text-white',
  seminar: 'bg-blue-500 text-white',
  webinar: 'bg-green-500 text-white'
};

// Get Location Icon (sama dengan list page)
const getLocationIcon = (type) => {
  switch (type) {
    case 'online': return <Video className="w-5 h-5" />;
    case 'onsite': return <Building2 className="w-5 h-5" />;
    case 'hybrid': return <Globe className="w-5 h-5" />;
    default: return <MapPin className="w-5 h-5" />;
  }
};

// Get Location Text
const getLocationText = (type) => {
  switch (type) {
    case 'online': return 'Online';
    case 'onsite': return 'Onsite';
    case 'hybrid': return 'Hybrid (Online + Onsite)';
    default: return 'TBA';
  }
};

// Format tanggal Indonesia (sama dengan list page)
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

// Format waktu Indonesia (sama dengan list page)
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

// Event Skeleton
const EventSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-64 md:h-96 w-full rounded-t-2xl" />
    <div className="p-6 md:p-10 lg:p-12 space-y-6">
      <div className="flex gap-3">
        <div className="h-6 bg-gray-200 rounded w-32" />
        <div className="h-6 bg-gray-200 rounded w-24" />
      </div>
      <div className="h-12 bg-gray-200 rounded w-3/4" />
      <div className="space-y-3">
        <div className="h-5 bg-gray-200 rounded w-1/2" />
        <div className="h-5 bg-gray-200 rounded w-2/3" />
        <div className="h-5 bg-gray-200 rounded w-1/2" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
    </div>
  </div>
);

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    if (params?.slug) {
      fetchEvent(params.slug);
    }
  }, [params?.slug]);

  const fetchEvent = async (slug) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/events?slug=${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('notfound');
          return;
        }
        throw new Error('Gagal memuat event');
      }

      const data = await response.json();
      
      if (!data.success || !data.data || data.data.length === 0) {
        setError('notfound');
        return;
      }

      setEvent(data.data[0]);
    } catch (err) {
      console.error('Error fetching event:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    if (!event) return;
    
    // Scroll to registration section
    const registrationSection = document.getElementById('registration');
    if (registrationSection) {
      registrationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleShare = () => {
    if (navigator.share && event) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      }).catch(() => {
        toast.error('Gagal membagikan event');
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link berhasil disalin!');
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-12 lg:py-16 max-w-5xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200">
            <EventSkeleton />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Error 404
  if (error === 'notfound' || !event) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-12 lg:py-16 max-w-5xl">
          <FadeInSection>
            <div className="text-center py-20">
              <Calendar className="w-20 h-20 mx-auto text-gray-300 mb-6" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Event Tidak Ditemukan
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Maaf, event yang Anda cari tidak ditemukan atau sudah dihapus
              </p>
              <Link href="/resources/events">
                <Button 
                  size="lg"
                  className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-8 shadow-lg hover:shadow-xl transition-all"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Kembali ke Daftar Event
                </Button>
              </Link>
            </div>
          </FadeInSection>
        </main>
        <Footer />
      </>
    );
  }

  // Error lainnya
  if (error) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-12 lg:py-16 max-w-5xl">
          <FadeInSection>
            <div className="text-center py-20">
              <AlertCircle className="w-20 h-20 mx-auto text-red-400 mb-6" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Terjadi Kesalahan
              </h1>
              <p className="text-lg text-gray-600 mb-8">{error}</p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => fetchEvent(params.slug)}
                  className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-8 shadow-lg hover:shadow-xl transition-all"
                >
                  Coba Lagi
                </Button>
                <Link href="/resources/events">
                  <Button 
                    variant="outline"
                    className="border-2 border-gray-200 hover:border-[#0066FF] hover:bg-gray-50 px-8"
                  >
                    Kembali
                  </Button>
                </Link>
              </div>
            </div>
          </FadeInSection>
        </main>
        <Footer />
      </>
    );
  }

  // Parse tags jika dalam bentuk string JSON
  let tags = [];
  if (event.tags) {
    try {
      tags = typeof event.tags === 'string' ? JSON.parse(event.tags) : event.tags;
    } catch (e) {
      tags = [];
    }
  }

  const config = statusConfig[event.status] || statusConfig.upcoming;
  const StatusIcon = config.icon;

  // Calculate days until event
  const daysUntilEvent = Math.ceil(
    (new Date(event.start_date) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        {/* Back Button - Sticky */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="container mx-auto max-w-5xl px-4 py-4">
            <Link href="/resources/events">
              <Button 
                variant="outline" 
                className="border-2 border-gray-200 hover:border-[#0066FF] hover:bg-gray-50 transition-all"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Kembali ke Daftar Event
              </Button>
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 lg:py-12 max-w-5xl">
          <FadeInSection>
            <article className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200">
              {/* Hero / Cover Image */}
              {event.cover_image && (
                <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
                  <Image
                    src={event.cover_image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 1024px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  
                  {/* Badges on image */}
                  <div className="absolute top-6 left-6 flex flex-wrap gap-3">
                    {event.featured && (
                      <Badge className="bg-[#0066FF] text-white border-0 flex items-center gap-1 shadow-lg px-4 py-2 text-base">
                        <Sparkles className="w-4 h-4" />
                        Featured
                      </Badge>
                    )}
                    <Badge className={cn("border flex items-center gap-1 px-4 py-2 text-base", config.className)}>
                      <StatusIcon className="w-4 h-4" />
                      {config.label}
                    </Badge>
                  </div>

                  {/* Countdown badge */}
                  {event.status === 'upcoming' && daysUntilEvent <= 7 && daysUntilEvent > 0 && (
                    <div className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      {daysUntilEvent} hari lagi!
                    </div>
                  )}

                  {/* Event Type Badge */}
                  <div className="absolute bottom-6 left-6">
                    <span className={cn(
                      "inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase shadow-lg",
                      eventTypeColors[event.event_type] || eventTypeColors.seminar
                    )}>
                      {event.event_type}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-6 sm:p-8 md:p-10 lg:p-12">
                {/* Meta Info */}
                <FadeInSection delay={0.1}>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {tags && tags.length > 0 && tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="border-gray-300 text-gray-600 hover:border-[#0066FF] hover:text-[#0066FF] transition-colors"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </FadeInSection>

                {/* Title */}
                <FadeInSection delay={0.2}>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    {event.title}
                  </h1>
                </FadeInSection>

                {/* Event Info Grid */}
                <FadeInSection delay={0.3}>
                  <div className="grid md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-gray-200">
                    {/* Date */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#0066FF]/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-[#0066FF]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Tanggal</p>
                        <p className="font-semibold text-gray-900">
                          {formatDate(event.start_date)}
                        </p>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#0066FF]/10 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-[#0066FF]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Waktu</p>
                        <p className="font-semibold text-gray-900">
                          {formatTime(event.start_date)} - {formatTime(event.end_date)} WIB
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-[#0066FF]/10 rounded-lg flex items-center justify-center">
                        {getLocationIcon(event.location_type)}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Lokasi</p>
                        <p className="font-semibold text-gray-900">
                          {getLocationText(event.location_type)}
                        </p>
                        {event.location_venue && (
                          <p className="text-sm text-gray-600 mt-1">{event.location_venue}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </FadeInSection>

                {/* Description */}
                <FadeInSection delay={0.4}>
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Tentang Event
                    </h2>
                    <div className="prose prose-lg max-w-none 
                      prose-headings:font-bold prose-headings:text-gray-900
                      prose-p:text-gray-700 prose-p:leading-relaxed
                      prose-ul:text-gray-700
                      prose-ol:text-gray-700
                      prose-li:text-gray-700
                    ">
                      <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </FadeInSection>
                {/* CTA Section */}
                {event.status === 'upcoming' && (
                  <FadeInSection delay={0.6}>
                    <div className="mt-8 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-2xl p-8 text-center">
                      <h3 className="text-2xl font-bold text-white mb-4">
                        Jangan Lewatkan Event Ini!
                      </h3>
                      <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                        Daftarkan diri Anda sekarang untuk mendapatkan tempat di event berkualitas ini
                      </p>
                      <Button
                        onClick={handleRegister}
                        size="lg"
                        className="bg-white text-[#0066FF] hover:bg-gray-100 px-8 shadow-xl hover:shadow-2xl transition-all"
                      >
                        <Users className="w-5 h-5 mr-2" />
                        Daftar Sekarang
                      </Button>
                    </div>
                  </FadeInSection>
                )}

                {/* Back to List */}
                <FadeInSection delay={0.7}>
                  <div className="mt-8">
                    <Link href="/resources/events">
                      <Button 
                        size="lg"
                        className="w-full sm:w-auto bg-[#0066FF] hover:bg-[#0052CC] text-white px-8 shadow-lg hover:shadow-xl transition-all"
                      >
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Lihat Event Lainnya
                      </Button>
                    </Link>
                  </div>
                </FadeInSection>
              </div>
            </article>
          </FadeInSection>
        </div>
      </main>

      <Footer />
    </>
  );
}