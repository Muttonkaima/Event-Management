"use client";

import { EmailBlockSidebar } from "@/components/email/EmailBlockSidebar";
import { EmailPreview } from "@/components/email/EmailPreview";
import { PropertiesPanel } from "@/components/email/PropertiesPanel";
import { useEmailBuilder } from "@/hooks/use-email-builder";
import { Eye, Save, Palette, Code, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b justify-end border-gray-200 px-6 py-3">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-end sm:space-y-0">
          
          <div className="flex items-center space-x-3">
            <button 
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button 
              onClick={exportTemplate}
              className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Template</span>
            </button>
          </div>
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
    </div>
  );
}
