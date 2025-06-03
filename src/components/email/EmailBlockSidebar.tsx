import { Heading, Image, AlignLeft, MousePointer, Minus } from "lucide-react";

interface EmailBlockSidebarProps {
  onAddBlock: (blockType: 'header' | 'text' | 'image' | 'button' | 'divider') => void;
}

export function EmailBlockSidebar({ onAddBlock }: EmailBlockSidebarProps) {
  const blocks = [
    { type: 'header' as const, icon: Heading, label: 'Header' },
    { type: 'image' as const, icon: Image, label: 'Image' },
    { type: 'text' as const, icon: AlignLeft, label: 'Text' },
    { type: 'button' as const, icon: MousePointer, label: 'Button' },
    { type: 'divider' as const, icon: Minus, label: 'Divider' },
  ];

  return (
    <div className="w-48 bg-gray-50 border-r border-gray-200 p-4">
      <h2 className="text-sm font-semibold text-black mb-4">Email Blocks</h2>
      <div className="space-y-3">
        {blocks.map((block) => {
          const Icon = block.icon;
          return (
            <div
              key={block.type}
              className="bg-white border border-gray-200 rounded-md p-3 cursor-pointer hover:shadow-sm drag-handle"
              onClick={() => onAddBlock(block.type)}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('blockType', block.type);
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <Icon className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-black">{block.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
