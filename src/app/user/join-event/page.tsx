"use client";
import { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useSearchParams } from "next/navigation";
import { Calendar, MapPin, Users, Tag } from "lucide-react";
import Image from "next/image";
import { getEventById, getGoogleOAuthUrl } from "@/services/organization/eventService";
import { Button } from "@/components/ui/button";
import Link from "next/link"
// Simple modal component
function Modal({ open, children }: { open: boolean, children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
        {children}
      </div>
    </div>
  );
}

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
  const [eventId, setEventId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [eventToken, setEventToken] = useState<string | null>(null);
  const [googleEmail, setGoogleEmail] = useState<string | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  // ✅ Moved these hooks to the top before any conditional return
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isMounted = useRef(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const googleToken = params.get('google_email');
      
      // Decode the JWT token if it exists
      if (googleToken) {
        try {
          const decodedToken: any = jwtDecode(googleToken);
          setGoogleEmail(decodedToken.email || googleToken);
        } catch (err) {
          console.error('Error decoding google_email token:', err);
          setGoogleEmail(googleToken); // Fallback to raw token if decoding fails
        }
      } else {
        setGoogleEmail(null);
      }
      
      setEventToken(params.get('eventId'));
    }
  }, [searchParams]);

  useEffect(() => {
    if (!eventToken) {
      setEventId(null);
      setEmail(null);
      setShowVerifyModal(false);
      setIsVerified(false);
      return;
    }

    try {
      const decoded: any = jwtDecode(eventToken);
      const invitedEmail = decoded.email;

      setEventId(decoded.eventId);
      setEmail(invitedEmail);

      if (!invitedEmail) {
        setIsVerified(true);
        setShowVerifyModal(false);
        setIsAllowed(true);
        return;
      }

      if (googleEmail) {
        if (googleEmail.toLowerCase() === invitedEmail.toLowerCase()) {
          setIsAllowed(true);
          setIsVerified(true);
          setShowVerifyModal(false);
        } else {
          setIsAllowed(false);
          setVerifyError('You are not authorized to see this page. Email mismatch.');
        }
      } else {
        setShowVerifyModal(!!invitedEmail);
        setIsVerified(false);
      }
    } catch (err) {
      console.error('Error decoding token:', err);
      setIsAllowed(false);
      setVerifyError('Invalid event token.');
    }
  }, [eventToken, googleEmail]);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      setError("");
      try {
        if (!eventId) throw new Error("Invalid or missing event id");
        const res = await getEventById(eventId);
        if (!res?.data) throw new Error("Event not found");
        const { email_template_id, badge_id, ...cleaned } = res.data;
        // Include registration_form_id in the cleaned event object
        cleaned.registration_form_id = res.data.registration_form_id;
        cleaned.event_id = res.data._id      
        console.log("cleaned", cleaned);
        setEvent(cleaned);

        console.log("event", event);
      } catch (err: any) {
        setError(err.message || "Failed to fetch event");
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [eventId]);

  const handleContinue = async () => {
    setVerifying(true);
    setVerifyError("");
    try {
      const url = await getGoogleOAuthUrl(email || "", eventToken || "");
      window.open(url, '_blank');
      setVerifying(false);
    } catch (err) {
      setVerifyError("Failed to get Google OAuth URL");
      setVerifying(false);
    }
  };

  // Conditional rendering
  if (isAllowed === false) {
    return (
      <Modal open>
        <div className="text-red-600 font-bold mb-2">You are not allowed to visit this page</div>
        <div className="text-sm text-gray-600">You signed in as {googleEmail} , but the invitation was sent to {email}.</div>
      </Modal>
    );
  }

  if (!isVerified && isAllowed !== true) {
    return (
      <>
        <Modal open={showVerifyModal}>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Verify Invitation Email</h2>
          <p className="mb-4 text-gray-700">This invitation is sent to <span className="font-bold">{email}</span>.<br />Please verify that you are the intended recipient.</p>
          {verifyError && <div className="text-red-500 mb-2">{verifyError}</div>}
          <button
            className="bg-black text-white px-6 py-2 rounded font-semibold disabled:opacity-60 cursor-pointer"
            onClick={handleContinue}
            disabled={verifying}
          >
            {verifying ? "Verifying..." : "Verify"}
          </button>
        </Modal>
        <div className="fixed inset-0 bg-black opacity-30 z-40" />
      </>
    );
  }

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

  const branding = event.branding_id || {};
  const palette = branding.branding_color_palette_id?.colors?.[0] || {};
  const fontClass = branding.branding_font_family_id?.font_family || "";
  const visibility = branding.branding_visibility_id?.fields || {};
  const themeGradient = palette.bgColor;
  const sidebarGradient = palette.sidebarColor || "bg-gray-700";
  const buttonGradient = palette.buttonColor || "bg-blue-600";

  const dateTimeText = formatDateTime(event.start_datetime, event.end_datetime);
  const locationText = getLocationText(event);
  const sessions = event.sessions_id || [];
  const tickets = event.ticket_ids || [];
  const attendeeLimit = event.attendee_limit_enabled ? event.attendee_limit : undefined;

  return (
    <div className={`min-h-screen w-full max-w-7xl mx-auto px-2 my-4 md:my-8 bg-black text-white ${fontClass} flex flex-col`}>
      {/* Banner */}
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

      {/* Content */}
      <div className={`flex-1 w-full max-w-7xl mx-auto px-2 md:px-8 py-6 bg-gradient-to-r ${themeGradient} border-l-3 border-r-3 border-b-3 rounded-b-2xl`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2">
            {visibility.showDescription && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-white">About</h2>
                <p className="text-white/90 leading-relaxed">{event.description || "Your event description will appear here."}</p>
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
                            {session.session_description && <p className="text-white text-sm mt-2">{session.session_description}</p>}
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
                            {ticket.ticket_type === "free"
                              ? "Free"
                              : `${ticket.currency || "INR"} ${ticket.price ? ticket.price.toFixed(2) : "0.00"}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {visibility.showRegistration && event?.registration_form_id?._id && (
                <>
                <Link 
                  href={`/user/registration-form?event_id=${event.event_id}&form_id=${event.registration_form_id._id}`}
                  className="w-full"
                >
                  <Button className={`w-full ${buttonGradient} cursor-pointer text-white font-medium py-3 px-4 rounded-lg transition-colors mb-6`}>
                    Register Now
                  </Button>
                </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
