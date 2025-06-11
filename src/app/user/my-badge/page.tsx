"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiShare2, FiRotateCw, FiCheck } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import DashboardLayout from '@/components/user/event-dashboard/DashboardLayout';
import badgeData from '@/data/user/badge.json';

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
        color: el.style?.color || (el.type === 'text' ? '#1f2937' : undefined), // Default text color for better contrast
        backgroundColor: el.style?.backgroundColor,
        borderRadius: el.style?.borderRadius,
        display: 'flex',
        alignItems: 'center',
        justifyContent: el.style?.textAlign === 'center' ? 'center' : (el.style?.textAlign === 'right' ? 'flex-end' : 'flex-start'),
        overflow: 'hidden',
        padding: 0,
        transition: 'transform 0.2s ease, filter 0.2s ease',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
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
        return (
            <div key={el.id} style={{ ...style, background: el.style?.backgroundColor, borderRadius: el.style?.borderRadius }}>
                <img src='/images/qrcode.png' alt="QR Code" style={{ width: '100%', height: '100%', borderRadius: el.style?.borderRadius || 0, objectFit: 'contain', background: el.style?.backgroundColor }} />
            </div>
        );
    }
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
    const [isDownloading, setIsDownloading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [badgeTilt, setBadgeTilt] = useState({ x: 0, y: 0 });
    
    // Calculate responsive dimensions based on container width
    const [dimensions, setDimensions] = useState({
        width: Math.min(500, typeof window !== 'undefined' ? window.innerWidth - 40 : 500),
        height: 300
    });

    useEffect(() => {
        const handleResize = () => {
            const maxWidth = Math.min(badgeData.width, typeof window !== 'undefined' ? window.innerWidth - 40 : badgeData.width);
            const ratio = badgeData.height / badgeData.width;
            setDimensions({
                width: maxWidth,
                height: maxWidth * ratio
            });
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [badgeData.width, badgeData.height]);

    const handleDownload = async () => {
        if (!badgeRef.current || isDownloading) return;
        
        setIsDownloading(true);
        try {
            const canvas = await html2canvas(badgeRef.current, { 
                backgroundColor: badgeData.backgroundColor || '#fff', 
                useCORS: true,
                scale: 2 // For better quality on retina displays
            });
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `badge-${new Date().toISOString().slice(0, 10)}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Show success state
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error('Error downloading badge:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleShare = async () => {
        if (!badgeRef.current) return;
        
        try {
            const canvas = await html2canvas(badgeRef.current, { 
                backgroundColor: badgeData.backgroundColor || '#fff',
                useCORS: true 
            });
            const file = new File(
                [await (await fetch(canvas.toDataURL('image/png'))).blob()],
                'badge.png',
                { type: 'image/png' }
            );
            
            if (navigator.share && navigator.canShare?.({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'My Event Badge',
                    text: 'Check out my event badge!',
                });
            } else {
                // Fallback for browsers that don't support sharing files
                handleDownload();
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!badgeRef.current) return;
        
        const rect = badgeRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        setBadgeTilt({
            x: -y * 10, // Rotate on X axis based on Y position
            y: x * 10   // Rotate on Y axis based on X position
        });
    };

    const handleMouseLeave = () => {
        setBadgeTilt({ x: 0, y: 0 });
    };

    return (
        <DashboardLayout title="My Badge">
            <div className="min-h-[calc(100vh-80px)] w-full bg-transparent">
                <div className="container mx-auto px-4 py-12 sm:py-16">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl sm:text-5xl font-bold text-black mb-3">
                            My Badge
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Your all-access pass to the event. Show it at the entrance for a seamless check-in experience.
                        </p>
                    </motion.div>

                    <div 
                        className="flex flex-col  lg:flex-row items-center justify-center gap-16 lg:gap-12"
                        style={{
                            '--badge-width': badgeData.width + 'px',
                            '--badge-height': badgeData.height + 'px',
                            '--badge-bg': badgeData.backgroundColor,
                            '--badge-aspect-ratio': `${badgeData.width} / ${badgeData.height}`
                        } as React.CSSProperties}
                    >
                        <motion.div 
                            className="relative w-full max-w-md mr-12"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            style={{
                                perspective: '1000px',
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            <motion.div
                                ref={badgeRef}
                                className="relative rounded-2xl overflow-hidden shadow-2xl border"
                                style={{
                                    width: badgeData.width,
                                    height: badgeData.height,
                                    aspectRatio: `${badgeData.width}/${badgeData.height}`,
                                    backgroundColor: badgeData.backgroundColor,
                                    transform: `rotateX(${badgeTilt.x}deg) rotateY(${badgeTilt.y}deg)`,
                                    transition: 'transform 0.1s ease-out, background-color 0.3s ease',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                                }}
                            >
                                {badgeData.elements?.map(renderBadgeElement)}
                            </motion.div>
                        </motion.div>

                        <div className="w-full max-w-md space-y-1">
                            <motion.div 
                                className="bg-white rounded-2xl p-6 shadow-md border border-gray-100"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Badge Ready!</h2>
                                <p className="text-gray-600 mb-2">
                                    Your event badge is ready to use. Download it to your device or share it with your friends.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={handleDownload}
                                        disabled={isDownloading}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all cursor-pointer ${
                                            isDownloading 
                                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                                : 'bg-black text-white'
                                        }`}
                                    >
                                        {isDownloading ? (
                                            <>
                                                <FiRotateCw className="animate-spin w-5 h-5" />
                                                <span>Downloading...</span>
                                            </>
                                        ) : isCopied ? (
                                            <>
                                                <FiCheck className="w-5 h-5 text-green-500" />
                                                <span>Downloaded!</span>
                                            </>
                                        ) : (
                                            <>
                                                <FiDownload className="w-5 h-5" />
                                                <span>Download Badge</span>
                                            </>
                                        )}
                                    </motion.button>
                                    
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={handleShare}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium bg-white text-gray-700 border cursor-pointer border-gray-200 hover:bg-gray-50 transition-all"
                                    >
                                        <FiShare2 className="w-5 h-5" />
                                        <span>Share</span>
                                    </motion.button>
                                </div>
                            </motion.div>
                            
                            <motion.div 
                                className="p-4 rounded-xl border"
                                style={{
                                    backgroundColor: `${badgeData.backgroundColor}20`,
                                    borderColor: `${badgeData.backgroundColor}40`,
                                    color: badgeData.backgroundColor
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex-shrink-0">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                            <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="mt-1 text-sm text-blue-700">
                                            Make sure to save your badge to your device or take a screenshot for easy access during the event.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
