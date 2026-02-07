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
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  useEffect(() => {
    fetchEvents();
  }, [pagination.page, statusFilter, typeFilter]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: '10',
        ...(statusFilter && { status: statusFilter }),
        ...(typeFilter && { event_type: typeFilter }),
        ...(search && { search }),
      });

      const response = await fetch(`/api/events?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setEvents(data.events);
        setPagination(data.pagination);
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
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
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

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchEvents();
  };

  const getStatusBadge = (status) => {
    const styles = {
      upcoming: 'bg-blue-100 text-blue-700 border-blue-200',
      ongoing: 'bg-green-100 text-green-700 border-green-200',
      completed: 'bg-gray-100 text-gray-700 border-gray-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200'
    };
    return styles[status] || styles.upcoming;
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
          <Button className="flex items-center gap-2 bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-lg transition-all duration-300">
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
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { label: 'Total Events', value: pagination.total || 0, icon: CalendarDays, color: 'text-[#0066FF]', bg: 'bg-blue-50' },
          { label: 'Upcoming', value: events.filter(e => e.status === 'upcoming').length, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Ongoing', value: events.filter(e => e.status === 'ongoing').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Total Registrations', value: events.reduce((sum, e) => sum + (e.registered_count || 0), 0), icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' }
        ].map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="border-gray-200 hover:border-[#0066FF] hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{stat.label}</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-11 h-11 ${stat.bg} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-gray-200 shadow-md">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-200"
                  />
                </div>
              </form>

              {/* Filter by Status */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-300 hover:border-[#0066FF] hover:bg-blue-50 transition-all duration-200"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {statusFilter ? statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1) : 'All Status'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40">
                  <DropdownMenuItem onClick={() => setStatusFilter('')}>
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter('upcoming')}>
                    Upcoming
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('ongoing')}>
                    Ongoing
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                    Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('cancelled')}>
                    Cancelled
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Filter by Type */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-300 hover:border-[#0066FF] hover:bg-blue-50 transition-all duration-200"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    {typeFilter ? typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1) : 'All Types'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40">
                  <DropdownMenuItem onClick={() => setTypeFilter('')}>
                    All Types
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setTypeFilter('workshop')}>
                    Workshop
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter('seminar')}>
                    Seminar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter('webinar')}>
                    Webinar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter('conference')}>
                    Conference
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter('training')}>
                    Training
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
        <Card className="border-gray-200 shadow-md overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#0066FF]"></div>
                <p className="mt-4 text-sm text-gray-600 font-medium">Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Events Found</h3>
                <p className="text-gray-600 mb-6">
                  {search || statusFilter || typeFilter
                    ? "Try adjusting your search or filter criteria" 
                    : "Get started by creating your first event"}
                </p>
                <Link href="/admin/events/create">
                  <Button className="bg-[#0066FF] hover:bg-[#0052CC]">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-200">
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
                        Registrations
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {events.map((event, index) => (
                      <motion.tr 
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-blue-50/50 transition-colors duration-200 group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {event.cover_image ? (
                              <img
                                src={event.cover_image}
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
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 capitalize">
                            {event.event_type || 'N/A'}
                          </span>
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
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="font-medium truncate">
                                {event.location_type === 'online' 
                                  ? 'Online Event' 
                                  : event.location_venue || 'TBA'}
                              </div>
                              {event.location_city && event.location_type !== 'online' && (
                                <div className="text-xs text-gray-500 truncate">{event.location_city}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn(
                            "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border",
                            getStatusBadge(event.status)
                          )}>
                            {event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>
                              {event.registered_count || 0}
                              {event.capacity && (
                                <span className="text-gray-500 font-normal"> / {event.capacity}</span>
                              )}
                            </span>
                          </div>
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
                                  href={`/events/${event.slug || event.id}`}
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span>View Event</span>
                                </Link>
                              </DropdownMenuItem>
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
      {pagination.totalPages > 1 && (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between"
        >
          <div className="text-sm text-gray-700 font-medium">
            Showing page <span className="font-bold text-gray-900">{pagination.page}</span> of{' '}
            <span className="font-bold text-gray-900">{pagination.totalPages}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              className="flex items-center gap-2 border-gray-300 hover:border-[#0066FF] hover:text-[#0066FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page === pagination.totalPages}
              className="flex items-center gap-2 border-gray-300 hover:border-[#0066FF] hover:text-[#0066FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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