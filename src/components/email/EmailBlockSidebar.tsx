import { Heading, Image, AlignLeft, MousePointer, Minus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      
      
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 mb-1">Basic</h3>
          <div className="grid grid-cols-2 gap-2">
            {blocks.map((block) => {
              const Icon = block.icon;
              return (
                <div
                  key={block.type}
                  className="group relative bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-colors drag-handle flex flex-col items-center justify-center aspect-square"
                  onClick={() => onAddBlock(block.type)}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('blockType', block.type);
                  }}
                >
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-2 text-black group-hover:bg-black group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center">{block.label}</span>
                  <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-black transition-all pointer-events-none"></div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
      
    </div>
  );
}
