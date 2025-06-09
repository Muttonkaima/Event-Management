"use client";

import { useFormBuilderStore } from "@/store/form-builder-store";
import FieldsSidebar from "./fields-sidebar";
import FormCanvas from "./form-canvas";
import PropertiesPanel from "./properties-panel";
import FormPreview from "./form-preview";
import { Button } from "@/components/ui/button";
import { Eye, Save, Home, ArrowBigLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { downloadJSON } from "./utils";

// Dynamically import DndProvider with no SSR
const DndProvider = dynamic(
  () => import('@/components/providers/dnd-provider').then(mod => mod.DndProvider),
  { ssr: false }
);

export default function FormBuilder() {
  const { toast } = useToast();
  const { form, fields, saveForm, isSaving, savedFormId } = useFormBuilderStore();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleSave = async () => {
    try {
      const formJSON = {
        title: form.title,
        description: form.description,
        fields: fields.map(f => ({
          type: f.type,
          label: f.label,
          placeholder: f.placeholder,
          helpText: f.helpText,
          required: f.required,
          options: f.options,
        }))
      };
      downloadJSON(formJSON, `${(form.title||'form').replace(/\s+/g,'_').toLowerCase()}.json`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save form. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <DndProvider>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center flex-shrink-0">
          <div>
          <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 border-2 border-gray-200 hover:bg-gray-50 hover:text-gray-800 cursor-pointer"
              onClick={() => window.location.href = "/form-builder"}
            >
              Back to Forms
            </Button>
          </div>
          <div className="flex items-center gap-3">
            
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 border-2 border-gray-200 hover:text-gray-800 hover:bg-gray-50 cursor-pointer"
              onClick={handlePreview}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              size="sm"
              className="bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : savedFormId ? "Update Form" : "Save Form"}
            </Button>
           
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          <FieldsSidebar />
          <div className="flex-1 overflow-y-auto">
            <FormCanvas />
          </div>
          <PropertiesPanel />
        </div>
      </div>
      
      {/* Form Preview Modal */}
      <FormPreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        form={form}
        fields={fields}
      />
    </DndProvider>
  );
}
