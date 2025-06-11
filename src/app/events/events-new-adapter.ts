// Adapter to transform events-new.json to the Event interface expected by EventsPage
import rawEvents from '@/data/events.json';

export interface Event {
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
  branding?: {
    colorTheme: string;
    fontStyle: string;
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
  sessions?: any[];
  registration?: {
    maxAttendees?: number;
    price?: number;
    [key: string]: any;
  };
}

function getStatus(event: any): string {
  const now = new Date();
  const start = new Date(event.startDate || event.start);
  const end = new Date(event.endDate || event.end);
  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'ongoing';
  return 'past';
}

export function adaptEvents(raw = rawEvents): Event[] {
  return raw.map((e: any) => {
    const event = e.event;
    const branding = e.branding || {};
    const visibility = branding.visibility || {};
    const reg = e.registration || {};
    const sessions = e.sessions || [];
    return {
      id: e.id,
      name: event.name,
      description: visibility.showDescription === false ? '' : event.description,
      sessions: e.sessions || [],
      registration: e.registration || {},
      date: {
        start: event.startDate || '',
        end: event.endDate || '',
      },
      location: {
        name: event.address || '',
        city: event.city || '',
        address: event.address || '',
        country: event.country || '',
      },
      status: getStatus(event),
      organizer: {
        name: reg.organizerName || 'Organizer',
        email: reg.organizerEmail || '',
        avatar: branding.logoUrl || '',
      },
      attendees: reg.maxAttendees || 0,
      category: event.eventType || 'Other',
      tags: sessions.length > 0 ? sessions.flatMap((s: any) => s.tags || []) : [],
      image: (branding.visibility?.showBanner !== false && branding.bannerUrl) ? branding.bannerUrl : (event.templateImage || event.templateImage || '/images/default.jpg'),
      branding: {
        colorTheme: branding.colorTheme || 'default',
        fontStyle: branding.fontStyle || 'default',
        visibility: {
          showLogo: visibility.showLogo !== false,
          showBanner: visibility.showBanner !== false,
          showDescription: visibility.showDescription !== false,
          showSchedule: visibility.showSchedule !== false,
          showSpeakers: visibility.showSpeakers !== false,
          showLocation: visibility.showLocation !== false,
          showRegistration: visibility.showRegistration !== false,
        },
        logoUrl: branding.logoUrl || '',
        bannerUrl: branding.bannerUrl || '',
      },
    };
  });
}
