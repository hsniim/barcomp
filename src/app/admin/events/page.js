// app/admin/events/page.js
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar,
  MapPin, 
  Users,
  Clock,
  MoreHorizontal,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  TrendingUp,
  Loader2,
  Star,
  StarOff
} from 'lucide-react';
import { toast } from 'sonner';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/events', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      if (data.success) {
        setEvents(data.data || []);
      } else {
        toast.error(data.error || 'Failed to load events');
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Event deleted successfully');
        fetchEvents();
      } else {
        toast.error(data.error || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error('Failed to delete event');
    }
  };

  const toggleFeatured = async (id, currentFeatured) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ featured: !currentFeatured })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Event ${!currentFeatured ? 'featured' : 'unfeatured'}`);
        fetchEvents();
      } else {
        toast.error(data.error || 'Failed to update event');
      }
    } catch (error) {
      console.error('Failed to toggle featured:', error);
      toast.error('Failed to update event');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      upcoming: 'bg-blue-100 text-blue-700 border-blue-200',
      ongoing: 'bg-green-100 text-green-700 border-green-200',
      completed: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return styles[status] || styles.upcoming;
  };

  const getTypeBadge = (type) => {
    const styles = {
      workshop: 'bg-purple-100 text-purple-700 border-purple-200',
      seminar: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      webinar: 'bg-cyan-100 text-cyan-700 border-cyan-200'
    };
    return styles[type] || styles.workshop;
  };

  const getLocationTypeBadge = (locationType) => {
    const styles = {
      online: 'bg-green-100 text-green-700 border-green-200',
      onsite: 'bg-orange-100 text-orange-700 border-orange-200',
      hybrid: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    return styles[locationType] || styles.online;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Filter events based on search and filters
  const filteredEvents = events.filter(event => {
    const matchesSearch = search === '' || 
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.slug.toLowerCase().includes(search.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(search.toLowerCase()));
    
    const matchesStatus = statusFilter === '' || event.status === statusFilter;
    const matchesType = typeFilter === '' || event.event_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

  // Stats
  const stats = {
    total: events.length,
    upcoming: events.filter(e => e.status === 'upcoming').length,
    ongoing: events.filter(e => e.status === 'ongoing').length,
    completed: events.filter(e => e.status === 'completed').length,
    featured: events.filter(e => e.featured).length
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Events</h1>
          <p className="mt-1 text-base text-gray-600">Manage and organize your events</p>
        </div>
        <Link href="/admin/events/create">
          <Button className="flex items-center gap-2 bg-gradient-to-r from-[#0066FF] to-[#0052CC] hover:shadow-lg text-white transition-all duration-300">
            <Plus className="w-4 h-4" />
            New Event
          </Button>
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        {[
          { label: 'Total Events', value: stats.total, icon: CalendarDays, color: 'text-[#0066FF]', bg: 'bg-blue-50' },
          { label: 'Upcoming', value: stats.upcoming, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Ongoing', value: stats.ongoing, icon: Clock, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Completed', value: stats.completed, icon: Calendar, color: 'text-gray-600', bg: 'bg-gray-50' },
          { label: 'Featured', value: stats.featured, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' }
        ].map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="border-gray-200 hover:border-[#0066FF] hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-gray-900 tabular-nums">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200"
              >
                <option value="">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200"
              >
                <option value="">All Types</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="webinar">Webinar</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Events Table */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-[#0066FF] mx-auto" />
                  <p className="text-sm text-gray-600 font-medium">Loading events...</p>
                </div>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900">No events found</p>
                <p className="text-sm text-gray-500 mt-1">
                  {search || statusFilter || typeFilter ? 'Try adjusting your filters' : 'Create your first event to get started'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Featured
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedEvents.map((event, index) => (
                      <motion.tr 
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-blue-50/50 transition-colors duration-200 group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {event.cover_image_url ? (
                              <img
                                src={event.cover_image_url}
                                alt={event.title}
                                className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200 group-hover:border-[#0066FF] transition-colors duration-200"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center border-2 border-gray-200 group-hover:border-[#0066FF] transition-colors duration-200">
                                <Calendar className="w-7 h-7 text-[#0066FF]" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors duration-200 truncate">
                                {event.title}
                              </div>
                              <div className="text-xs text-gray-500 truncate mt-0.5">
                                {event.slug}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getTypeBadge(event.event_type)} capitalize`}>
                              {event.event_type || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="font-medium">{formatDate(event.start_date)}</div>
                              {event.start_date && (
                                <div className="text-xs text-gray-500">{formatTime(event.start_date)}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            <div className="min-w-0">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${getLocationTypeBadge(event.location_type)} capitalize mb-1`}>
                                {event.location_type || 'N/A'}
                              </span>
                              {event.location_type !== 'online' && event.location_venue && (
                                <div className="text-xs text-gray-600 truncate">{event.location_venue}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(event.status)} capitalize`}>
                            {event.status || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleFeatured(event.id, event.featured)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              event.featured
                                ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                            title={event.featured ? 'Unfeatured' : 'Set as featured'}
                          >
                            {event.featured ? (
                              <Star className="w-5 h-5 fill-current" />
                            ) : (
                              <StarOff className="w-5 h-5" />
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-9 w-9 p-0 hover:bg-blue-100 hover:text-[#0066FF] transition-colors duration-200"
                              >
                                <MoreHorizontal className="w-5 h-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem asChild>
                                <Link 
                                  href={`/admin/events/edit/${event.id}`}
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  <Edit className="w-4 h-4" />
                                  <span>Edit Event</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link 
                                  href={`/admin/events/${event.id}/registrations`}
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  <Users className="w-4 h-4" />
                                  <span>View Registrations</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(event.id, event.title)}
                                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                <span>Delete Event</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between"
        >
          <div className="text-sm text-gray-700 font-medium">
            Showing <span className="font-bold text-gray-900">{startIndex + 1}</span> to{' '}
            <span className="font-bold text-gray-900">
              {Math.min(startIndex + itemsPerPage, filteredEvents.length)}
            </span>{' '}
            of <span className="font-bold text-gray-900">{filteredEvents.length}</span> events
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 border-gray-300 hover:border-[#0066FF] hover:bg-blue-50 hover:text-[#0066FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 border-gray-300 hover:border-[#0066FF] hover:bg-blue-50 hover:text-[#0066FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}