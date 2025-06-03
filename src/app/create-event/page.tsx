"use client";

import Link from 'next/link';

export default function CreateEventPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h1>
        <p className="text-gray-600">This is the event creation page. The form will be implemented here.</p>
        <Link href="/events"> <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mt-6">Go Back</button></Link>
      </div>
    </div>
  );
}
