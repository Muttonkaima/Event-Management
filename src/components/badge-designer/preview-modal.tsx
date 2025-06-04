import { BadgeElement } from '@/lib/badge-types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, X } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  elements: BadgeElement[];
  backgroundColor: string;
  onExport: () => void;
}

export function PreviewModal({ isOpen, onClose, elements, backgroundColor, onExport }: PreviewModalProps) {
  const renderElement = (element: BadgeElement) => {
    const style = element.style || {};
    
    const elementStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${element.x}px`,
      top: `${element.y}px`,
      width: `${element.width}px`,
      height: `${element.height}px`,
      fontSize: style.fontSize ? `${style.fontSize}px` : undefined,
      fontWeight: style.fontWeight || 'normal',
      textAlign: style.textAlign as any || 'left',
      color: style.color || '#000000',
      backgroundColor: style.backgroundColor !== 'transparent' ? style.backgroundColor : undefined,
      borderRadius: style.borderRadius ? `${style.borderRadius}px` : undefined,
    };

    const renderContent = () => {
      if (element.type === 'attendee-photo' || element.type === 'event-logo') {
        if (style.imageUrl) {
          return (
            <img 
              src={style.imageUrl} 
              alt={element.type}
              className="w-full h-full object-cover"
              style={{ borderRadius: style.borderRadius ? `${style.borderRadius}px` : undefined }}
            />
          );
        }
        return (
          <div 
            className="w-full h-full bg-gray-200 border border-gray-300 flex items-center justify-center text-xs text-gray-500"
            style={{ borderRadius: style.borderRadius ? `${style.borderRadius}px` : undefined }}
          >
            {element.type === 'attendee-photo' ? 'Photo' : 'Logo'}
          </div>
        );
      }

      if (element.type === 'qr-code') {
        return (
          <div className="w-full h-full bg-gray-200 border border-gray-300 flex items-center justify-center text-xl font-mono">
            QR
          </div>
        );
      }

      return (
        <div className="w-full h-full flex items-center">
          {element.content || 'Text'}
        </div>
      );
    };

    return (
      <div key={element.id} style={elementStyle}>
        {renderContent()}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[calc(100vh-81px)] overflow-auto bg-white rounded-2xl">
      <DialogHeader className="border-b border-gray-200 p-3 sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Badge Preview
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                This is how your badge will appear to recipients
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-5 w-5 text-gray-500" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex justify-center py-6">
          <div
            className="relative border shadow-lg"
            style={{
              width: '350px',
              height: '220px',
              backgroundColor: backgroundColor,
            }}
          >
            {elements.map(renderElement)}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Button onClick={onExport} className="flex items-center space-x-2 bg-black text-white">
            <Download className="w-4 h-4" />
            <span>Download Badge</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
