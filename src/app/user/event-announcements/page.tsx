"use client";

import DashboardLayout from '@/components/user/event-dashboard/DashboardLayout';
import announcements from '@/data/user/eventAnnouncements.json';
import { format, parseISO } from 'date-fns';

export default function AnnouncementsPage() {
  // Parse and sort announcements (recent first)
  const sorted = [...announcements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <DashboardLayout title="Announcements">
      <div className="min-h-[90vh] py-8 px-2 md:px-8">
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Event Announcements</h1>
          <span className="text-blue-600 text-lg font-medium flex items-center gap-2"><svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Stay updated with the latest info</span>
        </div>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {sorted.map((a) => (
            <div
              key={a.id}
              className={`relative rounded-2xl bg-white/70 backdrop-blur-md shadow-xl border border-blue-100 p-7 flex flex-col gap-3 transition-all duration-300 hover:scale-[1.025] hover:shadow-2xl group min-h-[200px] overflow-hidden`}>
              <div className="flex items-center gap-2 mb-1">
                {a.isImportant && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gradient-to-r from-yellow-200 to-yellow-50 text-yellow-800 text-xs font-bold shadow animate-pulse mr-2 border border-yellow-300">
                    <svg className="h-4 w-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    Important
                  </span>
                )}
                <h2 className={`text-xl md:text-2xl font-semibold flex-1 ${a.isImportant ? 'text-yellow-800' : 'text-gray-900'} truncate`}>{a.title}</h2>
              </div>
              <p className="text-gray-700 text-base md:text-lg mb-2 flex-1 leading-relaxed">{a.content}</p>
              <div className="flex items-end justify-between mt-2">
                <span className="text-xs text-gray-500 font-medium flex items-center gap-1"><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3M16 7V3M4 11h16M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>{format(parseISO(a.date), 'MMM d, yyyy')}</span>
                {a.isImportant && <span className="ml-2 text-xs text-yellow-700 font-semibold uppercase tracking-wide">Don't Miss!</span>}
              </div>
              <div className="absolute top-4 right-4">
                {a.isImportant && <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 animate-ping opacity-70" />}
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-black transition-all duration-300"></div>
            </div>
          ))}
        </div>
        {sorted.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center text-gray-400 text-lg mt-16 gap-4">
            <svg className="w-16 h-16 text-blue-200 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <div>No announcements yet.</div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
