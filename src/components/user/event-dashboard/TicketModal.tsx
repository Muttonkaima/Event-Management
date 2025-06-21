"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import Image from "next/image";
import html2canvas from "html2canvas";
import { useRef } from "react";

interface TicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: any;
  ticket: any;
  user: any;
  colorTheme: any;
  fontStyle: any;
  logoUrl?: string;
 bannerUrl?: string;
}

const TicketModal: React.FC<TicketModalProps> = ({
  open,
  onOpenChange,
  event,
  ticket,
  user,
  colorTheme,
  fontStyle,
  logoUrl,
 bannerUrl,
}) => {
  const ticketRef = useRef<HTMLDivElement>(null);

  // Utility to replace oklch() colors with #222 or #fff
  function replaceOklchWithFallback(element: HTMLElement) {
    const all = element.querySelectorAll('*');
    all.forEach(el => {
      const style = getComputedStyle(el as HTMLElement);
      // Replace background-color
      if (style.backgroundColor.startsWith('oklch')) {
        (el as HTMLElement).style.backgroundColor = '#fff';
      }
      // Replace color
      if (style.color.startsWith('oklch')) {
        (el as HTMLElement).style.color = '#222';
      }
      // Replace border color
      if (style.borderColor && style.borderColor.startsWith('oklch')) {
        (el as HTMLElement).style.borderColor = '#ddd';
      }
    });
  }

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    // Hide Close and Download buttons before capture
    const buttons = ticketRef.current.querySelectorAll('.hide-for-pdf');
    const prevDisplay: string[] = [];
    buttons.forEach((btn, i) => {
      prevDisplay[i] = (btn as HTMLElement).style.display;
      (btn as HTMLElement).style.display = 'none';
    });

    // Fix oklch colors before capture
    replaceOklchWithFallback(ticketRef.current);
    // Capture the ticket as an image
    const canvas = await html2canvas(ticketRef.current, { backgroundColor: null, useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    // Restore buttons after capture
    buttons.forEach((btn, i) => {
      (btn as HTMLElement).style.display = prevDisplay[i] || '';
    });

    // Download as PNG
    const link = document.createElement('a');
    link.href = imgData;
    link.download = 'ticket.png';
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-xl w-full max-h-[calc(90vh)] p-0 rounded-2xl overflow-auto shadow-2xl ${fontStyle.className} bg-white border-3 border-white`}>
  <div ref={ticketRef} id="ticket-modal-content" className="bg-white">

        {bannerUrl && (
          <div className="w-full h-32 relative">
            <Image src={bannerUrl} alt="Event Banner" fill className="object-cover w-full h-full" />
          </div>
        )}
        <DialogHeader className="flex flex-col items-center justify-center pt-4 pb-2 px-6">
          {logoUrl && (
            <div className="w-20 h-20 mb-2 relative">
              <Image src={logoUrl} alt="Event Logo" fill className="object-contain rounded-full border-2 border-gray-300 bg-white" />
            </div>
          )}
          <DialogTitle className={`text-2xl font-bold mb-1 bg-black rounded-2xl p-2`}>{event.name}</DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mb-2 text-center">{event.description}</DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-4 flex flex-col gap-2">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <div>
              <div className="font-semibold text-base text-gray-700">Ticket: <span className="font-normal">{ticket.name}</span></div>
              <div className="text-gray-500 text-sm">Type: {ticket.type === 'paid' ? `Paid (${ticket.currency} ${ticket.price})` : 'Free'}</div>
              <div className="text-gray-500 text-sm">Order ID: {ticket.id}</div>
              <div className="text-gray-500 text-sm">Purchase Date: {ticket.purchaseDate ? new Date(ticket.purchaseDate).toLocaleString() : '-'}</div>
            </div>
            <div className="flex flex-col items-end">
              <div className="font-semibold text-base text-gray-700">{event.startDate} {event.startTime}</div>
              <div className="text-gray-500 text-sm">{event.address}, {event.city}</div>
              <div className="text-gray-500 text-sm">{event.state}, {event.country} {event.zipCode}</div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mt-2">
            <div className="text-gray-600 text-sm">Check-in Status: <span className={user.checkInStatus ? 'text-green-600' : 'text-yellow-600'}>{user.checkInStatus ? 'Checked In' : 'Not Checked In'}</span></div>
            {ticket.qrCode && (
              <div className="flex flex-col items-center">
                <Image src={ticket.qrCode} alt="QR Code" width={80} height={80} className="rounded bg-gray-100 border p-1" />
                <span className="text-xs text-gray-400">Scan at entry</span>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="bg-gray-50 p-4 flex gap-2 justify-between items-center border-t">
          
          <DialogClose asChild>
            <button className="px-4 py-2 rounded border border-gray-200 bg-transparent text-gray-700 font-medium hover:bg-white transition-all cursor-pointer hide-for-pdf">Close</button>
          </DialogClose>
          <button onClick={handleDownload} className={`px-4 py-2 rounded bg-black text-white font-semibold shadow transition-all cursor-pointer hide-for-pdf`}>Download Ticket</button>
        </DialogFooter>
      </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketModal;
