// EventData schema and types for Event Dashboard

export type ColorTheme = 'professional' | 'ocean' | 'sunset' | 'forest';
export type FontStyle = 'modern' | 'classic' | 'minimal' | 'creative' | 'elegant';

export interface EventData {
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
    colorPalette?: {
      bgColor?: string;
      sidebarColor?: string;
      buttonColor?: string;
    };
    fontFamily?: string;
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
  };
  ticket: {
    id: string;
    name: string;
    type: 'free' | 'paid';
    price?: number;
    currency?: string;
  };
}

// Adapter to map backend event/branding to EventData interface
export function adaptEventDashboardFromDB(res: any): EventData {
  const e = res.event || {};
  const branding = e.branding_id || {};
  const palette = branding.branding_color_palette_id || {};
  const font = branding.branding_font_family_id || {};
  const visibility = branding.branding_visibility_id?.fields || {};
  const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL;
  return {
    event: {
      name: e.event_name || '',
      description: e.description || '',
      startDate: e.start_datetime || '',
      endDate: e.end_datetime || '',
      startTime: '', // not present, could parse from start_datetime if needed
      endTime: '', // not present, could parse from end_datetime if needed
      timezone: e.timezone || '',
      eventType: e.event_type || '',
      address: e.address || '',
      city: e.state || '',
      state: e.state || '',
      country: e.country || '',
      zipCode: e.zipcode || '',
      meetingLink: e.meeting_link || '',
    },
    branding: {
      colorTheme: palette.name || 'professional',
      fontStyle: font.name || 'modern',
      visibility: {
        showLogo: visibility.showLogo ?? true,
        showBanner: visibility.showBanner ?? true,
        showDescription: visibility.showDescription ?? true,
        showSchedule: visibility.showSchedule ?? true,
        showSpeakers: visibility.showSpeakers ?? true,
        showLocation: visibility.showLocation ?? true,
        showRegistration: visibility.showRegistration ?? true,
      },
      logoUrl: branding.branding_logo
        ? `${ASSETS_URL}${branding.branding_logo}`
        : "",
      bannerUrl: branding.branding_banner
        ? `${ASSETS_URL}${branding.branding_banner}`
        : "",
      colorPalette: palette.colors && Array.isArray(palette.colors) && palette.colors.length > 0 ? palette.colors[0] : {},
      fontFamily: font.font_family || '',
    },
    sessions: (e.sessions_id || []).map((s: any) => ({
      id: s._id,
      title: s.session_title,
      speaker: s.speaker_name,
      startTime: s.session_start_time,
      duration: s.duration,
      description: s.session_description,
      tags: s.tags || [],
    })),
    registration: {
      registrationOpen: e.registration_start_datetime || '',
      registrationClose: e.registration_end_datetime || '',
      updateDeadline: e.cancellation_deadline_datetime || '',
      maxAttendees: e.attendee_limit || 0,
    },
    ticket: {
      id: res.ticket._id,
      name: res.ticket.ticket_name,
      type: res.ticket.ticket_type,
      price: res.ticket.price,
      currency: res.ticket.currency,
    }
  };
}
