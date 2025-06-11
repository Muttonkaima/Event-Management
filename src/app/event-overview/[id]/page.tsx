import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { BarChart2, LayoutDashboard, Settings2, Wrench } from "lucide-react";
import Link from "next/link";
import AnalyticsCard from "@/components/event-dashboard/analytics-card";
import ToolCard from "@/components/event-dashboard/tool-card";
import { MapPin, Calendar, Share2, ArrowRight } from "lucide-react";
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

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default async function EventOverview({ params }: PageProps) {
  // Await the params promise
  const { id } = await params;

  // Find the event with the matching ID
  const eventsData: Event[] = adaptEvents(rawEvents);
  const event = eventsData.find((e) => e.id === id);

  if (!event) {
    notFound();
  }

  // Get banner or template image
  const bannerImage = event.branding?.bannerUrl || event.image || event.branding?.logoUrl;
  const logoImage = event.branding?.logoUrl || event.image;
  
  // Calculate registration progress
  const registrationProgress = Math.min(Math.round((event.attendees / (event.registration?.maxAttendees || 100)) * 100), 100);

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
    <OverviewLayout title={event.name}>
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
            <div className="relative -mt-16 w-32 h-32 md:w-36 md:h-36 rounded-2xl border-4 border-background bg-card shadow-xl overflow-hidden">
              {logoImage ? (
                <Image
                  src={logoImage}
                  alt={`${event.name} logo`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 6rem, 8rem"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white/80">
                    {event.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <Badge className={cn(
                  "px-3 py-1.5 text-sm font-medium",
                  getStatusBadgeVariant(event.status)
                )}>
                  {getStatusText(event.status)}
                </Badge>
                <div className="flex items-center gap-2 text-sm text-white">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(event.date.start)}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2 text-sm text-white">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location.name}, {event.location.city}</span>
                  </div>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                {event.name}
              </h1>
              
              {event.description && (
                <p className="mt-2 text-base text-white/80 max-w-3xl">
                  {event.description}
                </p>
              )}
              
              <div className="mt-4 flex flex-wrap items-center gap-3 text-white">
                <Button className="cursor-pointer text-white">
                  <Settings2 className="mr-2 h-4 w-4" />
                  Manage Event
                </Button>
                <Button variant="outline" className="cursor-pointer bg-black border-none text-white">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
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

            {/* Quick Actions */}
            <div>
              <div className="flex items-center justify-between mb-6 text-gray-900">
                <div>
                  <h2 className="text-xl font-semibold">Quick Actions</h2>
                  <p className="text-sm text-muted-gray-900">
                    Quickly access important event management tools
                  </p>
                </div>
                <Link href={`/event-overview/${event.id}?tab=tools`}>
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
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">Attendance Overview</CardTitle>
                  <CardDescription className="text-gray-600">
                    Registration and check-in metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] flex items-center justify-center bg-muted/30 rounded-lg">
                    <p className="text-gray-900">Attendance chart</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">Top Sessions</CardTitle>
                  <CardDescription className="text-gray-600">
                    Most popular sessions by attendance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Session {i}</p>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${80 - (i * 15)}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium">
                          {80 - (i * 15)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Event Analytics</CardTitle>
                <CardDescription className="text-gray-600">
                  Detailed metrics and insights about your event
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video flex items-center justify-center bg-muted/30 rounded-lg">
                  <p className="text-gray-900">Detailed analytics dashboard</p>
                </div>
              </CardContent>
            </Card>
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