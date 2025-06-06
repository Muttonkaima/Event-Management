'use client';

import { useEffect, useState } from 'react';
import { FiCalendar, FiClock, FiMapPin, FiMessageSquare, FiUsers, FiArrowUpRight } from 'react-icons/fi';
import { format, parseISO, isToday } from 'date-fns';
import Link from 'next/link';
import DashboardLayout from '@/components/user/dashboard/DashboardLayout';

// Import data
import eventsData from '@/data/user/events.json';
import announcementsData from '@/data/user/announcements.json';

// Types
type Event = {
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
    country: string;
  };
  status: string;
  image?: string;
};

type Announcement = {
  id: string;
  eventId: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  isPinned: boolean;
};

export default function DashboardPage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Array<Announcement & { eventName: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchData = () => {
      try {
        // Process announcements to include event names
        const processedAnnouncements = announcementsData.map(announcement => {
          const event = eventsData.find(e => e.id === announcement.eventId);
          return {
            ...announcement,
            eventName: event?.name || 'Event'
          };
        });

        // Filter events based on status
        const upcoming = eventsData.filter(event => event.status === 'upcoming');
        const past = eventsData.filter(event => event.status === 'completed');

        setUpcomingEvents(upcoming as Event[]);
        setPastEvents(past as Event[]);
        setAnnouncements(processedAnnouncements);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM d, yyyy');
  };

  const formatTime = (dateString: string) => {
    return format(parseISO(dateString), 'h:mm a');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, User! 👋</h1>
        <p className="mt-2 text-sm md:text-base text-gray-600">Here's what's happening with your events.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Total Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <FiCalendar className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Events</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {upcomingEvents.length + pastEvents.length}
              </p>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-50 text-green-600">
              <FiCalendar className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Upcoming</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {upcomingEvents.length}
              </p>
            </div>
          </div>
        </div>

        {/* Past Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
              <FiCalendar className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Past Events</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {pastEvents.length}
              </p>
            </div>
          </div>
        </div>

        {/* New Announcements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
              <FiMessageSquare className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">New Announcements</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {announcements.filter(a => isToday(parseISO(a.createdAt))).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FiCalendar className="mr-2 text-blue-600" />
                  Upcoming Events
                </h2>
                <Link href="/user/my-events?filter=upcoming" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center">
                  View all
                  <FiArrowUpRight className="ml-1" />
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.slice(0, 3).map((event) => (
                  <Link 
                    key={event.id} 
                    href={`/user/event-dashboard/${event.id}`}
                    className="block p-6 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex items-start">
                      {event.image && (
                        <div className="flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden">
                          <img className="h-full w-full object-cover" src={event.image} alt={event.name} />
                        </div>
                      )}
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-medium text-gray-900">{event.name}</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {event.status}
                          </span>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center text-sm text-gray-500">
                          <div className="flex items-center mr-4">
                            <FiCalendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span>{formatDate(event.date.start)}</span>
                          </div>
                          <div className="flex items-center">
                            <FiClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span>{formatTime(event.date.start)} - {formatTime(event.date.end)}</span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <FiMapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span className="truncate">{event.location.name}, {event.location.city}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">No upcoming events found.</div>
              )}
            </div>
          </div>

          {/* Past Events */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FiCalendar className="mr-2 text-amber-600" />
                  Past Events
                </h2>
                <Link href="/user/my-events?filter=past" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center">
                  View all
                  <FiArrowUpRight className="ml-1" />
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {pastEvents.length > 0 ? (
                pastEvents.slice(0, 3).map((event) => (
                  <Link 
                    key={event.id} 
                    href={`/user/event-dashboard/${event.id}`}
                    className="block p-6 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex items-start">
                      {event.image && (
                        <div className="flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden">
                          <img className="h-full w-full object-cover" src={event.image} alt={event.name} />
                        </div>
                      )}
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-medium text-gray-900">{event.name}</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {event.status}
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          <span>{formatDate(event.date.start)}</span>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <FiMapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span className="truncate">{event.location.name}, {event.location.city}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">No past events found.</div>
              )}
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <FiMessageSquare className="mr-2 text-purple-600" />
                Latest Announcements
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {announcements.length > 0 ? (
                announcements.slice(0, 5).map((announcement) => (
                  <div key={announcement.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 mt-1 h-2 w-2 rounded-full ${
                        announcement.isPinned ? 'bg-yellow-400' : 'bg-blue-500'
                      }`}></div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">{announcement.title}</h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                            {format(parseISO(announcement.createdAt), 'MMM d')}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{announcement.content}</p>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {announcement.eventName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">No announcements found.</div>
              )}
            </div>
            {announcements.length > 5 && (
              <div className="px-6 py-3 bg-gray-50 text-right">
                <Link href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  View all announcements
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
