"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText, X as XIcon, Edit3, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import badgeData from "@/data/organizer/badge.json";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader as DialogHeaderUI,
  DialogTitle as DialogTitleUI,
  DialogClose,
} from "@/components/ui/dialog";
import { FiAward, FiSearch } from "react-icons/fi";

function renderBadgeElement(element: any) {
  // Dynamically render badge elements based on their type and properties
  const { type, x, y, width, height, content, style = {} } = element;
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: x,
    top: y,
    width,
    height,
    ...style,
    display: "flex",
    alignItems: "center",
    justifyContent: style.textAlign || "center",
    overflow: "hidden",
    background: style.backgroundColor || "transparent",
    color: style.color || undefined,
    fontSize: style.fontSize || undefined,
    fontWeight: style.fontWeight || undefined,
    borderRadius: style.borderRadius || 0,
    textAlign: style.textAlign || "center",
  };
  switch (type) {
    case "attendee-name":
    case "attendee-role":
    case "event-date":
    case "event-location":
      return (
        <div key={element.id} style={baseStyle}>
          {content}
        </div>
      );
    case "attendee-photo":
      return (
        <img
          key={element.id}
          src={style.imageUrl || content}
          alt="Attendee"
          style={{ ...baseStyle, objectFit: "cover", borderRadius: style.borderRadius || 8 }}
        />
      );
    case "event-logo":
      return (
        <img
          key={element.id}
          src={style.imageUrl || content}
          alt="Event Logo"
          style={{ ...baseStyle, objectFit: "contain" }}
        />
      );
    case "qr-code":
      // This can be replaced with a QR generator if needed
      return (
        <div key={element.id} style={baseStyle}>
          <span style={{ fontSize: style.fontSize || 20, color: style.color || "#000" }}>QR</span>
        </div>
      );
    default:
      return (
        <div key={element.id} style={baseStyle}>
          {content}
        </div>
      );
  }
}

