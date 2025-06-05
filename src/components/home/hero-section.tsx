"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-white pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          <div className="lg:col-span-6">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Streamline Your{" "}
              <span className="text-accent">Event Management</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Create, manage, and analyze events with our all-in-one platform. Build custom forms, design email templates, create badges, and track analytics seamlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/login">
                <Button 
                  size="lg" 
                  className="bg-primary text-gray-900 hover:bg-secondary transition-all duration-200 transform hover:scale-105 shadow-lg text-lg px-8 py-4"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/login">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-primary text-white hover:bg-primary hover:text-white transition-all duration-200 text-lg px-8 py-4"
                >
                  Watch Demo
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">10K+</div>
                <div className="text-gray-600">Events Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-gray-600">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">99.9%</div>
                <div className="text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-6 mt-12 lg:mt-0">
            {/* Dashboard mockup */}
            <div className="relative">
              <Card className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Event Dashboard</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Tech Conference 2024</span>
                      <Badge className="bg-green-500 text-white hover:bg-green-600">Active</Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">1,247 registrations</div>
                    <Progress value={75} className="h-2" />
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Marketing Summit</span>
                      <Badge variant="secondary">Draft</Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">245 registrations</div>
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
