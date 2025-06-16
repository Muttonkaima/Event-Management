// Adapter to map backend DB event structure to the Event interface expected by the EventsPage
import { Event } from './events';

function getStatus(start: string, end: string): string {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (now < startDate) return 'upcoming';
  if (now >= startDate && now <= endDate) return 'ongoing';
  return 'past';
}

export function adaptEventsFromDB(raw: any[]): Event[] {
  return raw.map((e: any, idx: number) => {
    console.log('DB event', idx, e);
    const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL || '';
    const branding = e.branding_id || {};
    const visibility = branding.branding_visibility_id?.fields || {};
    return {
      id: e._id,
      name: e.event_name,
      description: visibility.showDescription === false ? '' : e.description,
      sessions: [], // You can fetch and adapt sessions if needed
      registration: {
        maxAttendees: e.attendee_limit,
        // Add more fields as needed
      },
      date: {
        start: e.start_datetime,
        end: e.end_datetime,
      },
      location: {
        name: e.address,
        city: e.state,
        address: e.address,
        country: e.country,
      },
      status: getStatus(e.start_datetime, e.end_datetime),
      organizer: {
        name: 'Organizer', // Placeholder, update if organizer info available
        email: '',
        avatar: `${ASSETS_URL}${branding.branding_logo}` || `${ASSETS_URL}${branding.branding_banner}` || '',
      },
      attendees: e.attendee_limit || 0,
      category: e.event_type || 'Other',
      tags: [], // You can map tags if available
      image :
      visibility?.showBanner !== false && branding?.branding_banner? `${ASSETS_URL}${branding.branding_banner}`
        : '/images/default.jpg',
      branding: {
        colorTheme: branding.branding_color_palette_id || 'default',
        fontStyle: branding.branding_font_family_id || 'default',
        visibility: {
          showLogo: visibility.showLogo !== false,
          showBanner: visibility.showBanner !== false,
          showDescription: visibility.showDescription !== false,
          showSchedule: visibility.showSchedule !== false,
          showSpeakers: visibility.showSpeakers !== false,
          showLocation: visibility.showLocation !== false,
          showRegistration: visibility.showRegistration !== false,
        },
        logoUrl: branding.branding_logo ? `${ASSETS_URL}${branding.branding_logo}` : '',
        bannerUrl: branding.branding_banner ? `${ASSETS_URL}${branding.branding_banner}` : '',
      },
    };
  });
}
