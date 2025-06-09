"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Edit3, Trash2, Smartphone, Tablet, Monitor, Palette, X as XIcon } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import emailTemplateFromFile from "@/data/organizer/email.json"; // Import the single template from email.json
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader as DialogHeaderUI,
  DialogTitle as DialogTitleUI,
  DialogClose,
} from "@/components/ui/dialog";
import { FiSearch } from "react-icons/fi";

const templates = emailTemplateFromFile ? [emailTemplateFromFile] : [];

function renderBlock(block: any) {
  const { type, properties } = block;
  switch (type) {
    case "header":
      return (
        <div
          key={block.id}
          style={{
            textAlign: properties.textAlignment,
            fontSize: properties.fontSize,
            fontWeight: properties.fontWeight,
            color: properties.textColor,
            background: properties.backgroundColor,
            padding: properties.padding,
            borderRadius: properties.borderRadius || 0,
          }}
        >
          {properties.headerText}
        </div>
      );
    case "text":
      return (
        <div
          key={block.id}
          style={{
            textAlign: properties.textAlignment,
            fontSize: properties.fontSize,
            fontWeight: properties.fontWeight,
            color: properties.textColor,
            background: properties.backgroundColor,
            padding: properties.padding,
            whiteSpace: "pre-line",
          }}
        >
          {properties.textContent}
        </div>
      );
    case "image":
      return (
        <div
          key={block.id}
          style={{
            background: properties.backgroundColor,
            padding: properties.padding,
            textAlign: "center",
          }}
        >
          <img
            src={properties.imageUrl}
            alt="Email block"
            style={{
              maxWidth: "100%",
              borderRadius: properties.borderRadius || 0,
              display: "inline-block",
            }}
          />
        </div>
      );
    case "button":
      return (
        <div
          key={block.id}
          style={{
            textAlign: properties.textAlignment,
            padding: properties.padding,
          }}
        >
          <button
            style={{
              fontSize: properties.fontSize,
              fontWeight: properties.fontWeight,
              color: properties.textColor,
              background: properties.backgroundColor,
              border: "none",
              borderRadius: properties.borderRadius || 0,
              padding: "10px 24px",
              cursor: "pointer",
              minWidth: 120,
            }}
          >
            {properties.buttonText}
          </button>
        </div>
      );
    default:
      return null;
  }
}

