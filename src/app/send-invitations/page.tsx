"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import OverviewLayout from "@/components/event-dashboard/OverviewLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getEventById, sendEventInvitation } from "@/services/organization/eventService";
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
  const [sending, setSending] = useState(false);
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
            {/* Send Invitations Button */}
            {emails.length > 0 && (
              <Button
                type="button"
                className="mt-4 bg-black text-white font-semibold w-full cursor-pointer"
                disabled={sending}
                onClick={async () => {
                  setSending(true);
                  try {
                    const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL || "";
                    const fields = event?.email_template_id?.email_fields || [];
                    const templateHtml = `
                    <div style="
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      margin: 0 auto;
      max-width: 600px;
      border: 1px solid #e0e0e0;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
      padding: 32px;
      border-radius: 16px;
      background-color: #ffffff;
      color: #222;
                    ">
                      ${fields.map((block: any) => {
                      const p = block.properties || {};
                      if (block.type === "header") {
                        return `<div style="text-align:${p.textAlignment || "center"}; font-size:${p.fontSize || 24}px; font-weight:${p.fontWeight || "700"}; padding:${p.padding || 20}px 0;">${p.headerText || ""}</div>`;
                      }
                      else if (block.type === "text") {
                        return `<div style="text-align:${p.textAlignment || "left"}; font-size:${p.fontSize || 16}px; font-weight:${p.fontWeight || "400"}; line-height:1.5; padding:${p.padding || 16}px 0;">${p.textContent || ""}</div>`;
                      }
                      else if (block.type === "image") {
                        let url = p.imageUrl || "";
                        if (url && !/^https?:\/\//.test(url)) {
                          url = ASSETS_URL + url;
                        }
                        return `<div style="text-align:center; padding:${p.padding || 16}px 0;"><img src="${url}" alt="" style="max-width:100%; border-radius:${p.borderRadius || 8}px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" /></div>`;
                      }
                      else if (block.type === "button") {
                        return `
                            <div style="text-align:center; padding:${p.padding || 16}px 0;">
                              <a
                                href="{{JOIN_LINK}}"
                                style="
                                  background-color: ${p.backgroundColor || "#007BFF"};
                                  color: ${p.textColor || "#fff"};
                                  padding: 12px 28px;
                                  font-size: ${p.fontSize || 16}px;
                                  font-weight: ${p.fontWeight || "600"};
                                  text-decoration: none;
                                  border-radius: ${p.borderRadius || 6}px;
                                  display: inline-block;
                                  box-shadow: 0 4px 12px rgba(0,123,255,0.4);
                                "
                              >
                                ${p.buttonText || "Join Event"}
                              </a>
                            </div>
                          `;
                      }
                      return "";
                    }).join("")}
                    </div>
                  `;


                    console.log('template html ----', templateHtml);
                    console.log('emails ----', emails);
                    console.log('event id ----', eventId);
                    await sendEventInvitation(eventId, emails, templateHtml);
                    window.location.reload();
                    toast({ title: `Invitations sent to ${emails.length} recipients.`, variant: "default" });

                  } catch (err: any) {
                    toast({ title: err.message || "Failed to send invitations", variant: "destructive" });
                    setSending(false);
                  }
                }}
              >
                {sending ? "Sending..." : "Send Invitations"}
              </Button>
            )}
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
                onSelectBlock={() => { }}
                onDeleteBlock={() => { }}
                onAddBlock={() => { }}
                onExportTemplate={() => { }}
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
