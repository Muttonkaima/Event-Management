"use client";

import DashboardLayout from '@/components/user/event-dashboard/DashboardLayout';
import { useState } from 'react';

export default function SupportPage() {
    const [submitted, setSubmitted] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // Here you would send support message to backend
    };

    return (
        <DashboardLayout title="Support">
            <div className="flex flex-col items-center justify-center w-full max-h-[calc(100vh-120px)] px-2 py-6">
                <div className="w-full max-w-xl flex flex-col items-center gap-2 mb-6 animate-fade-in">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-black">Event Support</h1>
                    <span className="text-base md:text-lg text-gray-500 text-center">Need help? Contact our team below.</span>
                </div>
                <div className="glass-card max-w-xl w-full mx-auto py-8 px-4 md:px-8 flex flex-col items-center shadow-2xl animate-fade-in-up">
                    {submitted ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="text-4xl">✅</div>
                            <div className="text-lg font-semibold text-green-600 text-center">Your request has been sent!</div>
                            <div className="text-gray-400 text-sm text-center">We'll get back to you as soon as possible.</div>
                        </div>
                    ) : (
                        <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="name" className="font-medium text-gray-700">Your Name</label>
                                <input
                                    id="name"
                                    className="rounded-xl border border-gray-200 bg-white p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="email" className="font-medium text-gray-700">Your Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    className="rounded-xl border border-gray-200 bg-white p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="message" className="font-medium text-gray-700">Message</label>
                                <textarea
                                    id="message"
                                    className="rounded-xl border border-gray-200 bg-white p-3 min-h-[100px] resize-y text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="Describe your issue or question..."
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="mt-2 px-5 py-3 rounded-xl bg-black text-white font-bold cursor-pointer"
                                disabled={!name || !email || !message}
                            >
                                Submit Request
                            </button>
                        </form>
                    )}
                </div>
            </div>
            <style>{`
        .glass-card {
          background: rgba(255,255,255,0.7);
          border-radius: 1rem;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.18);
          backdrop-filter: blur(12px);
          border: 1.5px solid rgba(255,255,255,0.18);
        }
        @media (max-width: 600px) {
          .glass-card { padding: 1.5rem 1.25rem; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in { animation: fade-in 0.7s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(36px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(.4,0,.2,1) both; }
      `}</style>
        </DashboardLayout>
    );
}
