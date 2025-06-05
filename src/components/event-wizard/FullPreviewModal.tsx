import { useEventWizard } from '@/contexts/EventWizardContext';
import { X, Calendar, MapPin, Users, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Image from 'next/image';

interface FullPreviewModalProps {
  open: boolean;
  onClose: () => void;
}

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
      return 'bg-indigo-300';
  }
};

const getButtonGradient = (colorTheme: string) => {
  switch (colorTheme) {
    case 'professional':
      return 'bg-gray-600';
    case 'ocean':
      return 'bg-teal-600';
    case 'sunset':
      return 'bg-yellow-500';
    case 'forest':
      return 'bg-lime-500';
    default:
      return 'bg-indigo-300';
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
    return event.meetingLink || 'Virtual Event - Meeting link will be provided upon registration';
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

export function FullPreviewModal({ open, onClose }: FullPreviewModalProps) {
  const { state } = useEventWizard();
  const { template, event, branding, sessions, registration } = state;

  const themeGradient = getThemeGradient(branding.colorTheme);
  const sidebarGradient = getSidebarGradient(branding.colorTheme);
  const buttonGradient = getButtonGradient(branding.colorTheme);
  const fontClass = getFontStyle(branding.fontStyle);
  const dateTimeText = formatDateTime(event.startDate, event.endDate, event.startTime, event.endTime);
  const locationText = getLocationText(event);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-gray-200 bg-white sticky top-0 z-20">
          <h3 className="text-lg font-semibold text-gray-900">Event Preview</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-900 cursor-pointer">
            <X className="w-4 h-4 text-gray-900" />
          </Button>
        </div>

        {/* Full Event Preview Content */}
        <div className={`bg-gray-900 text-white ${fontClass}`}>
          {/* Hero Banner */}
          <div className="h-96 relative overflow-hidden">
            <div className="absolute inset-0">
            {branding.visibility.showBanner && (
              <Image 
                src={branding.bannerUrl || event.templateImage || 'https://placehold.co/800x400/2563eb/ffffff?text=Event+Banner'} 
                alt={event.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = 'https://placehold.co/800x400/2563eb/ffffff?text=Event+Banner';
                }}
              />
            )}
              {branding.visibility.showLogo && branding.logoUrl && (
                <div className="absolute top-4 left-4 border-2 border-gray-200 p-0 rounded-md shadow-md">
                  <Image 
                    src={branding.logoUrl || '/images/image5.avif'}
                    alt="Event Logo" 
                    className="h-22 w-auto object-contain rounded"
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
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-3 py-1 bg-primary text-white text-sm rounded-full">
                  {event.eventType === 'in-person' ? 'In-person' :
                    event.eventType === 'virtual' ? 'Virtual' : 'Hybrid'}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">
                {event.name || 'Your Event Name'}
              </h1>
              <p className="text-xl text-white/90">
                {event.startDate && event.endDate
                  ? `${new Date(event.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - ${new Date(event.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                  : 'June 14-19, 2025'
                }
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          {/* <div className="border-b border-gray-700">
            <div className="px-6">
              <nav className="flex space-x-8">
                <button className="py-3 px-1 border-b-2 border-primary text-primary font-medium text-sm">
                  About
                </button>
                <button className="py-3 px-1 border-b-2 border-transparent text-gray-400 hover:text-white font-medium text-sm">
                  Schedule
                </button>
                <button className="py-3 px-1 border-b-2 border-transparent text-gray-400 hover:text-white font-medium text-sm">
                  Location
                </button>
                <button className="py-3 px-1 border-b-2 border-transparent text-gray-400 hover:text-white font-medium text-sm">
                  Register
                </button>
              </nav>
            </div>
          </div> */}

          {/* Content Area */}
          <div className={`p-6 bg-gradient-to-r ${themeGradient}`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {branding.visibility.showDescription && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-white">About</h2>
                    <p className="text-white leading-relaxed">
                      {event.description || 'Your event description will appear here. This is where you can provide detailed information about what attendees can expect, the agenda, speakers, and any other relevant details about your event.'}
                    </p>
                  </div>
                )}

                {branding.visibility.showLocation && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-3 text-white">Location</h3>
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-white mr-3 mt-1" />
                      <span className="text-white">{locationText}</span>
                    </div>
                  </div>
                )}

                {branding.visibility.showSchedule && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-3 text-white">Schedule</h3>
                    <div className="space-y-3">
                      {sessions.length > 0 ? (
                        sessions.map((session: any, index: any) => (
                          <div key={index} className="p-3 bg-transparent rounded-lg" style={{
                            boxShadow: '0 4px 10px rgba(255, 255, 255, 0.3)'
                          }}>
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-white">{session.title}</h4>
                                <p className="text-white mt-1">{session.speaker}</p>
                                {session.description && (
                                  <p className="text-white text-sm mt-2">{session.description}</p>
                                )}
                                {session.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {session.tags.map((tag: any, tagIndex: any) => (
                                      <span
                                        key={tagIndex}
                                        className="px-2 py-1 bg-white/20 text-white text-xs rounded-full"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="text-right text-sm text-white">
                                <div>{session.startTime}</div>
                                <div>{session.duration} min</div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-300">Event schedule will appear here when sessions are added.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className={`lg:col-span-1 rounded-lg ${sidebarGradient} h-fit sticky top-24`}>
                <div className="rounded-lg p-6 sticky top-24">
                  <div className="space-y-4 mb-6 text-sm">
                    <div className="flex items-center text-white">
                      <Calendar className="w-10 h-10 text-white mr-3" />
                      <span>{dateTimeText}</span>
                    </div>

                    <div className="flex items-center text-white">
                      <MapPin className="w-14 h-14 text-white mr-3" />
                      <span>{locationText}</span>
                    </div>

                    <div className="flex items-center text-white">
                      <Users className="w-5 h-5 text-white mr-3" />
                      <span>
                        {registration.maxAttendees ? `Max ${registration.maxAttendees} attendees` : 'Unlimited attendees'}
                      </span>
                    </div>

                    <div className="flex items-center text-white">
                      <Tag className="w-5 h-5 text-white mr-3" />
                      <span>{registration.paymentType === 'free' ? 'Free event' : `$${registration.ticketPrice || 0} ${registration.currency}`}</span>
                    </div>
                  </div>

                  {branding.visibility.showRegistration && (
                    <button className={`w-full bg-gradient-to-r ${themeGradient} cursor-pointer text-white font-medium py-3 px-4 rounded-lg transition-colors mb-6`}>
                      Register Now
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Registration Form */}
            {/* {branding.visibility.showRegistration && (
              <div className="mt-12 bg-white text-gray-900 rounded-xl p-8">
                <h3 className="text-xl font-semibold mb-6">Register for Event</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {registration.fields.map((field: any, index: any) => (
                      <div key={index}>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          {field.fieldName} {field.required && '*'}
                        </Label>
                        <Input
                          type={field.fieldType === 'email' ? 'email' : 'text'}
                          className="w-full"
                          placeholder={`Enter ${field.fieldName.toLowerCase()}`}
                        />
                      </div>
                    ))}
                  </div>
                  <button className="w-full bg-primary hover:bg-primary/90 text-black py-3 rounded-lg font-medium transition-colors">
                    Complete Registration
                  </button>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
