"use client";

import { useEffect, useState } from 'react';
import { EmailBlockSidebar } from "@/components/email/EmailBlockSidebar";
import { EmailPreview } from "@/components/email/EmailPreview";
import { EmailPreviewModal } from "@/components/email/EmailPreviewModal";
import { PropertiesPanel } from "@/components/email/PropertiesPanel";
import { useEmailBuilder } from "@/hooks/use-email-builder";
import { Eye, Save } from "lucide-react";
import { createEmailTemplate, updateEmailTemplate } from "@/services/organization/eventService";
import { urlToFile } from "@/utils/urlToFile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface EmailBuilderClientProps {
  initialData?: {
    blocks?: any[];
    emailSubject?: string;
    previewText?: string;
  } | null;
  templateId?: string;
}

export function EmailBuilderClient({ initialData, templateId }: EmailBuilderClientProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState(initialData?.emailSubject || '');
  const [previewText, setPreviewText] = useState(initialData?.previewText || '');

  // Update form fields when initialData changes
  useEffect(() => {
    if (initialData) {
      if (initialData.emailSubject) setEmailSubject(initialData.emailSubject);
      if (initialData.previewText) setPreviewText(initialData.previewText);
    }
  }, [initialData]);
  
  // Make sure templateId is defined in the component scope
  const currentTemplateId = templateId;

  // Debug logs
  console.log('Preview modal state:', isPreviewOpen);
  const handlePreviewClick = () => {
    console.log('Preview button clicked');
    setIsPreviewOpen(true);
  };
  const {
    blocks,
    selectedBlockId,
    selectedBlock,
    addBlock,
    deleteBlock,
    updateBlockProperty,
    selectBlock,
    exportTemplate,
    setBlocks
  } = useEmailBuilder({
    // Only pass initial blocks if we have them, otherwise let the hook use defaults
    initialBlocks: initialData?.blocks
  });

  // Reset form fields when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      if (initialData.emailSubject) setEmailSubject(initialData.emailSubject);
      if (initialData.previewText) setPreviewText(initialData.previewText);
    }
  }, [initialData]);

  const handleSaveTemplate = async () => {
    if (!emailSubject.trim() || !previewText.trim()) {
      toast({ title: "Please fill in title and description" });
      return;
    }
    setIsSaving(true);
    setIsSaving(true);
    
    // Prepare data
    const clonedBlocks = JSON.parse(JSON.stringify(blocks));
    const formData = new FormData();
    formData.append("title", emailSubject);
    formData.append("description", previewText);

    // Generate a unique ID for this save operation to use in filenames
    const saveId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    let imageCounter = 0;

    // Convert image URLs to actual files and update clonedBlocks
    for (const block of clonedBlocks) {
      if (block.type === "image" && block.properties?.imageUrl) {
        const imgUrl: string = block.properties.imageUrl;
        // If url looks like a filename already, skip fetch but still keep the name.
        if (!/^https?:\/\//i.test(imgUrl) && !imgUrl.startsWith('/')) {
          // Already a plain filename assigned earlier – nothing to append.
          continue;
        }

        try {
          let filename: string;
          let fetchUrl = imgUrl;
          // If relative path (e.g. /uploads/foo.png) make it absolute using current origin
          if (!/^https?:\/\//i.test(imgUrl) && imgUrl.startsWith('/')) {
            fetchUrl = window.location.origin + imgUrl;
          }

          try {
            const urlObj = new URL(fetchUrl);
            const pathnameName = urlObj.pathname.split('/').pop();
            const extension = pathnameName?.includes('.') ? pathnameName.split('.').pop() : 'png';
            filename = `img-${saveId}-${imageCounter}.${extension || 'png'}`;
            imageCounter++;
          } catch {
            filename = `img-${saveId}-${imageCounter}.png`;
            imageCounter++;
          }
          
          const file = await urlToFile(fetchUrl, filename);
          formData.append("images", file);
          // Store the final filename in the block properties
          block.properties.imageUrl = file.name;
        } catch (err) {
          console.error("Failed to convert URL to file", err);
        }
      }
    }

    // Prepare blocks data for the backend
    const blocksForBackend = clonedBlocks.map((block: any) => {
      const { id, ...blockWithoutId } = block;
      return blockWithoutId;
    });
    formData.append("blocks", JSON.stringify(blocksForBackend));

    console.log(
      'FormData contents:',
      [...formData.entries()].map(([k, v]) => [k, v instanceof File ? v.name : v])
    );
    try {
      if (currentTemplateId) {
        // Update existing template
        await updateEmailTemplate(currentTemplateId, formData);
        toast({
          title: 'Success',
          description: 'Template updated successfully',
        });
      } else {
        // Create new template
        await createEmailTemplate(formData);
        toast({
          title: 'Success',
          description: 'Template created successfully',
        });
      }
      
      router.push("/email-builder?created=1");
    } catch (err) {
      console.error("Failed to save email template", err);
      toast({
        title: 'Error',
        description: 'Failed to save template',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
       <Toaster />
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center flex-shrink-0">
        <div>
          <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 border-2 border-gray-200 hover:bg-gray-50 hover:text-gray-800 cursor-pointer"
              onClick={() => window.location.href = "/email-builder"}
            >
              Back to Email Templates
            </Button>
        </div>
        <div className="flex items-center gap-3">
            
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 border-2 border-gray-200 hover:bg-gray-50 hover:text-gray-800 cursor-pointer"
              onClick={handlePreviewClick}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              size="sm"
              className="bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
              onClick={handleSaveTemplate}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving…' : 'Save Template'}
            </Button>
          </div>
        </header>

      {/* Main Content */}
      <div className="flex flex-col h-[calc(90vh)] md:flex-row">
        <EmailBlockSidebar onAddBlock={addBlock} />
        
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Metadata Inputs */}
          <div className="p-1 border-b bg-gray-50 flex gap-2 max-w-md w-full self-center">
            <Input
              placeholder="Enter Your Title"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="h-9 text-sm"
            />
            <Input
              placeholder="Enter Your Description"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          <EmailPreview
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={selectBlock}
            onDeleteBlock={deleteBlock}
            onAddBlock={addBlock}
            onExportTemplate={exportTemplate}
          />
        </div>
        
        <PropertiesPanel
          selectedBlock={selectedBlock}
          onUpdateProperty={updateBlockProperty}
          onDeleteBlock={deleteBlock}
        />
      </div>
      
      {/* Email Preview Modal */}
      <EmailPreviewModal 
        isOpen={isPreviewOpen}
        onCloseAction={() => {
          console.log('Closing preview modal');
          setIsPreviewOpen(false);
        }}
        blocks={blocks}
        subject={emailSubject}
        previewText={previewText}
      />
    </div>
  );
}
