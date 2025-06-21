// Adapter to transform backend registeredEvents to the Event interface expected by EventsPage

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

/**
 * Adapts registeredEvents from backend to Event[] for EventsPage
 */
export function adaptEventsFromDB(registeredEvents: any[]): Event[] {
  console.log('[ADAPTER] Raw registeredEvents from backend:', registeredEvents);
  return registeredEvents.map((e: any) => {
    return {
      id: e._id || '',
      name: e.event_name || '',
      description: e.description || '',
      sessions: [], // Not present in backend, add if needed
      registration: {}, // Not present in backend, add if needed
      date: {
        start: e.start_datetime || '',
        end: e.end_datetime || '',
      },
      location: {
        name: e.address || '',
        city: e.state || '',
        address: e.address || '',
        country: e.country || '',
      },
      status: (() => {
        const now = new Date();
        const start = new Date(e.start_datetime);
        const end = new Date(e.end_datetime);
        if (now < start) return 'upcoming';
        if (now >= start && now <= end) return 'ongoing';
        return 'past';
      })(),
      organizer: {
        name: '', // Not present, add if needed
        email: '',
        avatar: e.branding_id?.branding_logo || e.branding_id?.branding_banner ||'',
      },
      attendees: e.attendee_limit || 0,
      category: e.event_type || 'Other',
      tags: [],
      // Use banner as main event image if available, fallback to logo or empty string
      image: e.branding_id?.branding_banner || e.branding_id?.branding_logo || '',
      branding: e.branding_id ? {
        colorTheme: e.branding_id.branding_color_palette_id?.name || 'default',
        fontStyle: e.branding_id.branding_font_family_id?.font_family || 'default',
        visibility: {
          showLogo: e.branding_id.branding_visibility_id?.fields?.showLogo !== false,
          showBanner: e.branding_id.branding_visibility_id?.fields?.showBanner !== false,
          showDescription: e.branding_id.branding_visibility_id?.fields?.showDescription !== false,
          showSchedule: e.branding_id.branding_visibility_id?.fields?.showSchedule !== false,
          showSpeakers: e.branding_id.branding_visibility_id?.fields?.showSpeakers !== false,
          showLocation: e.branding_id.branding_visibility_id?.fields?.showLocation !== false,
          showRegistration: e.branding_id.branding_visibility_id?.fields?.showRegistration !== false,
        },
        logoUrl: e.branding_id.branding_logo || '',
        bannerUrl: e.branding_id.branding_banner || '',
      } : undefined,
    };
  });
}
