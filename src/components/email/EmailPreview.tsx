import { EmailBlock } from "@/shared/emailSchema";
import { Trash2, Plus, Move } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EmailPreviewProps {
  blocks: EmailBlock[];
  selectedBlockId: string;
  onSelectBlock: (blockId: string) => void;
  onDeleteBlock: (blockId: string) => void;
  onAddBlock: (blockType: 'header' | 'text' | 'image' | 'button' | 'divider') => void;
  onExportTemplate: () => void;
}

export function EmailPreview({ 
  blocks, 
  selectedBlockId, 
  onSelectBlock, 
  onDeleteBlock, 
  onAddBlock,
  onExportTemplate 
}: EmailPreviewProps) {
  const getBackgroundColor = (bg: string) => {
    return bg;
  };

  const renderBlock = (block: EmailBlock) => {
    const { properties } = block;
    const isSelected = block.id === selectedBlockId;

    const commonStyles = {
      padding: `${properties.padding || 16}px`,
      backgroundColor: getBackgroundColor(properties.backgroundColor || 'transparent'),
    };

    return (
      <div
        key={block.id}
        className={`email-block relative group cursor-pointer ${isSelected ? 'shadow-sm selected' : ''}`}
        onClick={() => onSelectBlock(block.id)}
      >
        <button
          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteBlock(block.id);
          }}
        >
          <Trash2 className="w-3 h-3" />
        </button>

        {block.type === 'header' && (
          <div style={commonStyles}>
            <h1
              className="font-bold"
              style={{
                textAlign: properties.textAlignment || 'center',
                fontSize: `${properties.fontSize || 24}px`,
                fontWeight: properties.fontWeight || 'bold',
                color: properties.textColor || '#000000',
              }}
            >
              {properties.headerText || 'Header Text'}
            </h1>
          </div>
        )}

        {block.type === 'text' && (
          <div style={commonStyles}>
            <p
              style={{
                textAlign: properties.textAlignment || 'left',
                fontSize: `${properties.fontSize || 16}px`,
                fontWeight: properties.fontWeight || 'normal',
                color: properties.textColor || '#374151',
              }}
            >
              {properties.textContent || 'Sample text content.'}
            </p>
          </div>
        )}

        {block.type === 'image' && (
          <div style={commonStyles}>
            <img
              src={properties.imageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'}
              alt="Email content"
              className="w-full h-auto"
              style={{
                borderRadius: `${properties.borderRadius || 4}px`,
              }}
            />
          </div>
        )}

        {block.type === 'button' && (
          <div
            style={{
              textAlign: properties.textAlignment || 'center',
            }}
          >
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
              style={{
                fontSize: `${properties.fontSize || 20}px`,
                fontWeight: properties.fontWeight || 'medium',
                borderRadius: `${properties.borderRadius || 20}px`,
                padding: `${properties.padding || 16}px`,
                backgroundColor: properties.backgroundColor || '#000000',
                color: properties.textColor || '#ffffff',
              }}
            >
              {properties.buttonText || 'Button'}
            </button>
          </div>
        )}

        {block.type === 'divider' && (
          <div style={commonStyles}>
            <hr
              style={{
                borderTop: `${properties.borderWidth || 1}px solid ${properties.borderColor || '#e5e7eb'}`,
                margin: `${properties.margin || 16}px 0`,
              }}
            />
          </div>
        )}
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <Plus className="w-8 h-8 text-gray-900" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">Start building your email</h3>
      <p className="text-sm text-gray-500 max-w-md mb-4">
        Drag and drop blocks from the left panel or click the + button to add content
      </p>
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-2"
        onClick={() => onAddBlock('text')}
      >
        Add your first block
      </Button>
    </div>
  );

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Email header */}
        <div className="border-b border-gray-200 p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="text-xs text-gray-500">
              Preview
            </div>
            <div className="w-20"></div>
          </div>
        </div>

        {/* Email content */}
        <div 
          className="min-h-[600px] bg-white relative"
          onDrop={(e) => {
            e.preventDefault();
            const blockType = e.dataTransfer.getData('blockType') as 'header' | 'text' | 'image' | 'button' | 'divider';
            if (blockType) {
              onAddBlock(blockType);
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
          }}
        >
          {blocks.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              {renderEmptyState()}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {blocks.map((block, index) => (
                <div key={block.id} className="relative group">
                  <div className="absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col space-y-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button 
                            className="w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:bg-gray-50"
                            onClick={() => onAddBlock('text')}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>Add block above</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button 
                            className="w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:bg-gray-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteBlock(block.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>Delete block</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="px-8 py-4">
                    {renderBlock(block)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center py-6 border-t border-gray-200">
         
          <button
            onClick={onExportTemplate}
            className="flex items-center text-gray-900 justify-center space-x-2 mx-auto px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            <span className="text-sm font-medium">Export Template</span>
          </button>
        </div>
      </div>
    </div>
  );
}
