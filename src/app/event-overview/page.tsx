'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getEventById } from '@/services/organization/eventService';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { BarChart2, LayoutDashboard, Settings2, Wrench, PlusCircle, MapPin, Calendar, ArrowRight, Medal, Mail, FileText } from "lucide-react";
import Link from "next/link";
import AnalyticsCard from "@/components/event-dashboard/analytics-card";
import ToolCard from "@/components/event-dashboard/tool-card";
import OverviewLayout from '@/components/event-dashboard/OverviewLayout';
import Image from 'next/image';
import ShareLinkButton from '@/components/event-dashboard/shareButton';
import AnalyticsClientWrapper from '@/components/event-dashboard/analytics-client-wrapper';

export default function EventOverviewPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id');
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch event data when component mounts
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        setError('No event ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getEventById(eventId);
        console.log('Event data response:', response);
        if (response?.success && response.data) {
          setEvent(response.data);
        } else {
          setError('Failed to load event data');
        }
      } catch (err: any) {
        console.error('Error fetching event:', err);
        setError(err.message || 'An error occurred while fetching event data');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading event details...</div>
      </div>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 text-lg mb-4">Error: {error || 'Event not found'}</div>
        <Link href="/events">
          <Button variant="outline">Back to Events</Button>
        </Link>
      </div>
    );
  }
  // Get current status based on dates
  const getCurrentStatus = () => {
    const now = new Date();
    const start = new Date(event.start_datetime);
    const end = new Date(event.end_datetime);
    
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'ongoing';
    return 'completed';
  };

  const currentStatus = getCurrentStatus();

  // Sessions: from event.sessions_id (array of session objects) or []
  const sessions = event.sessions_id || [];
  const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL;
  // Banner and logo images
  const bannerImage = event.branding_id?.branding_banner
  ? `${ASSETS_URL}${event.branding_id.branding_banner}`
  : event.event_template_design_id?.image
    ? `${ASSETS_URL}${event.event_template_design_id.image}`
    : event.branding_id?.branding_logo
      ? `${ASSETS_URL}${event.branding_id.branding_logo}`
      : '';

