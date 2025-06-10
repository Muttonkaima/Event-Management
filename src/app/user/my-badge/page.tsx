"use client";

import DashboardLayout from '@/components/user/event-dashboard/DashboardLayout';
import badgeData from '@/data/user/badge.json';
import html2canvas from 'html2canvas';
import { useRef } from 'react';

function renderBadgeElement(el: any) {
    const style: React.CSSProperties = {
        position: 'absolute',
        left: el.x,
        top: el.y,
        width: typeof el.width === 'number' ? el.width : undefined,
        height: typeof el.height === 'number' ? el.height : undefined,
        fontSize: el.style?.fontSize,
        fontWeight: el.style?.fontWeight,
        textAlign: el.style?.textAlign,
        color: el.style?.color,
        backgroundColor: el.style?.backgroundColor,
        borderRadius: el.style?.borderRadius,
        display: 'flex',
        alignItems: 'center',
        justifyContent: el.style?.textAlign === 'center' ? 'center' : (el.style?.textAlign === 'right' ? 'flex-end' : 'flex-start'),
        overflow: 'hidden',
        padding: 0,
    };

    if (el.type === 'attendee-photo' && el.style?.imageUrl) {
        return (
            <div key={el.id} style={style}>
                <img
                    src={el.style.imageUrl}
                    alt="Attendee Photo"
                    style={{ width: '100%', height: '100%', borderRadius: el.style?.borderRadius || 0, objectFit: 'cover', background: el.style?.backgroundColor }}
                />
            </div>
        );
    }
    if (el.type === 'event-logo' && el.style?.imageUrl) {
        return (
            <div key={el.id} style={style}>
                <img
                    src={el.style.imageUrl}
                    alt="Event Logo"
                    style={{ width: '100%', height: '100%', borderRadius: el.style?.borderRadius || 0, objectFit: 'contain', background: el.style?.backgroundColor }}
                />
            </div>
        );
    }
    if (el.type === 'qr-code') {
        // Replace with QR code image if available; fallback to box with content
        return (
            <div key={el.id} style={{ ...style, background: el.style?.backgroundColor, borderRadius: el.style?.borderRadius }}>
                {/* You can replace this with a QR code generator if you want */}
                <span style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', color: el.style?.color, fontSize: el.style?.fontSize }}>QR</span>
            </div>
        );
    }
    // Default: text element
    return (
        <div key={el.id} style={style}>{el.content}</div>
    );
}

// TypeScript: allow window.confetti if present
declare global {
    interface Window {
        confetti?: () => void;
    }
}

export default function MyBadgePage() {
    const badgeRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!badgeRef.current) return;
        const canvas = await html2canvas(badgeRef.current, { backgroundColor: badgeData.backgroundColor || '#fff', useCORS: true });
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'my-badge.png';
        link.click();
    };

    return (
        <DashboardLayout title="My Badge">
            <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-120px)] px-2 py-6">
                {/* Modern Header */}
                <div className="w-full max-w-2xl flex flex-col items-center gap-2 mb-6 animate-fade-in">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-black tracking-tight">Your Event Badge</h1>
                    <span className="text-base md:text-lg text-gray-500 dark:text-gray-500 text-center">Show this badge at the event for entry & networking</span>
                </div>

                {/* Glassmorphic Card */}
                <div className="relative w-full flex flex-col items-center">
                    <div className="glass-card max-w-[540px] w-full mx-auto px-1 py-6 md:py-8 flex flex-col items-center shadow-2xl animate-fade-in-up">
                        {/* Download Button */}

                        {/* Badge Display (unchanged) */}
                        <div className="flex justify-center items-center w-full">
                            <div
                                ref={badgeRef}
                                style={{
                                    position: 'relative',
                                    width: badgeData.width,
                                    height: badgeData.height,
                                    background: badgeData.backgroundColor || '#fff',
                                    borderRadius: 16,
                                    boxShadow: '0 6px 32px 0 rgba(50,50,93,.12)',
                                    overflow: 'hidden',
                                    maxWidth: '100%',
                                    maxHeight: '80vw',
                                    margin: '0 auto',
                                }}
                            >
                                {badgeData.elements?.map(renderBadgeElement)}
                            </div>
                        </div>
                        <button
                            onClick={async () => {
                                await handleDownload();
                                // Show confetti!
                                if (typeof window !== 'undefined' && window.confetti) window.confetti();
                            }}
                            className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-black focus:ring-offset-2 mt-6 cursor-pointer"
                        >
                            <svg className="w-5 h-5 mr-1 group-hover:animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg>
                            Download Badge
                        </button>
                        {/* Mobile Info */}
                        <div className="mt-8 w-full text-center text-sm text-gray-400 md:hidden animate-fade-in">
                            Tip: Tap the download button to save your badge for easy access at the event!
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
        .glass-card {
          background: rgba(255,255,255,0.7);
          border-radius: 2rem;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18);
          backdrop-filter: blur(12px);
          border: 1.5px solid rgba(255,255,255,0.18);
        }
        @media (max-width: 600px) {
          .glass-card { padding: 1.5rem 0.25rem; }
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
