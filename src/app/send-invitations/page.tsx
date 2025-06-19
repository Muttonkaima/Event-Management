"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import OverviewLayout from "@/components/event-dashboard/OverviewLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getEventById } from "@/services/organization/eventService";
import { toast } from "@/hooks/use-toast";

// Dynamically import EmailPreview for SSR safety
const EmailPreview = dynamic(() => import("@/components/email/EmailPreview").then(mod => mod.EmailPreview), { ssr: false });

// Utility: Parse CSV/Excel (basic, for demo; use papaparse/xlsx for production)
function parseEmailsFromText(text: string): string[] {
  return text
    .split(/[\n,;\s]+/)
    .map(e => e.trim())
    .filter(e => e && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e));
}

export default function SendInvitationsPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id") || "";

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState<string[]>([]);
  const [singleEmail, setSingleEmail] = useState("");
  const [bulkEmails, setBulkEmails] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch event data
  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    getEventById(eventId)
      .then(res => {
        setEvent(res?.data);
      })
      .catch(() => toast({ title: "Failed to fetch event data", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [eventId]);

  // Handlers
  const handleAddSingleEmail = () => {
    if (singleEmail && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(singleEmail) && !emails.includes(singleEmail)) {
      setEmails(prev => [...prev, singleEmail]);
      setSingleEmail("");
    }
  };
  const handleBulkAdd = () => {
    const newEmails = parseEmailsFromText(bulkEmails).filter(e => !emails.includes(e));
    setEmails(prev => [...prev, ...newEmails]);
    setBulkEmails("");
  };
  const handleRemoveEmail = (email: string) => {
    setEmails(prev => prev.filter(e => e !== email));
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      const newEmails = parseEmailsFromText(text).filter(e => !emails.includes(e));
      setEmails(prev => [...prev, ...newEmails]);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Prepare email template blocks for preview
  const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL || "";
  const emailBlocks = event?.email_template_id?.email_fields?.map((block: any) => {
    if (block.type === "image" && block.properties?.imageUrl && !/^https?:\/\//.test(block.properties.imageUrl)) {
      return {
        id: block._id,
        type: block.type,
        properties: {
          ...block.properties,
          imageUrl: `${ASSETS_URL}${block.properties.imageUrl}`,
        },
      };
    }
    return {
      id: block._id,
      type: block.type,
      properties: block.properties,
    };
  }) || [];


  return (
    <OverviewLayout title="Send Invitations" eventId={eventId}>
      <div className="flex flex-col md:flex-row gap-8 w-full">
        {/* Left: Add Emails */}
        <div className="md:w-1/2 w-full bg-white rounded-2xl shadow-sm p-6 border border-gray-200 flex flex-col gap-6">
          <h2 className="text-xl font-semibold mb-2 text-black">Add Recipient Emails</h2>
          {/* Single email */}
          <div className="flex gap-2 items-center">
            <Input
              type="email"
              placeholder="Enter email address"
              value={singleEmail}
              onChange={e => setSingleEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAddSingleEmail()}
              className="flex-1"
            />
            <Button type="button" onClick={handleAddSingleEmail} className="bg-black cursor-pointer text-white" variant="default">Add</Button>
          </div>
          {/* Bulk emails */}
          <div>
            <Textarea
              placeholder="Paste multiple emails (comma, space, or newline separated)"
              value={bulkEmails}
              onChange={e => setBulkEmails(e.target.value)}
              rows={3}
            />
            <Button type="button" onClick={handleBulkAdd} className="mt-2 bg-black cursor-pointer text-white" variant="secondary">Add Bulk</Button>
          </div>
          {/* CSV/Excel upload */}
          <div>
            <input
              type="file"
              accept=".csv,.txt"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 hover:file:bg-gray-200 file:cursor-pointer"
            />
            <span className="text-xs text-gray-400">Upload CSV or TXT file with emails (one per line or comma separated)</span>
          </div>
          {/* Email list */}
          <div>
            <h3 className="font-medium mb-1 text-gray-700">Emails to Invite ({emails.length})</h3>
            <div className="flex flex-wrap gap-2">
              {emails.map(email => (
                <span key={email} className="inline-flex items-center bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm font-medium">
                  {email}
                  <button
                    className="ml-2 text-red-500 hover:text-red-700 text-xs"
                    onClick={() => handleRemoveEmail(email)}
                    type="button"
                  >
                    ×
                  </button>
                </span>
              ))}
              {emails.length === 0 && <span className="text-gray-400">No emails added yet.</span>}
            </div>
          </div>
        </div>
        {/* Right: Email Template Preview */}
        <div className="md:w-1/2 w-full">
          {loading ? (
            <div className="flex items-center justify-center h-72 text-gray-400">Loading...</div>
          ) : event && emailBlocks.length > 0 ? (
            <div className="max-w-2xl mx-auto h-[590px] overflow-y-auto rounded-xl bg-white shadow border border-gray-100 flex flex-col">
                <h2 className="text-xl font-semibold text-black text-center bg-transparent p-6">Email Template Preview</h2>
              <EmailPreview
                blocks={emailBlocks}
                selectedBlockId={emailBlocks[0]?.id || ""}
                onSelectBlock={() => {}}
                onDeleteBlock={() => {}}
                onAddBlock={() => {}}
                onExportTemplate={() => {}}
                readonly={true}
              />
            </div>
          ) : (
            <div className="text-gray-400">No email template found for this event.</div>
          )}
        </div>
      </div>
    </OverviewLayout>
  );
}
