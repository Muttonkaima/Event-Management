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
      <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-120px)] px-2 py-6">
        <div className="w-full max-w-xl flex flex-col items-center gap-2 mb-6 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-black">Event Feedback</h1>
          <span className="text-base md:text-lg text-gray-500 text-center">We value your feedback to improve future events!</span>
        </div>
        <div className="glass-card max-w-xl w-full mx-auto py-8 px-4 md:px-8 flex flex-col items-center shadow-2xl animate-fade-in-up">
          {submitted ? (
            <div className="flex flex-col items-center gap-4">
              <div className="text-4xl">🎉</div>
              <div className="text-lg font-semibold text-green-600 text-center">Thank you for your feedback!</div>
              <div className="text-gray-400 text-sm text-center">We appreciate your input.</div>
            </div>
          ) : (
            <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700">How would you rate the event?</label>
                <div className="flex gap-2 mt-1">
                  {[1,2,3,4,5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`text-3xl transition-all ${rating && star <= rating ? 'text-yellow-400 scale-110' : 'text-gray-300 hover:text-yellow-400'} cursor-pointer`}
                      onClick={() => setRating(star)}
                      aria-label={`Rate ${star} star${star>1?'s':''}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="feedback" className="font-medium text-gray-700">Your Feedback</label>
                <textarea
                  id="feedback"
                  className="rounded-xl border border-gray-200 bg-white p-3 min-h-[100px] resize-y text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Share your thoughts, suggestions, or issues..."
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-2 px-5 py-3 rounded-xl bg-black text-white font-bold transition-all duration-200 cursor-pointer"
                disabled={rating === null || feedback.length < 3}
              >
                Submit Feedback
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
