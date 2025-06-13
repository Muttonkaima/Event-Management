'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format, parseISO, isBefore, isAfter } from 'date-fns';
import DashboardLayout from '@/components/user/event-dashboard/DashboardLayout';
import eventDataJson from '@/data/user/detailEvents.json';
import TicketModal from '@/components/user/event-dashboard/TicketModal';
import announcements from '@/data/user/eventAnnouncements.json'

type ColorTheme = 'professional' | 'ocean' | 'sunset' | 'forest';
type FontStyle = 'modern' | 'classic' | 'minimal' | 'creative' | 'elegant';

interface EventData {
  event: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    timezone: string;
    eventType: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    meetingLink: string;
  };
  branding: {
    colorTheme: ColorTheme;
    fontStyle: FontStyle;
    visibility: {
      showLogo: boolean;
      showBanner: boolean;
      showDescription: boolean;
      showSchedule: boolean;
      showSpeakers: boolean;
      showLocation: boolean;
      showRegistration: boolean;
    };
    logoUrl?: string;
   bannerUrl?: string;
  };
  sessions: Array<{
    id: number;
    title: string;
    speaker: string;
    startTime: string;
    duration: number;
    description: string;
    tags: string[];
  }>;
  registration: {
    registrationOpen: string;
    registrationClose: string;
    updateDeadline: string;
    maxAttendees: number;
    tickets: Array<{
      id: string;
      name: string;
      type: 'free' | 'paid';
      price?: number;
      currency?: string;
    }>;
  };
}

const colorThemes = [
  {
    id: 'professional' as ColorTheme,
    name: 'Professional',
    colors: ['bg-indigo-500', 'bg-indigo-300', 'bg-gray-600']
  },
  {
    id: 'ocean' as ColorTheme,
    name: 'Ocean Blue',
    colors: ['bg-cyan-500', 'bg-blue-400', 'bg-teal-600']
  },
  {
    id: 'sunset' as ColorTheme,
    name: 'Sunset',
    colors: ['bg-orange-500', 'bg-red-400', 'bg-yellow-500']
  },
  {
    id: 'forest' as ColorTheme,
    name: 'Forest',
    colors: ['bg-green-600', 'bg-emerald-400', 'bg-lime-500']
  }
];

const fontStyles = [
  {
    id: 'modern' as FontStyle,
    name: 'Modern Sans',
    description: 'Clean and professional for modern events',
    className: 'font-sans'
  },
  {
    id: 'classic' as FontStyle,
    name: 'Classic Serif',
    description: 'Traditional and elegant for formal events',
    className: 'font-serif'
  },
  {
    id: 'minimal' as FontStyle,
    name: 'Minimal',
    description: 'Light and airy for minimalist designs',
    className: 'font-light tracking-wide'
  },
  {
    id: 'creative' as FontStyle,
    name: 'Creative',
    description: 'Fun and unique for creative events',
    className: 'font-mono'
  },
  {
    id: 'elegant' as FontStyle,
    name: 'Elegant',
    description: 'Sophisticated for premium events',
    className: 'font-serif font-light'
  }
];

