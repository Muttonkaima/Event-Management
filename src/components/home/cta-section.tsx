"use client";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-r from-primary to-secondary">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Transform Your Event Management?
        </h2>
        <p className="text-xl text-gray-300 mb-12">
          Join thousands of event professionals who trust EventFlow to manage their events efficiently and effectively.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg"
            className="bg-white text-gray-900 hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 text-lg px-8 py-4"
          >
            Start Your Free Trial
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-200 text-lg px-8 py-4"
          >
            Schedule a Demo
          </Button>
        </div>
        
        <div className="mt-8 text-gray-300 text-sm">
          <p>No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </div>
    </section>
  );
}
