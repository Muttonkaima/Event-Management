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
            <div className="relative w-full min-h-[calc(100vh)] flex flex-col items-center justify-center px-2 py-6">
                {/* Hero Section */}
                <div className="w-full max-w-xl flex flex-col items-center gap-3 mb-8 animate-fade-in">
                    <div className="rounded-full bg-black p-4 mb-2 shadow-md">
                        <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636A9 9 0 115.636 18.364 9 9 0 0118.364 5.636z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.172 9.172a4 4 0 105.656 5.656 4 4 0 00-5.656-5.656z" /></svg>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center">Event Support</h1>
                    <span className="text-base md:text-lg text-gray-500 text-center font-medium">Need help? Contact our team or browse help options below.</span>
                </div>
                {/* Support Card */}
                <div className="modern-glass-card max-w-xl w-full mx-auto py-10 px-4 md:px-10 flex flex-col items-center shadow-2xl animate-fade-in-up">
                    {submitted ? (
                        <div className="flex flex-col items-center gap-5">
                            <svg className="w-16 h-16 text-green-400 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#e6fffa"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12l2 2l4-4"/></svg>
                            <div className="text-xl font-semibold text-green-700 text-center">Your request has been sent!</div>
                            <div className="text-gray-500 text-base text-center">We'll get back to you as soon as possible.</div>
                            <button
                                className="px-5 py-2 rounded-lg bg-black text-white font-semibold shadow hover:bg-black/80 transition-all cursor-pointer"
                                onClick={() => { setSubmitted(false); setName(''); setEmail(''); setMessage(''); }}
                            >Submit Another Request</button>
                        </div>
                    ) : (
                        <form className="w-full flex flex-col gap-7" onSubmit={handleSubmit}>
                            {/* Name Field with Floating Label */}
                            <div className="relative flex flex-col gap-2">
                                <input
                                    id="name"
                                    className="peer rounded-xl border border-black/10 bg-white/80 p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black placeholder-transparent transition-all"
                                    placeholder="Your Name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                    aria-label="Your Name"
                                />
                                <label htmlFor="name" className="absolute left-4 top-3 text-gray-500 text-base transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:left-4 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:left-3 peer-focus:text-xs peer-focus:text-black bg-white px-1 rounded">Your Name</label>
                            </div>
                            {/* Email Field with Floating Label */}
                            <div className="relative flex flex-col gap-2">
                                <input
                                    id="email"
                                    type="email"
                                    className="peer rounded-xl border border-black/10 bg-white/80 p-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black placeholder-transparent transition-all"
                                    placeholder="Your Email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    aria-label="Your Email"
                                />
                                <label htmlFor="email" className="absolute left-4 top-3 text-gray-500 text-base transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:left-4 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:left-3 peer-focus:text-xs peer-focus:text-black bg-white px-1 rounded">Your Email</label>
                            </div>
                            {/* Message Field with Floating Label */}
                            <div className="relative flex flex-col gap-2">
                                <textarea
                                    id="message"
                                    className="peer rounded-xl border border-black/10 bg-white/80 p-4 min-h-[100px] resize-y text-gray-900 focus:outline-none focus:ring-2 focus:ring-black placeholder-transparent transition-all"
                                    placeholder="Your Message"
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    required
                                    aria-label="Your Message"
                                />
                                <label htmlFor="message" className="absolute left-4 top-3 text-gray-500 text-base transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:left-4 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:left-3 peer-focus:text-xs peer-focus:text-black bg-white px-1 rounded">Your Message</label>
                            </div>
                            <button
                                type="submit"
                                className="mt-2 px-6 py-3 rounded-xl bg-black text-white font-bold shadow-lg hover:bg-black/80 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                                disabled={!name || !email || !message}
                            >
                                Submit Request
                            </button>
                        </form>
                    )}
                </div>
                {/* Help/Contact Section */}
                <div className="w-full max-w-xl mx-auto mt-12 flex flex-col items-center gap-4 animate-fade-in-up bg-white/70 rounded-2xl shadow p-6 border border-black/10">
                    <div className="flex items-center gap-2 text-black font-semibold text-lg">
                        <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636A9 9 0 115.636 18.364 9 9 0 0118.364 5.636z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.172 9.172a4 4 0 105.656 5.656 4 4 0 00-5.656-5.656z" /></svg>
                        Other ways to get help
                    </div>
                    <div className="text-gray-600 text-base text-center">Contact us at <a href="mailto:support@event.com" className="text-blue-500 underline hover:text-blue-500/80">support@event.com</a> or visit our <a href="#" className="text-blue-500 underline hover:text-blue-500/80">Help Center</a>. You can also check our <a href="#" className="text-blue-500 underline hover:text-blue-500/80">FAQ</a>.</div>
                </div>
            </div>
            <style>{`
        .modern-glass-card {
          background: rgba(255,255,255,0.85);
          border-radius: 1.5rem;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.18);
          backdrop-filter: blur(16px);
          border: 2px solid rgba(30,64,175,0.07);
        }
        @media (max-width: 600px) {
          .modern-glass-card { padding: 1.5rem 1.25rem; }
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
