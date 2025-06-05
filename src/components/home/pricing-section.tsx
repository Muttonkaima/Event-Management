"use client";
import Link  from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for small events and getting started",
    features: [
      "Up to 3 events per month",
      "500 registrations per event",
      "Basic form builder",
      "Email templates",
      "Basic analytics"
    ],
    popular: false,
    buttonText: "Start Free Trial",
    buttonVariant: "outline" as const
  },
  {
    name: "Professional",
    price: "$79",
    period: "/month",
    description: "Ideal for growing businesses and agencies",
    features: [
      "Unlimited events",
      "5,000 registrations per event",
      "Advanced form builder",
      "Custom email templates",
      "Badge designer",
      "Advanced analytics",
      "API access"
    ],
    popular: true,
    buttonText: "Start Free Trial",
    buttonVariant: "default" as const
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with specific needs",
    features: [
      "Unlimited everything",
      "White-label solution",
      "Custom integrations",
      "Dedicated support",
      "Custom analytics",
      "SLA guarantee"
    ],
    popular: false,
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600">
            Choose the plan that fits your event management needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className="relative">
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-accent text-white hover:bg-accent">Most Popular</Badge>
                </div>
              )}
              <Card 
                className={`${
                  plan.popular 
                    ? 'bg-black text-white transform scale-105 shadow-xl border-primary' 
                    : 'bg-gray-50 hover:shadow-lg'
                } transition-all duration-300 border-0`}
              >
                <CardContent className="p-8">
                  <h3 className={`text-2xl font-bold mb-4 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <div className={`text-4xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                    <span className={`text-lg ${plan.popular ? 'text-white' : 'text-gray-600'}`}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={`mb-8 ${plan.popular ? 'text-white' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className={`flex items-center ${plan.popular ? 'text-white' : 'text-gray-600'}`}>
                        <Check className="text-green-500 mr-3 h-5 w-5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Link href="/login">
                    <Button 
                      variant={plan.popular ? "secondary" : plan.buttonVariant}
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-white text-gray-900 hover:bg-gray-100' 
                          : plan.buttonVariant === 'outline' 
                            ? 'border-2 border-primary text-white hover:bg-primary hover:text-white'
                            : ''
                      } transition-all duration-200`}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
