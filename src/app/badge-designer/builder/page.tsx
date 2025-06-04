"use client";

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ElementsSidebar } from '@/components/badge-designer/elements-sidebar';
import { BadgeCanvas } from '@/components/badge-designer/badge-canvas';
import { PropertiesPanel } from '@/components/badge-designer/properties-panel';
import { PreviewModal } from '@/components/badge-designer/preview-modal';
import { DnDProvider } from '@/lib/dnd-provider';
import { BadgeElement, BadgeTemplate } from '@/lib/badge-types';
import { Button } from '@/components/ui/button';
import { Home, Eye, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function BadgeDesigner() {
  const [elements, setElements] = useState<BadgeElement[]>([
    {
      id: 'element-1',
      type: 'attendee-name',
      x: 75,
      y: 20,
      width: 200,
      height: 40,
      content: 'John Doe',
      style: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000000',
        backgroundColor: 'transparent',
      }
    },
    {
      id: 'element-2',
      type: 'qr-code',
      x: 20,
      y: 70,
      width: 80,
      height: 80,
      content: 'QR',
      style: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000000',
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
      }
    },
    {
      id: 'element-3',
      type: 'attendee-role',
      x: 250,
      y: 70,
      width: 80,
      height: 50,
      content: 'VIP Attendee',
      style: {
        fontSize: 14,
        fontWeight: 'medium',
        textAlign: 'right',
        color: '#2563EB',
        backgroundColor: 'transparent',
      }
    }
  ]);
  
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [selectedElementId, setSelectedElementId] = useState<string | null>('element-1');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { toast } = useToast();

  const selectedElement = elements.find(el => el.id === selectedElementId) || null;


  const exportBadgeMutation = useMutation({
    mutationFn: async () => {
      const badgeData = {
        name: `Badge Export ${Date.now()}`,
        elements,
        backgroundColor,
        width: 350,
        height: 220,
        exportedAt: new Date().toISOString(),
      };
      
      const blob = new Blob([JSON.stringify(badgeData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `badge-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast({ title: 'Badge exported successfully!' });
    },
    onError: () => {
      toast({ title: 'Failed to export badge', variant: 'destructive' });
    },
  });

  const handleElementAdd = (element: BadgeElement) => {
    setElements(prev => [...prev, element]);
    setSelectedElementId(element.id);
  };

  const handleElementUpdate = (elementId: string, updates: Partial<BadgeElement>) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    ));
  };

  const handleElementDelete = (elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  };

  const handleTemplateSelect = (template: BadgeTemplate) => {
    setBackgroundColor(template.backgroundColor);
  };

  return (
    <DnDProvider>
      <div className="bg-gray-50 font-sans min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center flex-shrink-0">
          <div>
          <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 border-2 border-gray-200 hover:bg-gray-50 hover:text-gray-800 cursor-pointer"
              onClick={() => window.location.href = "/badge-designer"}
            >
              Back to Badges
            </Button>
          </div>
          <div className="flex items-center gap-3">
            
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 border-2 border-gray-200 hover:text-gray-800 hover:bg-gray-50 cursor-pointer"
              onClick={() => setIsPreviewOpen(true)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              size="sm"
              className="bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
              onClick={() => exportBadgeMutation.mutate()}
              disabled={exportBadgeMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {exportBadgeMutation.isPending ? "Saving..." : "Export Badge"}
            </Button>
          </div>
        </header>

        <div className="flex h-[calc(100vh-81px)] overflow-hidden">
          <ElementsSidebar />
          
          <BadgeCanvas
            elements={elements}
            backgroundColor={backgroundColor}
            selectedElementId={selectedElementId}
            onElementAdd={handleElementAdd}
            onElementSelect={setSelectedElementId}
            onElementUpdate={handleElementUpdate}
          />
          
          <PropertiesPanel
            selectedElement={selectedElement}
            backgroundColor={backgroundColor}
            onElementUpdate={handleElementUpdate}
            onElementDelete={handleElementDelete}
            onBackgroundColorChange={setBackgroundColor}
            onTemplateSelect={handleTemplateSelect}
          />
        </div>

        <PreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          elements={elements}
          backgroundColor={backgroundColor}
          onExport={() => exportBadgeMutation.mutate()}
        />
      </div>
    </DnDProvider>
  );
}