const BadgeCard: React.FC<{ badge: any; onPreview: () => void }> = ({ badge, onPreview }) => {
  // Find a preview image if available, else use logo or photo
  const previewImg = badge.elements.find((el: any) => el.type === "event-logo" || el.type === "attendee-photo");
  const previewUrl = previewImg?.style?.imageUrl || previewImg?.content || undefined;
  const exportDate = badge.exportedAt ? new Date(badge.exportedAt).toLocaleDateString() : "";
  return (
    <div
      className="relative group mt-6 rounded-2xl bg-gradient-to-br from-pink-50 via-white to-blue-50 shadow-lg border border-gray-100 border-b-5 border-b-black hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-visible cursor-pointer"
      onClick={e => {
        e.stopPropagation();
        onPreview();
      }}
    >x
      {/* Floating Preview Image */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20 flex justify-center w-full">
        <div className="rounded-full bg-white/80 shadow-lg ring-4 ring-pink-100 group-hover:ring-blue-200 transition-all duration-300 p-1">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Badge Preview"
              className="object-cover w-20 h-20 rounded-full"
              draggable={false}
            />
          ) : (
            <FileText className="w-12 h-12 text-gray-300" />
          )}
        </div>
      </div>
      {/* Card Content */}
      <div className="pt-16 pb-4 px-5 flex flex-col items-center text-center bg-white/60 backdrop-blur-md rounded-2xl min-h-[220px]">
        <div className="flex flex-col gap-1 w-full">
          <h3 className="font-bold text-lg text-gray-900 truncate w-full mb-1">{badge.name}</h3>
          <div className="flex flex-wrap justify-center gap-2 mb-2">
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-40">
              <button
                className="h-8 w-8 flex items-center justify-center rounded-full bg-white/80 shadow hover:bg-blue-50 text-blue-600 border border-blue-100"
                title="Edit"
                tabIndex={-1}
                onClick={e => {
                  e.stopPropagation();
                  alert('Editing functionality is coming soon');
                }}
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                className="h-8 w-8 flex items-center justify-center rounded-full bg-white/80 shadow hover:bg-red-50 text-red-600 border border-red-100"
                title="Delete"
                tabIndex={-1}
                onClick={e => {
                  e.stopPropagation();
                  alert('Delete functionality is coming soon');
                }}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {/* Meta info chips */}
            {badge.width && badge.height && (
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium shadow-sm border border-blue-200">
                {badge.width}×{badge.height}
              </span>
            )}
            {exportDate && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium shadow-sm border border-gray-200">
                {exportDate}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 line-clamp-2 mb-2">
            {badge.elements && badge.elements.length > 0
              ? `${badge.elements.length} element${badge.elements.length > 1 ? "s" : ""}`
              : "No elements"}
          </span>
        </div>
        {/* Actions: visible on hover/always on mobile */}
        <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 sm:opacity-100">

          <Button
            size="sm"
            className="bg-white hover:bg-black hover:text-white text-black cursor-pointer shadow-sm"
            onClick={e => {
              e.stopPropagation();
              alert("Use functionality coming soon!");
            }}
          >
            <FiAward className="mr-2 h-4 w-4" /> Use Badge
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const handleNewBadge = () => {
    window.location.href = "/badge-designer/builder";
  };

  // Support for multiple badges in future
  const badges = useMemo(() => (badgeData ? [badgeData] : []), []);
  const filteredBadges = badges.filter(badge =>
    badge.name.toLowerCase().includes(searchQuery.toLowerCase())
  ); // Add search/filter logic if needed

  return (
    <DashboardLayout title="Badges">
      <div className="max-w-6xl p-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl text-gray-900 font-bold tracking-tight mb-1">Badge Templates</h1>
            <p className="text-gray-500">Manage and create your badge templates with ease.</p>
          </div>
          <Button onClick={handleNewBadge} size="lg" className="bg-black hover:bg-black/90 text-white cursor-pointer">
            <Plus className="mr-1 h-5 w-5" /> Create New Badge Template
          </Button>
        </div>
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-gray-700" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 text-gray-700 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-sm"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredBadges.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-lg flex flex-col items-center justify-center min-h-[400px] bg-card text-gray-500">
            <FileText className="h-20 w-20 text-muted-foreground/50 mb-6" />
            <h3 className="text-2xl font-semibold mb-2">No Badges Found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {searchQuery
                ? `Your search for "${searchQuery}" did not match any badges. Try a different term or clear the search.`
                : "You haven't created any badges yet. Let's get started!"}
            </p>
            <Button onClick={handleNewBadge} size="lg">
              <Plus className="mr-2 h-5 w-5" /> Create Your First Badge
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredBadges.map((badge, idx) => (
              <BadgeCard key={badge.name + idx} badge={badge} onPreview={() => setOpenIdx(idx)} />
            ))}
          </div>
        )}
        {/* Modal for badge preview */}
        <Dialog open={openIdx !== null} onOpenChange={v => !v && setOpenIdx(null)}>
          <DialogContent className="max-w-3xl w-[90vw] h-[90vh] p-0 flex flex-col bg-white shadow-2xl rounded-xl overflow-hidden">
            {openIdx !== null && filteredBadges[openIdx] && (
              <>
                {/* Sticky Header */}
                <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10 gap-2">
                  <DialogHeaderUI>
                    <DialogTitleUI className="text-xl font-semibold truncate pr-8 text-gray-900">
                      {filteredBadges[openIdx].name}
                    </DialogTitleUI>
                  </DialogHeaderUI>
                  <DialogClose asChild>
                    <Button variant="ghost" size="icon" className="rounded-full text-gray-500 cursor-pointer">
                      <XIcon className="h-5 w-5" />
                    </Button>
                  </DialogClose>
                </div>
                {/* Scrollable Content Area with Badge Preview */}
                <ScrollArea className="flex-grow relative bg-gray-50 flex items-center justify-center">
                  <div
                    className="relative mx-auto my-8 border border-gray-300 shadow-lg rounded-2xl"
                    style={{
                      width: filteredBadges[openIdx].width || 350,
                      height: filteredBadges[openIdx].height || 220,
                      background: filteredBadges[openIdx].backgroundColor || "#fff",
                    }}
                  >
                    {(filteredBadges[openIdx].elements || []).map(renderBadgeElement)}
                  </div>
                </ScrollArea>
                {/* Sticky Footer */}
                <div className="p-4 border-t flex justify-end gap-2 sticky bottom-0 bg-white z-10">
                  <Button
                    variant="outline"
                    onClick={() => alert("Edit functionality coming soon!")}
                    className="text-gray-900 border border-gray-300 cursor-pointer bg-white hover:bg-gray-50"
                  >
                    <Edit3 className="mr-2 h-4 w-4" /> Edit Badge
                  </Button>
                  <Button
                    onClick={() => alert("Use functionality coming soon!")}
                    className="bg-black hover:bg-black/90 text-white cursor-pointer"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Use Badge
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}