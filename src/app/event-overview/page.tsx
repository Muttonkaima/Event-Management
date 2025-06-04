"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalyticsCard from "@/components/event-dashboard/analytics-card";
import ToolCard from "@/components/event-dashboard/tool-card";
import { Menu, MapPin, MoreHorizontal } from "lucide-react";
import OverviewLayout from "@/components/event-dashboard/OverviewLayout";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      status: "Published" as const,
      statusColor: "blue" as const,
      actionText: "Edit",
      icon: "form-input"
    },
    {
      title: "Email Builder",
      description: "Design emails for confirmations and reminders",
      status: "In Progress" as const,
      statusColor: "yellow" as const,
      actionText: "Continue",
      icon: "mail"
    },
    {
      title: "Badge Designer",
      description: "Create custom badges for your attendees",
      status: "Completed" as const,
      statusColor: "green" as const,
      actionText: "Continue",
      icon: "badge"
    },
    {
      title: "Lead Scanner",
      description: "Set up and configure lead scanning",
      status: "Not Started" as const,
      statusColor: "gray" as const,
      actionText: "Start",
      icon: "scan"
    },
    {
      title: "Live Display Setup",
      description: "Configure displays for your event venue",
      status: "Not Started" as const,
      statusColor: "gray" as const,
      actionText: "Start",
      icon: "monitor"
    },
    {
      title: "Session Manager",
      description: "Manage sessions, speakers and schedules",
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
              <TabsList className="inline-flex bg-gray-100 text-gray-500 rounded-lg">
                <TabsTrigger value="overview" className="cursor-pointer rounded-lg">Overview</TabsTrigger>
                <TabsTrigger value="analytics" className="cursor-pointer rounded-lg">Analytics</TabsTrigger>
                <TabsTrigger value="tools" className="cursor-pointer rounded-lg">Tools</TabsTrigger>
              </TabsList>
            </div>


            <TabsContent value="overview" className="space-y-6">
              {/* Event Info Card */}
              <Card>
                <div className="flex flex-col md:flex-row bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200"
                    alt="Conference setup"
                    className="w-full md:w-48 h-40 md:h-auto object-cover rounded-l-lg"
                  />
                  <CardContent className="flex-1 p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Live
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Jun 3, 2025 — Jun 4, 2025 — In Person
                          </span>
                        </div>
                        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-1">
                          miuds 2025
                        </h2>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>San Francisco Convention Center</span>
                        </div>
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
