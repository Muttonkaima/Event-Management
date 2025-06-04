import { useEventWizard } from '@/contexts/EventWizardContext';
import { Eye, Calendar, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { FullPreviewModal } from './FullPreviewModal';
import Image from 'next/image';

const getThemeGradient = (colorTheme: string) => {
  switch (colorTheme) {
    case 'professional':
      return 'from-indigo-900 to-purple-300';
    case 'ocean':
      return 'from-cyan-900 to-blue-300';
    case 'sunset':
      return 'from-orange-900 to-red-300';
    case 'forest':
      return 'from-green-900 to-emerald-300';
    default:
      return 'from-indigo-500 to-purple-600';
  }
};

const getSidebarGradient = (colorTheme: string) => {
  switch (colorTheme) {
    case 'professional':
      return 'bg-indigo-900';
    case 'ocean':
      return 'bg-blue-900';
    case 'sunset':
      return 'bg-red-900';
    case 'forest':
      return 'bg-emerald-900';
    default:
      return 'bg-indigo-900';
  }
};

const getFontStyle = (fontStyle: string) => {
  switch (fontStyle) {
    case 'modern':
      return 'font-sans';
    case 'classic':
      return 'font-serif';
    case 'minimal':
      return 'font-light tracking-wide';
    case 'creative':
      return 'font-mono';
    case 'elegant':
      return 'font-serif font-light';
    default:
      return 'font-sans';
  }
};

const formatDateTime = (startDate: string, endDate: string, startTime: string, endTime: string) => {
  if (!startDate || !endDate) {
    return 'June 14, 2025 9:00 AM - June 19, 2025 5:00 PM';
  }

  const start = new Date(`${startDate}T${startTime || '09:00'}`);
  const end = new Date(`${endDate}T${endTime || '17:00'}`);

  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  };

  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
};

const getLocationText = (event: any) => {
  if (event.eventType === 'virtual') {
    return event.meetingLink || 'Virtual Event - Meeting link will be provided';
  }
  
  if (event.eventType === 'hybrid') {
    const parts = [];
    if (event.address) parts.push(event.address);
    if (event.city) parts.push(event.city);
    if (event.state) parts.push(event.state);
    if (event.country) parts.push(event.country);
    const location = parts.join(', ') || 'Physical location';
    const meeting = event.meetingLink || 'Meeting link will be provided';
    return `${location} + Virtual: ${meeting}`;
  }
  
  if (event.eventType === 'in-person' && (event.address || event.city)) {
    const parts = [];
    if (event.address) parts.push(event.address);
    if (event.city) parts.push(event.city);
    if (event.state) parts.push(event.state);
    if (event.country) parts.push(event.country);
    return parts.join(', ');
  }
  
  return 'Event location will appear here';
};

export function LivePreview() {
  const { state } = useEventWizard();
  const { template, event, branding, sessions } = state;
  const [showFullPreview, setShowFullPreview] = useState(false);

  const themeGradient = getThemeGradient(branding.colorTheme);
  const sidebarGradient = getSidebarGradient(branding.colorTheme);
  const fontClass = getFontStyle(branding.fontStyle);
  const dateTimeText = formatDateTime(event.startDate, event.endDate, event.startTime, event.endTime);
  const locationText = getLocationText(event);

  return (
    <div className="sticky top-8">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Preview Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFullPreview(true)}
              className="text-gray-900 bg-transparent hover:bg-gray-50 border border-gray-200  cursor-pointer"
            >
              <Eye className="mr-2 w-4 h-4" />
              Preview Full Event
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="relative">
          {/* Event Preview Card */}
          <div className={`text-white overflow-hidden shadow-lg ${fontClass}`}>
            {/* Banner Image */}
            <div className="relative w-full h-48 overflow-hidden">
              <img 
                src={event.templateImage} 
                alt={event.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = 'https://placehold.co/800x400/2563eb/ffffff?text=Event+Banner';
                }}
              />
             
                <div className="absolute top-4 left-4 border border-gray-200 p-0 rounded-md shadow-md z-20">
                  <img 
                    src="/images/image5.avif"
                    alt="Event Logo" 
                    className="h-12 w-auto object-contain rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      console.error('Failed to load logo:', target.src);
                      target.onerror = null;
                      target.style.border = '1px solid red'; // Visual indicator for debugging
                      target.style.padding = '4px';
                      target.style.backgroundColor = '#ffebee';
                      // Keep the element visible for debugging
                    }}
                    onLoad={() => console.log('Logo loaded successfully')}
                    style={{
                      minWidth: '32px',
                      minHeight: '32px'
                    }}
                  />
                </div>
            </div>
            
            {/* Content */}
            <div className={`p-6 bg-gradient-to-r ${themeGradient}`}>
              {/* Logo */}
              {branding.visibility.showLogo && branding.logoUrl && (
                <div className="mb-4">
                  <img 
                    src={branding.logoUrl} 
                    alt="Event Logo" 
                    className="h-12 w-auto object-contain"
                  />
                </div>
              )}
              
              <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">
                  {event.name || 'Your Event Name'}
                </h2>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{dateTimeText}</span>
                  </div>
                  <span className="bg-primary px-2 py-1 rounded text-xs font-medium">
                    {event.eventType === 'in-person' ? 'In-person' : 
                     event.eventType === 'virtual' ? 'Virtual' : 'Hybrid'}
                  </span>
                </div>
              </div>

              {branding.visibility.showDescription && (
                <div className="mb-4">
                  <p className="text-sm opacity-90">
                    {event.description || 'Your event description will appear here. Add details about what attendees can expect.'}
                  </p>
                </div>
              )}

              {branding.visibility.showLocation && (
                <div className="mb-4">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-primary mt-1" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm opacity-75">{locationText}</p>
                    </div>
                  </div>
                </div>
              )}

              {branding.visibility.showSchedule && sessions.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Clock className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium">Schedule</p>
                  </div>
                  <div className="space-y-2">
                    {sessions.slice(0, 3).map((session: any, index: any) => (
                      <div key={index} className="text-sm opacity-75">
                        <div className="font-medium">{session.title}</div>
                        <div>{session.speaker} • {session.startTime} ({session.duration}min)</div>
                      </div>
                    ))}
                    {sessions.length > 3 && (
                      <div className="text-sm opacity-75">
                        +{sessions.length - 3} more sessions
                      </div>
                    )}
                  </div>
                </div>
              )}

              {branding.visibility.showRegistration && (
                <button className={`w-full ${sidebarGradient} text-white py-3 rounded-lg font-medium transition-colors`}>
                  Register Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <FullPreviewModal
        open={showFullPreview}
        onClose={() => setShowFullPreview(false)}
      />
    </div>
  );
}