const EmailTemplateCard: React.FC<{
  template: any;
  onPreview: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ template, onPreview, onEdit, onDelete }) => {
  const firstImageBlock = template.blocks.find((b: any) => b.type === 'image');
  const previewImage = template.previewImageUrl || firstImageBlock?.properties.imageUrl;
  return (
    <Card className="group cursor-pointer hover:shadow-2xl hover:scale-[1.015] transition-all duration-300 bg-card relative overflow-hidden" onClick={e => { e.stopPropagation(); onPreview(); }}>
      <CardHeader className="p-0 relative">
        <div className="aspect-[16/9] bg-muted overflow-hidden flex items-center justify-center">
          {previewImage ? (
            <img src={previewImage} alt={template.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <Palette className="w-12 h-12 text-primary/50" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg truncate text-gray-900 transition-colors">{template.name}</CardTitle>
        <CardDescription className="text-xs text-gray-500 mt-1 flex items-center">
          {/* Could add last updated, etc. */}
          {template.blocks.length} blocks
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 border-t flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {template.blocks.length} blocks
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7  text-gray-500 hover:text-blue-500" onClick={e => { e.stopPropagation(); onEdit(); }}>
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-red-500" onClick={e => { e.stopPropagation(); onDelete(); }}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default function Dashboard() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Set to true if you want to simulate loading
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>("desktop");

  // Simulate loading (optional)
  // useEffect(() => {
  //   setIsLoading(true);
  //   setTimeout(() => setIsLoading(false), 800);
  // }, []);

  const filteredTemplates = useMemo(() => {
    if (!searchQuery) return templates;
    return templates.filter((template: any) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleNewForm = () => {
    window.location.href = "/email-builder/builder";
  };

  return (
    <DashboardLayout title="Email Templates">
      <div className="max-w-7xl mx-auto p-3">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl text-gray-900 font-bold tracking-tight mb-1">Email Templates</h1>
            <p className="text-gray-500">Manage and create your email campaigns with ease.</p>
          </div>
          <Button onClick={handleNewForm} size="lg" className="bg-black hover:bg-black/90 text-white cursor-pointer">
            <Plus className="mr-1 h-5 w-5" /> Create New Template
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

        {/* Templates Grid or Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="aspect-[16/9] w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
                <CardFooter className="p-4 border-t">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-8 w-16" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template: any, idx: number) => (
              <EmailTemplateCard
                key={idx}
                template={template}
                onPreview={() => setOpenIdx(idx)}
                onEdit={() => alert('Edit functionality coming soon!')}
                onDelete={() => alert('Delete functionality coming soon!')}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg flex flex-col items-center justify-center min-h-[400px] bg-card text-gray-500">
            <FileText className="h-20 w-20 text-muted-foreground/50 mb-6" />
            <h3 className="text-2xl font-semibold mb-2">No Templates Found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {searchQuery
                ? `Your search for "${searchQuery}" did not match any templates. Try a different term or clear the search.`
                : "You haven't created any email templates yet. Let's get started!"}
            </p>
            <Button onClick={handleNewForm} size="lg">
              <Plus className="mr-2 h-5 w-5" /> Create Your First Template
            </Button>
          </div>
        )}

        {/* Template Preview Modal */}
        <Dialog open={openIdx !== null} onOpenChange={v => !v && setOpenIdx(null)}>
          <DialogContent className="max-w-4xl w-[90vw] h-[98vh] p-0 flex flex-col bg-white shadow-2xl rounded-xl overflow-hidden">
            {openIdx !== null && filteredTemplates[openIdx] && (
              <>
                {/* Sticky Combined Header with Device Tabs */}
                <div className="p-4 border-b flex flex-wrap md:flex-nowrap justify-between items-center sticky top-0 bg-white z-10 gap-2">
                  <div className="flex items-center gap-3 flex-grow">
                    <DialogHeaderUI>
                      <DialogTitleUI className="text-xl font-semibold truncate pr-8 text-gray-900">
                        {filteredTemplates[openIdx].name}
                      </DialogTitleUI>
                    </DialogHeaderUI>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 text-gray-700">
                    {/* Device Buttons */}
                    {[
                      { icon: Smartphone, label: "mobile" },
                      { icon: Tablet, label: "tablet" },
                      { icon: Monitor, label: "desktop" }
                    ].map(device => (
                      <Button
                        key={device.label}
                        size="sm"
                        variant={previewDevice === device.label ? "outline" : "default"}
                        onClick={() => setPreviewDevice(device.label as any)}
                        className={`cursor-pointer ${previewDevice === device.label ? 'text-white bg-black border-black' : 'text-gray-800'}`}
                      >
                        <device.icon className="mr-2 h-4 w-4" />
                        {device.label.charAt(0).toUpperCase() + device.label.slice(1)}
                      </Button>
                    ))}
                    {/* Close Button */}
                    <DialogClose asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <XIcon className="h-5 w-5" />
                      </Button>
                    </DialogClose>
                  </div>
                </div>

                {/* Scrollable Content Area with Device Frame */}
                <ScrollArea className="flex-grow relative">
                  <div
                    className={[
                      "mx-auto my-0 transition-all duration-300 ease-in-out bg-white shadow-lg overflow-hidden",
                      previewDevice === "mobile" && "w-[325px] h-[527px] border-4 border-gray-800 rounded-4xl",
                      previewDevice === "tablet" && "w-[768px] h-[527px] border-4 border-gray-800 rounded-4xl",
                      previewDevice === "desktop" && "w-full max-w-3xl border-2 border-gray-300 rounded-4xl"
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <div className={previewDevice !== "desktop" ? "overflow-y-auto h-full" : ""}>
                      {filteredTemplates[openIdx].blocks.map(renderBlock)}
                    </div>
                  </div>
                </ScrollArea>

                {/* Sticky Footer */}
                <div className="p-4 border-t flex justify-end gap-2 sticky bottom-0 bg-white z-10">
                  <Button
                    variant="outline"
                    onClick={() => alert("Edit functionality coming soon!")}
                    className="text-gray-900 border border-gray-300 cursor-pointer bg-white hover:bg-gray-50"
                  >
                    <Edit3 className="mr-2 h-4 w-4" /> Edit Template
                  </Button>
                  <Button
                    onClick={() => alert("Use functionality coming soon!")}
                    className="bg-black hover:bg-black/90 text-white cursor-pointer"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Use Template
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