"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav className={`bg-white border-b border-gray-200 sticky top-0 z-50 transition-shadow duration-200 ${isScrolled ? 'shadow-lg' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">EventFlow</h1>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-600 border border-gray-200 hover:text-gray-900 cursor-pointer">
                Sign In
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-primary text-white bg-black transform hover:scale-105 transition-all duration-200 cursor-pointer">
                Get Started
              </Button>
            </Link>
          </div>

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-gray-900" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-white">
                <SheetClose asChild>
                  <button
                    className="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-100 transition"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </SheetClose>
                <h1 className="text-2xl font-bold text-gray-900">EventFlow</h1>
                <div className="flex flex-col space-y-2 mt-8">
                  {navItems.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => handleNavClick(item.href)}
                      className="text-left px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <Link href="/login">
                      <Button variant="ghost" className="w-full justify-center text-gray-600 hover:text-gray-900 border border-gray-200">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button className="w-full bg-black text-white mt-2">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
