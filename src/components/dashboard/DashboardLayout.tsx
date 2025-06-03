"use client";

import { ReactNode, useState, useEffect } from 'react';
import Head from 'next/head';
import Sidebar from './Sidebar';
import Header from './Header';

type DashboardLayoutProps = {
  children: ReactNode;
  title?: string;
};

export default function DashboardLayout({ children, title = 'Dashboard' }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{`${title} | EventPro`}</title>
        <meta name="description" content="Event management dashboard" />
      </Head>

      <Sidebar isOpen={isSidebarOpen} toggleSidebarAction={toggleSidebar} />
      
      <div className="lg:pl-64 flex flex-col flex-1">
        <Header toggleSidebarAction={toggleSidebar} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