export default function Dashboard() {
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [eventData, setEventData] = useState<EventData | null>(
    (eventDataJson as EventData[])[0] || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userRegistration, setUserRegistration] = useState(() => {
    const registration: any = eventData?.registration || {};
    return {
      isRegistered: registration.isRegistered ?? false,
      tickets: registration.tickets ?? [],
      checkInStatus: registration.checkInStatus ?? false,
    };
  });


  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }


  if (!eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No event data found</h1>
        </div>
      </div>
    );
  }

  const { event, branding, sessions, registration } = eventData;
  const selectedTheme = colorThemes.find(theme => theme.id === branding.colorTheme) || colorThemes[0];
  const selectedFont = fontStyles.find(font => font.id === branding.fontStyle) || fontStyles[0];

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMMM d, yyyy');
  };

  const formatTime = (timeString: string) => {
    return format(new Date(`2000-01-01T${timeString}`), 'h:mm a');
  };

  const isRegistrationOpen = () => {
    const now = new Date();
    const openDate = new Date(registration.registrationOpen);
    const closeDate = new Date(registration.registrationClose);
    return isAfter(now, openDate) && isBefore(now, closeDate);
  };

  return (
    <DashboardLayout title="Dashboard">
      <div className={`min-h-screen ${selectedFont.className} bg-gray-50`}>
        {/* Header with Banner */}
        <header className="relative">
          {branding.bannerUrl && branding.visibility.showBanner ? (
            <div className="h-64 md:h-96 w-full overflow-hidden rounded-2xl">
              <Image
                src={branding.bannerUrl}
                alt={`${event.name} Banner`}
                width={1920}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          ) : (
            <div className={`h-64 md:h-96 w-full ${selectedTheme.colors[0]} flex items-center justify-center`}>
              <h1 className="text-4xl md:text-6xl font-bold text-white text-center px-4">{event.name}</h1>
            </div>
          )}

          {branding.visibility.showLogo && branding.logoUrl && (
            <div className="absolute -bottom-16 left-8 w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
              <Image
                src={branding.logoUrl}
                alt={`${event.name} Logo`}
                width={160}
                height={160}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </header>

        <main className="container mx-auto px-4 md:px-6 py-12 mt-20 md:mt-24">
          {/* Event Info Section */}
          <section className="mb-16">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3">
                <div className="flex items-center mb-4">
                  <span className={`inline-block w-3 h-3 ${selectedTheme.colors[0]} rounded-full mr-2`}></span>
                  <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                    {event.eventType}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{event.name}</h1>

                {branding.visibility.showDescription && (
                  <p className="text-lg text-gray-600 mb-6">{event.description}</p>
                )}

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700">
                      {formatDate(event.startDate)}{event.endDate && ` - ${formatDate(event.endDate)}`}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">
                      {formatTime(event.startTime)} - {formatTime(event.endTime)} ({event.timezone})
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center px-4 py-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        You're registered for this event!
                      </p>
                    </div>
                  </div>
                  {userRegistration.tickets && userRegistration.tickets.length ===1 && (
                  <button
                    className={`${selectedTheme.colors[0]} text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity flex items-center cursor-pointer`}
                    onClick={() => setTicketModalOpen(userRegistration.tickets[0].id)}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Ticket
                  </button>
                  )}
                </div>

              </div>

              <div className="md:w-1/3 bg-white rounded-xl shadow-md overflow-hidden">
                <div className={`${selectedTheme.colors[0]} text-white p-4`}>
                  <h3 className="text-lg font-semibold">Event Details</h3>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-1">Date & Time</h4>
                    <p className="text-gray-600">
                      {formatDate(event.startDate)}{event.endDate && ` - ${formatDate(event.endDate)}`}
                      <br />
                      {formatTime(event.startTime)} - {formatTime(event.endTime)} ({event.timezone})
                    </p>
                  </div>

                  {branding.visibility.showLocation && event.eventType === 'physical' && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-1">Location</h4>
                      <p className="text-gray-600">
                        {event.address}<br />
                        {event.city}, {event.state}<br />
                        {event.country} {event.zipCode}
                      </p>
                      <button className="mt-2 text-sm text-blue-600 hover:underline cursor-pointer">
                        View on map
                      </button>
                    </div>
                  )}

                  {event.eventType === 'online' && event.meetingLink && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-1">Join Online</h4>
                      <a
                        href={event.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {event.meetingLink}
                      </a>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-2">Share this event</h4>
                    <div className="flex space-x-3">
                      {['facebook', 'twitter', 'linkedin', 'link'].map((social) => (
                        <button
                          key={social}
                          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                          aria-label={`Share on ${social}`}
                        >
                          <span className="sr-only">{social}</span>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sessions Section */}
          {branding.visibility.showSchedule && sessions.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center mb-8">
                <div className={`w-1 h-8 ${selectedTheme.colors[0]} mr-3`}></div>
                <h2 className="text-2xl font-bold text-gray-900">Event Schedule</h2>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {sessions.map((session: { id: number; title: string; speaker: string; startTime: string; duration: number; description: string; tags: string[]; }, index: number) => (
                    <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center">
                        <div className="md:w-1/4 mb-4 md:mb-0">
                          <div className="text-lg font-medium text-gray-900">
                            {formatTime(session.startTime)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {session.duration} min
                          </div>
                        </div>
                        <div className="md:w-3/4">
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{session.title}</h3>
                          <p className="text-gray-600 mb-2">{session.description}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {session.speaker}
                          </div>
                          {session.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {session.tags.map((tag: string) => (
                                <span
                                  key={tag}
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${selectedTheme.colors[2]} bg-opacity-20 text-${selectedTheme.colors[0].replace('bg-', '')}`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Announcements Section */}
          <section className="mb-16">
            <div className="flex items-center mb-8">
              <div className={`w-1 h-8 ${selectedTheme.colors[0]} mr-3`}></div>
              <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="divide-y divide-gray-200">
              {announcements
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by latest date
  .slice(0, 3) // Take only the latest 3
  .map((announcement) => (
    <div key={announcement.id} className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex">
        {announcement.isImportant && (
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        <div className="ml-3">
          <div className="flex items-center">
            <h3 className={`text-lg font-medium ${announcement.isImportant ? 'text-yellow-800' : 'text-gray-900'}`}>
              {announcement.title}
            </h3>
            <span className="ml-2 text-sm text-gray-500">
              {format(parseISO(announcement.date), 'MMM d, yyyy')}
            </span>
          </div>
          <p className="mt-1 text-gray-600">{announcement.content}</p>
        </div>
      </div>
    </div>
))}

              </div>
            </div>
          </section>

          {/* Registration Section */}
          {branding.visibility.showRegistration && registration && (
            <section className="mb-16">
              <div className="flex items-center mb-8">
                <div className={`w-1 h-8 ${selectedTheme.colors[0]} mr-3`}></div>
                <h2 className="text-2xl font-bold text-gray-900">Registration</h2>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Registration Status</h3>
                    {isRegistrationOpen() ? (
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-gray-700">Registration is open</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-gray-700">
                          Registration {new Date() < new Date(registration.registrationOpen) ? 'opens soon' : 'is closed'}
                        </span>
                      </div>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      {isRegistrationOpen()
                        ? `Closes on ${formatDate(registration.registrationClose)} at ${formatTime(new Date(registration.registrationClose).toTimeString().substring(0, 5))}`
                        : `Closed on ${formatDate(registration.registrationClose)} at ${formatTime(new Date(registration.registrationClose).toTimeString().substring(0, 5))}`}
                    </p>
                  </div>

                  {/* {registration.maxAttendees > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Capacity</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${selectedTheme.colors[0]}`} 
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {Math.round(registration.maxAttendees * 0.75)} of {registration.maxAttendees} spots remaining
                    </p>
                  </div>
                )} */}

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Your Tickets</h3>
                    {userRegistration.tickets && userRegistration.tickets.length > 0 ? (
                      userRegistration.tickets.map((ticket: any, idx: number) => (
                        <div key={ticket.id || idx} className="border rounded-lg overflow-hidden bg-white shadow-sm mb-6">
                          <div className={`${selectedTheme.colors[0]} p-4 text-white`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-lg font-bold">{ticket.name} Ticket</h4>
                                <p className="text-sm opacity-90">
                                  {ticket.type === 'paid'
                                    ? `Paid: ${ticket.currency} ${ticket.price}`
                                    : 'Free Admission'}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-xs opacity-80">Order #{ticket.id}</div>
                                <div className="text-xs opacity-80 mt-1">
                                  {ticket.purchaseDate ? format(parseISO(ticket.purchaseDate), 'MMM d, yyyy') : ''}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <p className="text-sm text-gray-500">Event</p>
                                <p className="font-medium text-gray-700">{event.name}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-500">Date</p>
                                <p className='text-gray-700'>{formatDate(event.startDate)}</p>
                              </div>
                            </div>
                            <div className="border-t border-gray-200 pt-4">
                              <p className="text-sm text-gray-500 mb-2">Check-in Status</p>
                              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${userRegistration.checkInStatus
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                <span className={`w-2 h-2 rounded-full mr-2 ${userRegistration.checkInStatus ? 'bg-green-500' : 'bg-yellow-500'
                                  }`}></span>
                                {userRegistration.checkInStatus ? 'Checked In' : 'Not Checked In'}
                              </div>
                            </div>
                            <div className="flex justify-end mt-4">
                              <button
                                className={`${selectedTheme.colors[0]} text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity flex items-center cursor-pointer`}
                                onClick={() => setTicketModalOpen(ticket.id)}
                              >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                View Ticket
                              </button>
                            </div>
                          </div>
                          <div className="border-t border-gray-200 p-4 bg-gray-50">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Need help? <a href="#" className="text-blue-600 hover:underline">Contact support</a></span>
                            </div>
                          </div>
                          <TicketModal
                            open={ticketModalOpen === ticket.id}
                            onOpenChange={() => setTicketModalOpen(false)}
                            event={event}
                            ticket={ticket}
                            user={userRegistration}
                            colorTheme={selectedTheme}
                            fontStyle={selectedFont}
                            logoUrl={branding.logoUrl}
                           bannerUrl={branding.bannerUrl}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500">No tickets found.</div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>

        {/* Footer */}

      </div>
    </DashboardLayout>
  );
}
