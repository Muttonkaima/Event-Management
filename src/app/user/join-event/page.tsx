"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, MapPin, Users, Tag } from "lucide-react";
import Image from "next/image";
import { getEventById } from "@/services/organization/eventService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function formatDateTime(start: string, end: string) {
  if (!start || !end) {
    return "June 14, 2025 9:00 AM - June 19, 2025 5:00 PM";
  }
  const startDate = new Date(start);
  const endDate = new Date(end);
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };
  return `${startDate.toLocaleDateString("en-US", options)} - ${endDate.toLocaleDateString("en-US", options)}`;
}

function getLocationText(event: any) {
  if (event.event_type === "virtual") {
    return event.meeting_link || "Virtual Event - Meeting link will be provided upon registration";
  }
  if (event.event_type === "hybrid") {
    const parts = [];
    if (event.address) parts.push(event.address);
    if (event.city) parts.push(event.city);
    if (event.state) parts.push(event.state);
    if (event.country) parts.push(event.country);
    const location = parts.join(", ") || "Physical location";
    const meeting = event.meeting_link || "Meeting link will be provided";
    return `${location} + Virtual: ${meeting}`;
  }
  if (event.event_type === "physical" && (event.address || event.city)) {
    const parts = [];
    if (event.address) parts.push(event.address);
    if (event.city) parts.push(event.city);
    if (event.state) parts.push(event.state);
    if (event.country) parts.push(event.country);
    return parts.join(", ");
  }
  return "Event location will appear here";
}

export default function JoinEventPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id");
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      setError("");
      try {
        if (!eventId) throw new Error("No event id provided");
        const res = await getEventById(eventId);
        if (!res?.data) throw new Error("Event not found");
        // Remove sensitive/irrelevant fields
        const { email_template_id, badge_id, registration_form_id, ...cleaned } = res.data;
        setEvent(cleaned);
      } catch (err: any) {
        setError(err.message || "Failed to fetch event");
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">Loading event...</div>
    );
  }
  if (error || !event) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">{error || "Event not found."}</div>
    );
  }

  // Branding
  const branding = event.branding_id || {};
  const palette = branding.branding_color_palette_id?.colors[0] || {};
  const fontClass = branding.branding_font_family_id?.font_family || "";
  const visibility = branding.branding_visibility_id?.fields || {};
  const themeGradient = palette.bgColor;
  const sidebarGradient = palette.sidebarColor || "bg-gray-700";
  const buttonGradient = palette.buttonColor || "bg-blue-600";
  
  console.log('branding', branding);
  console.log('palette', palette);
  // Dates
  const dateTimeText = formatDateTime(event.start_datetime, event.end_datetime);
  const locationText = getLocationText(event);

  // Sessions
  const sessions = event.sessions_id || [];
  // Tickets
  const tickets = event.ticket_ids || [];
  // Registration
  const attendeeLimit = event.attendee_limit_enabled ? event.attendee_limit : undefined;

  return (
    <div className={`min-h-screen w-full max-w-7xl mx-auto px-2 my-4 md:my-8 bg-black text-white ${fontClass} flex flex-col`}>
      {/* Hero Banner */}
      <div className="relative h-72 md:h-96 w-full overflow-hidden border-t-3 border-l-3 border-r-3 rounded-t-2xl">
        {visibility.showBanner && (
          <Image
            src={branding.branding_banner ? process.env.NEXT_PUBLIC_ASSETS_URL + branding.branding_banner : "https://placehold.co/800x400/2563eb/ffffff?text=Event+Banner"}
            alt={event.event_name}
            fill
            className="object-cover"
            priority
          />
        )}
        {visibility.showLogo && branding.branding_logo && (
          <div className="absolute top-4 left-4 border-2 border-gray-200 p-0 rounded-md shadow-md bg-white">
            <Image
              src={process.env.NEXT_PUBLIC_ASSETS_URL + branding.branding_logo}
              alt="Event Logo"
              width={80}
              height={80}
              className="object-contain rounded"
            />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-black/70 to-transparent z-10">
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-3 py-1 bg-primary text-white text-xs rounded-full capitalize">
              {event.event_type}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">
            {event.event_name || "Your Event Name"}
          </h1>
          <p className="text-base md:text-xl text-white/90">
            {event.start_datetime && event.end_datetime
              ? `${new Date(event.start_datetime).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} - ${new Date(event.end_datetime).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
              : "June 14-19, 2025"
            }
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 w-full max-w-7xl mx-auto px-2 md:px-8 py-6 bg-gradient-to-r ${themeGradient} border-l-3 border-r-3 border-b-3 rounded-b-2xl`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2">
            {visibility.showDescription && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-white">About</h2>
                <p className="text-white/90 leading-relaxed">
                  {event.description || "Your event description will appear here."}
                </p>
              </div>
            )}
            {visibility.showLocation && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3 text-white">{event.event_type === "virtual" ? "Meeting Link" : "Location"}</h3>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-white mr-3 mt-1" />
                  <span className="text-white/90">{locationText}</span>
                </div>
              </div>
            )}
            {visibility.showSchedule && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3 text-white">Schedule</h3>
                <div className="space-y-3">
                  {sessions.length > 0 ? (
                    sessions.map((session: any, idx: number) => (
                      <div key={session._id || idx} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-white">{session.session_title}</h4>
                            <p className="text-white mt-1">{session.speaker_name}</p>
                            {session.session_description && (
                              <p className="text-white text-sm mt-2">{session.session_description}</p>
                            )}
                            {session.tags && session.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {session.tags.map((tag: string, tagIdx: number) => (
                                  <span key={tagIdx} className="px-2 py-1 bg-white/20 text-white text-xs rounded-full">{tag}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-right text-sm text-white">
                            <div>{session.session_start_time}</div>
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
          <div className={`lg:col-span-1 ${sidebarGradient} h-fit sticky top-8 rounded-2xl`}> 
            <div className="rounded-lg p-6">
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex items-center text-white">
                  <Calendar className="w-5 h-5 text-white mr-3" />
                  <span>{dateTimeText}</span>
                </div>
                <div className="flex items-center text-white">
                  <MapPin className="w-5 h-5 text-white mr-3" />
                  <span>{locationText}</span>
                </div>
                <div className="flex items-center text-white">
                  <Users className="w-5 h-5 text-white mr-3" />
                  <span>{attendeeLimit ? `Max ${attendeeLimit} attendees` : "Unlimited attendees"}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-white">
                    <Tag className="w-5 h-5 text-white mr-3 flex-shrink-0" />
                    <span className="font-medium">Tickets</span>
                  </div>
                  {(!tickets || tickets.length === 0) ? (
                    <div className="text-white ml-8">Free event</div>
                  ) : (
                    <div className="space-y-2 ml-8">
                      {tickets.map((ticket: any, idx: number) => (
                        <div key={ticket._id || idx} className="flex justify-between items-center">
                          <span className="text-white">{ticket.ticket_name}</span>
                          <span className="text-white">
                            {ticket.ticket_type === "free" ? "Free" : `${ticket.currency || "INR"} ${ticket.price ? ticket.price.toFixed(2) : "0.00"}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {visibility.showRegistration && (
                <Button className={`w-full ${buttonGradient} cursor-pointer text-white font-medium py-3 px-4 rounded-lg transition-colors mb-6`}>
                  Register Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
