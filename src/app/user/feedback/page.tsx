"use client";

import DashboardLayout from '@/components/user/event-dashboard/DashboardLayout';
import { useState } from 'react';

export default function FeedbackPage() {
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send feedback to backend
  };

  return (
    <DashboardLayout title="Feedback">
      <div className="relative w-full max-h-[calc(100vh-120px)] flex flex-col items-center justify-center px-2 py-6">
        {/* Hero Section */}
        <div className="w-full max-w-xl flex flex-col items-center gap-3 mb-8 animate-fade-in">
          <div className="rounded-full bg-black p-4 mb-2 shadow-md">
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2M15 3h-6a2 2 0 00-2 2v4a2 2 0 002 2h6a2 2 0 002-2V5a2 2 0 00-2-2z" /></svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center">Event Feedback</h1>
          <span className="text-base md:text-lg text-gray-500 text-center font-medium">We value your feedback to improve future events!</span>
        </div>
        {/* Feedback Card */}
        <div className="modern-glass-card max-w-xl w-full mx-auto py-10 px-4 md:px-10 flex flex-col items-center shadow-2xl animate-fade-in-up">
          {submitted ? (
            <div className="flex flex-col items-center gap-5">
              <svg className="w-16 h-16 text-green-400 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#e6fffa"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12l2 2l4-4"/></svg>
              <div className="text-xl font-semibold text-green-700 text-center">Thank you for your feedback!</div>
              <div className="text-gray-500 text-base text-center">We appreciate your input and will use it to improve future events.</div>
              <button
                className="px-5 py-2 rounded-lg bg-black text-white font-semibold shadow hover:bg-black/80 transition-all cursor-pointer"
                onClick={() => { setSubmitted(false); setRating(null); setFeedback(''); }}
              >Submit More Feedback</button>
            </div>
          ) : (
            <form className="w-full flex flex-col gap-7" onSubmit={handleSubmit}>
              {/* Rating */}
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700">How would you rate the event?</label>
                <div className="flex gap-2 mt-1">
                  {[1,2,3,4,5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`text-3xl transition-all duration-200 ${rating && star <= rating ? 'text-yellow-400 scale-110' : 'text-gray-300 hover:text-yellow-400 scale-100'} cursor-pointer rounded-full relative`}
                      onClick={() => setRating(star)}
                      aria-label={`Rate ${star} star${star>1?'s':''}`}
                    >
                      ★
                      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 pointer-events-none">
                        {star === 1 ? 'Very Bad' : star === 2 ? 'Bad' : star === 3 ? 'Okay' : star === 4 ? 'Good' : 'Excellent'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Feedback Textarea with Floating Label */}
              <div className="relative flex flex-col gap-2">
                <textarea
                  id="feedback"
                  className="peer rounded-xl border border-black/10 bg-white/80 p-4 min-h-[100px] resize-y text-gray-900 focus:outline-none focus:ring-2 focus:ring-black placeholder-transparent transition-all"
                  placeholder="Your feedback..."
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  required
                  aria-label="Your Feedback"
                />
                <label htmlFor="feedback" className="absolute left-4 top-3 text-gray-500 text-base transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:left-4 peer-placeholder-shown:text-base peer-focus:-top-3 peer-focus:left-3 peer-focus:text-xs peer-focus:text-black bg-white px-1 rounded">Your Feedback</label>
              </div>
              <button
                type="submit"
                className="mt-2 px-6 py-3 rounded-xl bg-black text-white font-bold shadow-lg hover:bg-black/80 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={rating === null || feedback.length < 3}
              >
                Submit Feedback
              </button>
            </form>
          )}
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
