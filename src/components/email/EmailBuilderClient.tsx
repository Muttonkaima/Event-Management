"use client";

import { EmailBlockSidebar } from "@/components/email/EmailBlockSidebar";
import { EmailPreview } from "@/components/email/EmailPreview";
import { PropertiesPanel } from "@/components/email/PropertiesPanel";
import { useEmailBuilder } from "@/hooks/use-email-builder";
import { Monitor, Eye, Save } from "lucide-react";

export function EmailBuilderClient() {
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-black">Email Template Builder</h1>
          <p className="text-sm text-gray-500">Drag and drop blocks to create your custom email template</p>
        </div>
        <div className="flex items-center space-x-3">
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border-2 cursor-pointer border-gray-200 rounded-md hover:bg-gray-50">
            <Eye className="w-4 h-4 text-gray-900" />
            <span className="text-sm text-gray-900 font-medium">Preview</span>
          </button>
          <button 
            onClick={exportTemplate}
            className="flex items-center space-x-2 cursor-pointer px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            <Save className="w-4 h-4" />
            <span className="text-sm font-medium">Save Template</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        <EmailBlockSidebar onAddBlock={addBlock} />
        
        <EmailPreview
          blocks={blocks}
          selectedBlockId={selectedBlockId}
          onSelectBlock={selectBlock}
          onDeleteBlock={deleteBlock}
          onAddBlock={addBlock}
          onExportTemplate={exportTemplate}
        />
        
        <PropertiesPanel
          selectedBlock={selectedBlock}
          onUpdateProperty={updateBlockProperty}
          onDeleteBlock={deleteBlock}
        />
      </div>
    </div>
  );
}