const logoImage = event.branding_id?.branding_logo
  ? `${ASSETS_URL}${event.branding_id.branding_logo}`
  : event.event_template_design_id?.image
    ? `${ASSETS_URL}${event.event_template_design_id.image}`
    : '';

  // Registration progress: attendee count over limit
  const attendeeCount = Array.isArray(event.registration?.attendees) ? event.registration.attendees.length : 0;
  const registrationProgress = Math.min(
    Math.round((attendeeCount / (event.attendee_limit || 100)) * 100),
    100
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get status badge color
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'ongoing':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'completed':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'ongoing':
        return 'Live';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const toolsData = [
    {
      title: "Registration Form Builder",
      description: "Create and customize your event registration form",
      link: "/form-builder",
      status: "Popular" as const,
      icon: "form-input",
      isActive: true
    },
    {
      title: "Email Builder",
      description: "Design emails for confirmations and reminders",
      link: "/email-builder",
      status: "Popular" as const,
      icon: "mail",
      isActive: true
    },
    {
      title: "Badge Designer",
      description: "Create custom badges for your attendees",
      link: "/badge-designer",
      status: "Popular" as const,
      icon: "badge",
      isActive: true
    },
    {
      title: "Lead Scanner",
      description: "Set up and configure lead scanning",
      link: "#",
      status: "Premium" as const,
      icon: "scan",
      isActive: false
    },
    {
      title: "Live Display Setup",
      description: "Configure displays for your event venue",
      link: "#",
      status: "Premium" as const,
      icon: "monitor",
      isActive: false
    },
    {
      title: "Session Manager",
      description: "Manage sessions, speakers and schedules",
      link: "#",
      status: "New" as const,
      icon: "calendar",
      isActive: false
    }
  ];

  return (
    <OverviewLayout title={event.event_name}>
    <div className="min-h-screen bg-transparent">
      {/* Hero Section */}
      <div className="relative h-72 overflow-hidden rounded-2xl">
        {bannerImage ? (
          <Image
            src={bannerImage}
            alt={event.name}
            fill
            className="object-cover"
            priority
            quality={100}
          />
        ) : (
          <div className="absolute inset-0 bg-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        
        <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 w-full">
            <div className="relative mt-16 w-32 h-32 md:w-36 md:h-36 rounded-2xl border-4 border-background bg-card shadow-xl overflow-hidden hidden md:block">
              {logoImage ? (
                <Image
                  src={logoImage}
                  alt={`${event.name} logo`}
                  fill
                  className="object-fill"
                  sizes="(max-width: 768px) 6rem, 8rem"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white/80">
                    {event.event_name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 mb-2">
                <div className="w-fit">
                  <Badge className={cn(
                    "px-3 py-1 text-xs md:text-sm md:py-1.5 font-medium whitespace-nowrap",
                    getStatusBadgeVariant(event.status || 'upcoming')
                  )}>
                    {getStatusText(event.status || 'upcoming')}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-white flex-wrap">
                  <div className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-md">
                    <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="whitespace-nowrap text-xs sm:text-sm">{formatDate(event.start_datetime)}</span>
                  </div>
                  {event.address && (
                    <div className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-md">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm line-clamp-1">
                        {event.address}, {event.state}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                {event.event_name}
              </h1>
              
              {event.description && (
                <p className="mt-2 text-base text-white/90 max-w-3xl">
                  {event.description}
                </p>
              )}
              
              <div className="mt-4 flex items-center gap-3 text-white">
                <Button className="cursor-pointer text-white">
                  <Settings2 className="mr-2 h-4 w-4" />
                  Manage Event
                </Button>
                <ShareLinkButton />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-2 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full md:w-auto grid-cols-3 bg-gray-100 p-1.5 h-auto rounded-xl shadow-inner">
            <TabsTrigger 
              value="overview" 
              className="py-2 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-700 cursor-pointer"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="py-2 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-700 cursor-pointer"
            >
              <BarChart2 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="tools" 
              className="py-2 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-700 cursor-pointer"
            >
              <Wrench className="h-4 w-4 mr-2" />
              Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Analytics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <AnalyticsCard 
                title="Total Registrations" 
                value={event.registration?.attendees?.length.toString() || '0'} 
                change="+12% from last month" 
                changeType="positive" 
                icon="user-plus"
                trend="up"
              />
              <AnalyticsCard 
                title="Check-ins" 
                value="124" 
                change="+8.1% from last event" 
                changeType="positive" 
                icon="check-circle"
                trend="up"
              />
              <AnalyticsCard 
                title="Revenue" 
                value="$3,287" 
                change="+19% from last month" 
                changeType="positive" 
                icon="dollar-sign"
                trend="up"
              />
              <AnalyticsCard 
                title="Engagement" 
                value="87%" 
                change="+2.3% from last event" 
                changeType="positive" 
                icon="users"
                trend="up"
              />
            </div>

            {/* Sessions Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Sessions</h2>
              </div>
              {sessions.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {sessions.slice(0, 3).map((session: any) => (
                    <Card key={session._id} className="overflow-hidden shadow-lg bg-transparent rounded-2xl">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg text-gray-900">{session.session_title}</CardTitle> <br />
                            <p className="text-sm text-gray-700">
                             Start time: {session.session_start_time} <br />
                             Duration: {session.duration} minutes
                            </p>
                            <p className="text-sm text-gray-700 line-clamp-2">
                          {session.session_description || 'No description available'}
                        </p>
                          </div>
                          <Badge variant="outline" className="text-gray-500">
                            {session.type || 'Session'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        
                        {session.speaker_name && (
                          <div className="mt-3 flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-medium">
                              {session.speaker_name.split(' ').filter(Boolean).map((n: string) => n[0]).join('')}
                            </div>
                            <div className="ml-2">
                              <p className="text-sm font-bold text-gray-700">{session.speaker_name}</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-gray-700 dark:border-gray-700 p-12 text-center">
                  <div className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true">
                    <svg className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No sessions created</h3>
                  <p className="mt-1 text-sm text-gray-700">Get started by creating your first session.</p>
                  <div className="mt-6 text-gray-900">
                    <Button className="bg-gray-900 text-white cursor-pointer">
                      <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
                      New Session
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Event Resources */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Event Resources</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {/* Badge Card */}
                {event.badge_id ? (
                  <Card className="h-full flex flex-col transition-all hover:shadow-md group">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2 text-gray-900">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Image
                            src="/images/badge-icon.svg"
                            alt="Badge"
                            width={16}
                            height={16}
                            className="text-primary"
                          />
                        </div>
                        Badge
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">ID: {event.badge_id}</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full group-hover:bg-black group-hover:text-white transition-colors"
                      >
                        View Badge
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <div className="rounded-2xl border-2 border-dashed border-gray-700 p-6 text-center flex flex-col items-center justify-center h-full min-h-[180px]">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Medal size={20} className="text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-900 mb-1">No badge selected</p>
                    <p className="text-sm text-gray-700">Create badge to identify attendees</p>
                    {/* <Button variant="outline" size="sm">
                      Create Badge
                    </Button> */}
                  </div>
                )}

                {/* Form Card */}
                {event.registration_form_id ? (
                  <Card className="h-full flex flex-col transition-all hover:shadow-md group">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2 text-gray-900">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Image
                            src="/images/form-icon.svg"
                            alt="Form"
                            width={16}
                            height={16}
                            className="text-blue-500"
                          />
                        </div>
                        Registration Form
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">ID: {event.registration_form_id}</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full group-hover:bg-black group-hover:text-white transition-colors"
                      >
                        View Form
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <div className="rounded-2xl border-2 border-dashed border-gray-700 p-6 text-center flex flex-col items-center justify-center h-full min-h-[180px]">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <FileText size={20} className="text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-900 mb-1">No form selected</p>
                    <p className="text-sm text-gray-700">Create form to collect attendee information</p>
                    {/* <Button variant="outline" size="sm">
                      Create Form
                    </Button> */}
                  </div>
                )}

                {/* Email Template Card */}
                {event.email_template_id ? (
                  <Card className="h-full flex flex-col transition-all hover:shadow-md group">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2 text-gray-900">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Image
                            src="/images/email-icon.svg"
                            alt="Email"
                            width={16}
                            height={16}
                            className="text-green-500"
                          />
                        </div>
                        Email Template
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">ID: {event.email_template_id}</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full group-hover:bg-black group-hover:text-white transition-colors"
                      >
                        View Template
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <div className="rounded-2xl border-2 border-dashed border-gray-700 p-6 text-center flex flex-col items-center justify-center h-full min-h-[180px]">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Mail size={20} className="text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-900 mb-1">No template selected</p>
                    <p className="text-sm text-gray-700">Create template to send emails to attendees</p>
                    {/* <Button variant="outline" size="sm">
                      Create Template
                    </Button> */}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <div className="flex items-center justify-between mb-6 text-gray-900">
                <div>
                  <h2 className="text-xl font-semibold">Quick Actions</h2>
                  <p className="text-sm text-muted-gray-900">
                    Quickly access important event management tools
                  </p>
                </div>
                <Link href={`/event-overview/${event._id}?tab=tools`}>
                  <Button variant="ghost" size="sm" className="text-primary">
                    View all tools
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {toolsData
                  .filter(tool => tool.isActive)
                  .slice(0, 3)
                  .map((tool) => (
                    <ToolCard 
                      key={tool.title} 
                      {...tool} 
                      isActive={tool.isActive} 
                    />
                  ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsClientWrapper />
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {toolsData.map((tool, index) => (
                <ToolCard 
                  key={tool.title} 
                  {...tool} 
                  isActive={tool.isActive}
                  isExternal={index % 3 === 0} // Example: Every 3rd tool is external
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </OverviewLayout>
  );
}