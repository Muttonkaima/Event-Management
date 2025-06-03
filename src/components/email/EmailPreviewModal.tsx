"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmailBlock } from "@/shared/emailSchema";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmailPreviewModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  blocks: EmailBlock[];
  subject?: string;
  previewText?: string;
}

export function EmailPreviewModal({ 
  isOpen, 
  onCloseAction, 
  blocks, 
  subject = "Email Preview",
  previewText = "This is a preview of your email template"
}: EmailPreviewModalProps) {
  const renderBlock = (block: EmailBlock) => {
    const { type, properties } = block;

    switch (type) {
      case 'header':
        return (
          <h1 
            className="text-2xl font-bold mb-4"
            style={{
              color: properties.textColor || '#111827',
              textAlign: properties.textAlignment || 'left',
              fontSize: `${properties.fontSize || 24}px`,
              fontWeight: properties.fontWeight || 'bold',
            }}
          >
            {properties.headerText || 'Header Text'}
          </h1>
        );
      
      case 'text':
        return (
          <p 
            className="mb-4 leading-relaxed"
            style={{
              color: properties.textColor || '#374151',
              textAlign: properties.textAlignment || 'left',
              fontSize: `${properties.fontSize || 16}px`,
              lineHeight: '1.6',
            }}
          >
            {properties.textContent || 'Sample text content.'}
          </p>
        );
      
      case 'image':
        return (
          <div className="my-4">
            <img
              src={properties.imageUrl || 'https://via.placeholder.com/600x300'}
              alt={properties.altText || 'Email content'}
              className="w-full h-auto rounded-lg"
              style={{
                maxWidth: '100%',
                borderRadius: `${properties.borderRadius || 8}px`,
              }}
            />
          </div>
        );
      
      case 'button':
        return (
          <div 
            className="my-6"
            style={{ textAlign: properties.textAlignment || 'left' }}
          >
            <a
              href={properties.buttonUrl || '#'}
              className="inline-block px-6 py-3 rounded-md font-medium text-center"
              style={{
                backgroundColor: properties.backgroundColor || '#2563eb',
                color: properties.textColor || '#ffffff',
                fontSize: `${properties.fontSize || 16}px`,
                textDecoration: 'none',
              }}
            >
              {properties.buttonText || 'Click Here'}
            </a>
          </div>
        );
      
      case 'divider':
        return (
          <hr 
            className="my-6 border-gray-200"
            style={{
              borderWidth: `${properties.borderWidth || 1}px`,
              borderColor: properties.borderColor || '#e5e7eb',
              borderStyle: 'solid',
            }}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto p-0 bg-white">
        <DialogHeader className="border-b border-gray-200 p-3 sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Email Preview
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                This is how your email will appear to recipients
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCloseAction}
              className="h-8 w-8 p-0"
            >
              <X className="h-5 w-5 text-gray-500" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto p-6">
          {/* Email Container */}
          <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Email Header */}
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-sm text-gray-500">
                  {subject}
                </div>
                <div className="w-12"></div>
              </div>
            </div>

            {/* Email Content */}
            <div className="p-8">
              {/* Preview Text (hidden in most email clients but visible in inbox) */}
              <div className="text-gray-500 text-sm mb-6" style={{ display: 'none' }}>
                {previewText}
              </div>

              {/* Email Body */}
              <div className="prose max-w-none">
                {blocks.length > 0 ? (
                  blocks.map((block) => (
                    <div key={block.id} className="mb-6 last:mb-0">
                      {renderBlock(block)}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-lg font-medium mb-2">No content added yet</p>
                    <p className="text-sm">Add some blocks to see the preview</p>
                  </div>
                )}
              </div>

              {/* Email Footer */}
              <div className="mt-12 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
                <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
                <p className="mt-1">
                  <a href="#" className="text-blue-600 hover:underline">Unsubscribe</a> | 
                  <a href="#" className="text-blue-600 hover:underline ml-2">View in browser</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
