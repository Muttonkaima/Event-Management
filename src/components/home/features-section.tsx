"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CalendarPlus, 
  FileText, 
  Mail, 
  Badge, 
  BarChart3, 
  Zap,
  Check 
} from "lucide-react";

const features = [
  {
    icon: CalendarPlus,
    title: "Event Creation",
    description: "Create stunning events with our intuitive drag-and-drop builder. Customize every detail to match your brand.",
    color: "bg-black",
    features: [
      "Drag & drop builder",
      "Custom branding",
      "Template library"
    ]
  },
  {
    icon: FileText,
    title: "Smart Form Builder",
    description: "Build custom registration forms with conditional logic, payment integration, and real-time validation.",
    color: "bg-blue-500",
    features: [
      "Conditional logic",
      "Payment integration",
      "Real-time validation"
    ]
  },
  {
    icon: Mail,
    title: "Email Templates",
    description: "Design beautiful, responsive email templates for confirmations, reminders, and follow-ups.",
    color: "bg-green-500",
    features: [
      "Visual editor",
      "Automated sending",
      "A/B testing"
    ]
  },
  {
    icon: Badge,
    title: "Badge Designer",
    description: "Create professional event badges with QR codes, custom layouts, and batch printing capabilities.",
    color: "bg-purple-600",
    features: [
      "QR code integration",
      "Batch printing",
      "Custom layouts"
    ]
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track registrations, engagement, and ROI with comprehensive analytics and real-time dashboards.",
    color: "bg-orange-500",
    features: [
      "Real-time dashboards",
      "Custom reports",
      "ROI tracking"
    ]
  },
  {
    icon: Zap,
    title: "Seamless Integrations",
    description: "Connect with your favorite tools including CRM systems, payment processors, and marketing platforms.",
    color: "bg-pink-500",
    features: [
      "CRM integration",
      "Payment gateways",
      "Marketing tools"
    ]
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Manage Events</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From creation to analysis, EventFlow provides all the tools you need to run successful events.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="bg-gray-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 border-0"
              >
                <CardContent className="p-8">
                  <div className={`${feature.color} rounded-lg w-12 h-12 flex items-center justify-center mb-6`}>
                    <IconComponent className="text-white h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center">
                        <Check className="text-green-500 mr-2 h-4 w-4" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Interactive Demo Section */}
        <Card className="bg-gradient-to-r from-primary to-secondary text-center border-0">
          <CardContent className="p-12">
            <h3 className="text-3xl font-bold text-white mb-4">See EventFlow in Action</h3>
            <p className="text-gray-300 text-lg mb-8">
              Experience our platform with an interactive demo tailored to your event management needs.
            </p>
            <Link href="/login">
              <Button 
                className="bg-white text-gray-900 hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 text-lg px-8 py-4"
              >
                Try Interactive Demo
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
