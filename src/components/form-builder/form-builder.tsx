"use client";

import { useFormBuilderStore } from "@/store/form-builder-store";
import FieldsSidebar from "./fields-sidebar";
import FormCanvas from "./form-canvas";
import PropertiesPanel from "./properties-panel";
import FormPreview from "./form-preview";
import { Button } from "@/components/ui/button";
import { Eye, Save, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

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
      await saveForm();
      toast({
        title: "Form Saved",
        description: savedFormId ? "Your form has been updated successfully." : "Your form has been saved successfully.",
      });
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
            <h1 className="text-xl font-semibold text-gray-900">Registration Form Builder</h1>
            <p className="text-sm text-gray-500 mt-1">Drag and drop fields to create your custom registration form</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-800"
              onClick={() => window.location.href = "/"}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-800"
              onClick={handlePreview}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              size="sm"
              className="bg-gray-900 text-white hover:bg-gray-800"
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
          <FormCanvas />
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
