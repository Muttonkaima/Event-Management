'use client';

import dynamic from 'next/dynamic';

// Client-side only AnalyticsDashboard
const AnalyticsDashboard = dynamic(
  () => import('./analytics-dashboard'),
  { ssr: false }
);

export default function AnalyticsClientWrapper() {
  return <AnalyticsDashboard />;
}
