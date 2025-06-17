"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Edit3, Trash2, Smartphone, Tablet, Monitor, Palette, X as XIcon } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getAllEmailTemplates, deleteEmailTemplate } from "@/services/organization/eventService";
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

import { Toaster } from "@/components/ui/toaster";

function renderBlock(block: any) {
  const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL;
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
            src={ASSETS_URL + properties.imageUrl}
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
  handleTemplateDelete: (id: string) => void;
}> = ({ template, onPreview, onEdit, handleTemplateDelete }) => {
  const firstImageBlock = template.email_fields?.find((b: any) => b.type === 'image');
  const previewImage = firstImageBlock?.properties?.imageUrl;
  const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL;
  return (
    <>
    <div
      className="relative group rounded-xl bg-white/70 shadow-md border hover:shadow-sm hover:-translate-y-1 transition-all duration-300 overflow-visible cursor-pointer flex flex-col border-b-5 border-b-black"
      onClick={e => { e.stopPropagation(); onPreview(); }}
    >
    
      <div className="relative">
        <div className="aspect-[16/9] bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden flex items-center justify-center rounded-t-xl">
          {previewImage ? (
            <img
              src={ASSETS_URL + previewImage}
              alt={template.name}
              className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105 group-hover:brightness-95"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Palette className="w-14 h-14 text-blue-200" />
            </div>
          )}
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          {/* Floating Action Buttons */}
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
              title="Delete template"
              aria-label="Delete template"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                handleTemplateDelete(template._id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      {/* Card Content */}
      <div className="flex-1 flex flex-col px-5 py-4 gap-2">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-base text-gray-900 truncate flex-1">{template.email_template_name}</h3>
          {/* Block count chip */}
          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium shadow-sm border border-blue-200">
            {template.email_fields?.length || 0} blocks
          </span>
        </div>
      </div>
    </div>
    </>
  );
};

export default function Dashboard() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllEmailTemplates();
        setTemplates(res.data || []);
      } catch (err) {
        console.error('Failed to fetch templates', err);
        toast({ title: 'Failed to load templates' });
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get('created')) {
      toast({ title: 'Email template created successfully' });
    }
    // Clean up the URL
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('created');
    window.history.replaceState({}, '', newUrl.toString());
  }, [searchParams]);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const isLoading = loading;
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>("desktop");

  // Filtered templates for search
  const filteredTemplates = useMemo(() => {
    if (!searchQuery) return templates;
    return templates.filter((template: any) =>
      (template.email_template_name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, templates]);

  const handleNewForm = () => {
    window.location.href = "/email-builder/builder";
  };

  const handleDeleteTemplate = async (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteEmailTemplate(id);
        toast({ title: 'Template deleted successfully' });
        // Refresh the templates list
        const res = await getAllEmailTemplates();
        setTemplates(res.data || []);
      } catch (err) {
        console.error('Failed to delete template', err);
        toast({ title: 'Failed to delete template' });
      }
    }
  };

  return (
    <DashboardLayout title="Email Templates">
      <Toaster />
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
            {filteredTemplates.map((template: any) => (
              <EmailTemplateCard
              key={template._id}
              template={template}
              onPreview={() => setOpenIdx(templates.findIndex(t => t._id === template._id))}
              onEdit={() => alert('Edit functionality coming soon!')}
              handleTemplateDelete={handleDeleteTemplate}
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
                        {filteredTemplates[openIdx].email_template_name}
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
                      <Button variant="ghost" size="icon" className="rounded-full cursor-pointer">
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
                      {filteredTemplates[openIdx].email_fields.map(renderBlock)}
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