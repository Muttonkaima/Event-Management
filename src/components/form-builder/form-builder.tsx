"use client";

import { useFormBuilderStore } from "@/store/form-builder-store";
import FieldsSidebar from "./fields-sidebar";
import FormCanvas from "./form-canvas";
import PropertiesPanel from "./properties-panel";
import FormPreview from "./form-preview";
import { Button } from "@/components/ui/button";
import { Eye, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { 
  createRegistrationForm, 
  updateRegistrationForm 
} from "@/services/organization/eventService";
import { useRouter, useSearchParams } from "next/navigation";

// Dynamically import DndProvider with no SSR
const DndProvider = dynamic(
  () => import('@/components/providers/dnd-provider').then(mod => mod.DndProvider),
  { ssr: false }
);

export default function FormBuilder() {
  const { toast } = useToast();
  const { form, fields, isSaving } = useFormBuilderStore();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = !!searchParams?.get('edit');
  
  // Get the form ID from the URL if in edit mode
  const formId = searchParams?.get('edit') || '';

  const handleSave = async () => {
    try {
      const formData = {
        name: form.title,
        description: form.description,
        fields: fields.map(f => {
          const fieldData: any = {
            type: f.type,
            label: f.label,
            placeholder: f.placeholder,
            helpText: f.helpText,
            required: f.required,
            options: f.options,
            validation: f.validation
          };

          // For file fields, include accept attribute instead of pattern
          if (f.type === 'file' && f.validation?.fileTypes && f.validation.fileTypes.length > 0) {
            fieldData.validation = {
              accept: f.validation.fileTypes.join(','),
              file_size: f.validation.maxFileSize
            };
          } 
          // For other field types that support pattern validation
          else if (['text', 'number', 'textarea'].includes(f.type) && f.validation?.pattern) {
            fieldData.validation = {
              pattern: f.validation.pattern
            };
          }
          
          return fieldData;
        })
      };
      
      if (isEditMode && formId) {
        // Update existing form
        await updateRegistrationForm(formId, formData);
      } else {
        // Create new form
        await createRegistrationForm(formData);
      }
      
      // Show success message
      toast({
        title: "Success",
        description: `Form ${isEditMode ? 'updated' : 'saved'} successfully!`,
      });
      
      // Navigate to form builder page
      router.push('/form-builder');
      
    } catch (error) {
      console.error('Error saving form:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${isEditMode ? 'update' : 'save'} form. Please try again.`,
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
              onClick={() => window.history.back()}
            >
              Go Back
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
              {isSaving ? "Saving..." : isEditMode ? "Update Form" : "Create Form"}
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
