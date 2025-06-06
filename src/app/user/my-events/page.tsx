"use client";

import { useState } from 'react';
import { FiSearch, FiCalendar, FiMapPin, FiUsers, FiUser, FiChevronDown, FiGrid, FiList } from 'react-icons/fi';
import Link from 'next/link';
import eventsData from '@/data/user/events.json';
import DashboardLayout from '@/components/user/dashboard/DashboardLayout';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
type ViewMode = 'grid' | 'list';

interface Event {
  id: string;
  name: string;
  description: string;
  date: {
    start: string;
    end: string;
  };
  location: {
    name: string;
    city: string;
    address: string;
    country: string;
  };
  status: string;
  organizer: {
    name: string;
    email: string;
    avatar: string;
  };
  attendees: number;
  category: string;
  tags: string[];
  image: string;
}

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [dateFilter, setDateFilter] = useState('All Dates');
  const searchParams = useSearchParams();
  const urlFilter = searchParams.get('filter');
  const [statusFilter, setStatusFilter] = useState(
    urlFilter === 'past' ? 'completed' :
      urlFilter === 'upcoming' ? 'upcoming' :
        'All Status'
  );
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const isDateInRange = (eventDate: string, range: string): boolean => {
    const today = new Date();
    const eventDateObj = new Date(eventDate);
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    switch (range) {
      case 'Today':
        return eventDateObj >= startOfDay && eventDateObj <= endOfDay;
      case 'Tomorrow':
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return eventDateObj.getDate() === tomorrow.getDate() &&
          eventDateObj.getMonth() === tomorrow.getMonth() &&
          eventDateObj.getFullYear() === tomorrow.getFullYear();
      case 'This Week':
        return eventDateObj >= startOfWeek && eventDateObj <= endOfWeek;
      case 'This Month':
        return eventDateObj >= startOfMonth && eventDateObj <= endOfMonth;
      default:
        return true;
    }
  };

  // Get unique categories, locations for filters
  const categories = ['All Categories', ...new Set(eventsData.map((event: Event) => event.category))];
  const dates = ['All Dates', 'Today', 'Tomorrow', 'This Week', 'This Month'];
  const status = ['All Status', ...new Set(eventsData.map((event: Event) => event.status))];

  // Filter events based on search and filters
  const filteredEvents = eventsData.filter((event: Event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || event.category === categoryFilter;
    const matchesStatus = statusFilter === 'All Status' || event.status === statusFilter;

    // Simple date filtering (can be enhanced based on actual date comparison)
    const matchesDate = dateFilter === 'All Dates' || isDateInRange(event.date.start, dateFilter); // Implement actual date filtering

    return matchesSearch && matchesCategory && matchesStatus && matchesDate;
  });

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <DashboardLayout title="Events">
      <div className="container mx-auto px-4 py-2">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
            <p className="text-sm text-gray-600">Access all the events you've registered for — view details, update your registration, download badges, and stay informed.</p>
          </div>
          <div className="flex items-center gap-4">


            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-50`}
                aria-label="Grid view"
              >
                <FiGrid className={`w-4 h-4 ${viewMode === 'grid' ? 'text-gray-900' : 'text-gray-500'}`} />
              </button>
              <div className="h-5 w-px bg-gray-200"></div>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-50`}
                aria-label="List view"
              >
                <FiList className={`w-4 h-4 ${viewMode === 'list' ? 'text-gray-900' : 'text-gray-500'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-gray-700" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 text-gray-700 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-sm"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 w-full">
            <div className="relative">
              <select
                className="appearance-none w-full pl-3 pr-8 py-2 text-gray-700 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All Categories">All Categories</option>
                {categories.filter(cat => cat !== 'All Categories').map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FiChevronDown className="h-4 w-4 text-gray-700" />
              </div>
            </div>

            <div className="relative">
              <select
                className="appearance-none w-full pl-3 pr-8 py-2 text-gray-700 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All Status">All Status</option>
                {status.filter(cat => cat !== 'All Status').map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FiChevronDown className="h-4 w-4 text-gray-700" />
              </div>
            </div>

            <div className="relative">
              <select
                className="appearance-none w-full pl-3 pr-8 py-2 text-gray-700 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                {dates.map((date) => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FiChevronDown className="h-4 w-4 text-gray-700" />
              </div>
            </div>
          </div>

        </div>

        {/* Events Container */}
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'}>
          {filteredEvents.map((event: Event) => (
            viewMode === 'grid' ? (
              // Grid View Card
              <Link
                key={event.id}
                href={`/user/event-dashboard/${event.id}`}
                className="block bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <Image
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover"
                    width={48}
                    height={48}
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${event.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                      event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{event.name}</h3>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiCalendar className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>{formatDate(event.date.start)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiMapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>{event.location.name}, {event.location.city}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiUsers className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>{event.attendees.toLocaleString()} attendees</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                          {event.organizer.avatar ? (
                            <Image
                              src={event.organizer.avatar}
                              alt={event.organizer.name}
                              className="w-full h-full object-cover"
                              width={48}
                              height={48}
                            />
                          ) : (
                            <FiUser className="w-4 h-4 text-gray-500" />
                          )}
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-xs text-gray-500">Organized by</p>
                        <p className="text-sm font-medium text-gray-900">{event.organizer.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              // List View Row
              <Link
                key={event.id}
                href={`/event-overview/${event.id}`}
                className="block bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="md:w-1/4">
                    <div className="relative h-32 rounded-lg overflow-hidden">
                      <Image
                        src={event.image}
                        alt={event.name}
                        className="w-full h-full object-cover"
                        width={48}
                        height={48}
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${event.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                          event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{event.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <FiCalendar className="mr-2 h-4 w-4" />
                            <span>{formatDate(event.date.start)}</span>
                          </div>
                          <div className="flex items-center">
                            <FiMapPin className="mr-2 h-4 w-4" />
                            <span>{event.location.name}</span>
                          </div>
                          <div className="flex items-center">
                            <FiUsers className="mr-2 h-4 w-4" />
                            <span>{event.attendees.toLocaleString()} attendees</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                            {event.organizer.avatar ? (
                              <Image
                                src={event.organizer.avatar}
                                alt={event.organizer.name}
                                className="w-full h-full object-cover"
                                width={48}
                                height={48}
                              />
                            ) : (
                              <FiUser className="w-4 h-4 text-gray-500" />
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Organized by</p>
                          <p className="text-sm font-medium text-gray-900">{event.organizer.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          ))}
        </div>

        {/* No Results Message */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
