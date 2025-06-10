"use client";

import DashboardLayout from '@/components/user/event-dashboard/DashboardLayout';
import announcements from '@/data/user/eventAnnouncements.json';
import { format, parseISO } from 'date-fns';

export default function AnnouncementsPage() {
  // Parse and sort announcements (recent first)
  const sorted = [...announcements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <DashboardLayout title="Announcements">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Event Announcements</h1>
        <span className="text-gray-500 text-base">Stay updated with the latest info</span>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sorted.map((a) => (
          <div
            key={a.id}
            className={`relative rounded-xl shadow-lg bg-transparent p-6 flex flex-col gap-2 transition-transform hover:scale-[1.02] hover:shadow-2xl group min-h-[170px]`}>
            <div className="flex items-center gap-2 mb-2">
              {a.isImportant && (
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 text-xs font-semibold mr-2 animate-pulse">
                  <svg className="h-4 w-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  Important
                </span>
              )}
              <h2 className={`text-lg md:text-xl font-semibold flex-1 ${a.isImportant ? 'text-yellow-800' : 'text-gray-900'}`}>{a.title}</h2>
            </div>
            <p className="text-gray-700 text-base mb-2 flex-1">{a.content}</p>
            <div className="flex items-end justify-between mt-2">
              <span className="text-xs text-gray-500">{format(parseISO(a.date), 'MMM d, yyyy')}</span>
              {a.isImportant && <span className="ml-2 text-xs text-yellow-700 font-medium">Don't Miss!</span>}
            </div>
            <div className="absolute top-2 right-2">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-ping opacity-60" style={{ display: a.isImportant ? 'inline-block' : 'none' }} />
            </div>
          </div>
        ))}
      </div>
      {sorted.length === 0 && (
        <div className="text-center text-gray-400 text-lg mt-12">No announcements yet.</div>
      )}
    </DashboardLayout>
  );
}
