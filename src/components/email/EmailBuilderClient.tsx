"use client";

import { useState } from 'react';
import { EmailBlockSidebar } from "@/components/email/EmailBlockSidebar";
import { EmailPreview } from "@/components/email/EmailPreview";
import { EmailPreviewModal } from "@/components/email/EmailPreviewModal";
import { PropertiesPanel } from "@/components/email/PropertiesPanel";
import { useEmailBuilder } from "@/hooks/use-email-builder";
import { Eye, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmailBuilderClient() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('Your Email Subject');
  const [previewText, setPreviewText] = useState('This is a preview of your email template');

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
    exportTemplate
  } = useEmailBuilder();

  return (
    <div className="min-h-screen bg-gray-50">
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
              className="text-gray-600 border-2 border-gray-200 hover:text-gray-800 hover:bg-gray-50 cursor-pointer"
              onClick={handlePreviewClick}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              size="sm"
              className="bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
              onClick={exportTemplate}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Template
            </Button>
          </div>
        </header>

      {/* Main Content */}
      <div className="flex flex-col h-[calc(90vh)] md:flex-row">
        <EmailBlockSidebar onAddBlock={addBlock} />
        
        <div className="flex-1 overflow-hidden flex flex-col">
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
