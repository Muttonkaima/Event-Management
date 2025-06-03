import { EmailBlock } from "@/shared/schema";
import { Trash2 } from "lucide-react";

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
        className={`email-block relative group cursor-pointer ${isSelected ? 'selected' : ''}`}
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

  return (
    <div className="flex-1 bg-white  max-h-[calc(90vh)] overflow-y-auto p-6">

      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        <div
          className="p-4 space-y-4"
          onDrop={(e) => {
            e.preventDefault();
            const blockType = e.dataTransfer.getData('blockType') as 'header' | 'text' | 'image' | 'button' | 'divider';
            if (blockType) {
              onAddBlock(blockType);
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
        >
          {blocks.map(renderBlock)}
          
         
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
