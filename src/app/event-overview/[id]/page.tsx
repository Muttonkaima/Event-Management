import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalyticsCard from "@/components/event-dashboard/analytics-card";
import ToolCard from "@/components/event-dashboard/tool-card";
import { MapPin, MoreHorizontal, User, Clock, Users, Tag } from "lucide-react";
import OverviewLayout from '@/components/event-dashboard/OverviewLayout';
import { notFound } from 'next/navigation';
import { adaptEvents, Event } from '@/app/events/events-new-adapter';
import rawEvents from '@/data/events.json';
import Image from 'next/image';


export async function generateStaticParams() {
  const eventsData: Event[] = adaptEvents(rawEvents);
  return eventsData.map((event: Event) => ({
    id: event.id,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventOverview({ params }: PageProps) {
  // Await the params promise
  const { id } = await params;

  // Find the event with the matching ID
  const eventsData: Event[] = adaptEvents(rawEvents);
  const event = eventsData.find((e) => e.id === id);

  if (!event) {
    notFound();
  }

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

  // Format date range
  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // If same day, show single date with time range
    if (startDate.toDateString() === endDate.toDateString()) {
      return `${formatDate(start)} - ${endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    }

    // Otherwise show date range
    return `${formatDate(start)} - ${formatDate(end)}`;
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

  const analyticsData = [
    {
      title: "Registrations",
      value: "1,245",
      change: "+0%",
      changeType: "neutral" as const,
      icon: "user-plus"
    },
    {
      title: "Check-ins",
      value: "876",
      change: "+8%",
      changeType: "positive" as const,
      icon: "check-circle"
    },
    {
      title: "Net Sales",
      value: "$24,500",
      change: "+5%",
      changeType: "positive" as const,
      icon: "dollar-sign"
    },
    {
      title: "Active Users",
      value: "342",
      change: "-3%",
      changeType: "negative" as const,
      icon: "users"
    },
    {
      title: "Leads Scanned",
      value: "528",
      change: "+59%",
      changeType: "positive" as const,
      icon: "qr-code"
    }
  ];

  const toolsData = [
    {
      title: "Registration Form Builder",
      description: "Create and customize your event registration form",
      link: "/form-builder",
      status: "Completed" as const,
      statusColor: "blue" as const,
      actionText: "Edit",
      icon: "form-input"
    },
    {
      title: "Email Builder",
      description: "Design emails for confirmations and reminders",
      link: "/email-builder",
      status: "Completed" as const,
      statusColor: "yellow" as const,
      actionText: "Continue",
      icon: "mail"
    },
    {
      title: "Badge Designer",
      description: "Create custom badges for your attendees",
      link: "/badge-designer",
      status: "Completed" as const,
      statusColor: "green" as const,
      actionText: "Continue",
      icon: "badge"
    },
    {
      title: "Lead Scanner",
      description: "Set up and configure lead scanning",
      link: "#",
      status: "In Progress" as const,
      statusColor: "gray" as const,
      actionText: "Start",
      icon: "scan"
    },
    {
      title: "Live Display Setup",
      description: "Configure displays for your event venue",
      link: "#",
      status: "In Progress" as const,
      statusColor: "gray" as const,
      actionText: "Start",
      icon: "monitor"
    },
    {
      title: "Session Manager",
      description: "Manage sessions, speakers and schedules",
      link: "#",
      status: "In Progress" as const,
      statusColor: "yellow" as const,
      actionText: "Continue",
      icon: "calendar"
    }
  ];

  return (
    <OverviewLayout title="Event Overview">
      {/* Main Content Area */}
      <main className="flex-1">
        <div className="p-2 max-w-7xl mx-auto">
          <Tabs defaultValue="overview" className="space-y-6">
            {/* Tab Navigation */}
            <div className="space-y-4">
              <TabsList className="inline-flex bg-gray-100 text-gray-500 rounded-lg shadow-inner">
                <TabsTrigger value="overview" className="cursor-pointer rounded-lg">Overview</TabsTrigger>
                <TabsTrigger value="analytics" className="cursor-pointer rounded-lg">Analytics</TabsTrigger>
                <TabsTrigger value="tools" className="cursor-pointer rounded-lg">Tools</TabsTrigger>
              </TabsList>
            </div>


            <TabsContent value="overview" className="space-y-6">
              {/* Event Info Card */}
              <Card>
                <div className="flex flex-col md:flex-row bg-white rounded-lg">
                  <div className="relative w-full md:w-48 h-40 md:h-auto">
                    <Image
                      src={event.image}
                      alt={event.name}
                      className="w-full h-full object-cover rounded-lg md:rounded-l-lg md:rounded-r-none"
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      priority
                    />
                    {event.branding?.visibility?.showLogo && event.branding?.logoUrl && (
                      <div className="absolute top-3 left-3 bg-white rounded-full p-1 shadow-md">
                        <Image src={event.branding.logoUrl} alt={event.name + ' logo'} width={48} height={48} className="rounded-full object-cover" />
                      </div>
                    )}
                  </div>
                  <CardContent className={`flex-1 p-4 ${event.branding?.fontStyle || ''}`} style={{ fontFamily: event.branding?.fontStyle || undefined }}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusBadgeVariant(event.status)}>
                            {getStatusText(event.status)}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {formatDateRange(event.date.start, event.date.end)} • In Person
                          </span>
                        </div>
                        <h2 className="text-lg md:text-xl font-semibold text-gray-900" style={{ color: event.branding?.colorTheme || undefined }}>
                          {event.name}
                        </h2>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{event.location.name}, {event.location.city}, {event.location.country}</span>
                        </div>

                        {/* Additional Event Details */}
                        <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                          <div className="flex items-center text-gray-600">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            <span>Organizer: {event.organizer.name}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Users className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{event.attendees.toLocaleString()} attendees</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Tag className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{event.category}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{getStatusText(event.status)}</span>
                          </div>
                        </div>

                        {/* Tags */}
                        {event.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {event.tags.slice(0, 3).map((tag: string) => (
                              <Badge key={tag} variant="outline" className="text-xs text-gray-400">
                                {tag}
                              </Badge>
                            ))}
                            {event.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs text-gray-400">
                                +{event.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Description */}
                        {event.branding?.visibility?.showDescription !== false && (
                          <div className="mt-4">
                            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                              {event.description}
                            </p>
                          </div>
                        )}

                        {/* Schedule (sessions) */}
                        {event.branding?.visibility?.showSchedule !== false && event.sessions && event.sessions.length > 0 && (
                          <div className="mt-6">
                            <h3 className="text-md font-semibold text-gray-800 mb-2">Schedule</h3>
                            <ul className="divide-y divide-gray-100">
                              {event.sessions.map((session: any, idx: number) => (
                                <li key={idx} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between">
                                  <span className="font-medium text-gray-900">{session.title}</span>
                                  <span className="text-sm text-gray-500">{formatDate(session.start)} - {formatDate(session.end)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Registration */}
                        {event.branding?.visibility?.showRegistration !== false && event.registration && (
                          <div className="mt-6">
                            <h3 className="text-md font-semibold text-gray-800 mb-2">Registration</h3>
                            <div className="flex flex-col md:flex-row md:items-center gap-2">
                              <span className="text-gray-700">Max Attendees: {event.registration.maxAttendees}</span>
                              <span className="text-gray-700">Price: {event.registration.price ? `$${event.registration.price}` : 'Free'}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" className="mt-4 md:mt-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>

              {/* Event Analytics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Event Analytics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {analyticsData.map((item, index) => (
                    <AnalyticsCard key={index} {...item} />
                  ))}
                </div>
              </div>

              {/* Event Tools */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Event Tools
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {toolsData.map((tool, index) => (
                    <ToolCard key={index} {...tool} />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Analytics Coming Soon
                </h3>
                <p className="text-gray-500">
                  Detailed analytics and reporting features will be available here.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="tools" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {toolsData.map((tool, index) => (
                  <ToolCard key={index} {...tool} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </OverviewLayout>
  );
}
