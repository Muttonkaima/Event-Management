import { EmailBlock } from "@/shared/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ColorPicker } from "@/components/ui/color-picker";
import { Trash2 } from "lucide-react";

interface PropertiesPanelProps {
  selectedBlock: EmailBlock | undefined;
  onUpdateProperty: (blockId: string, property: string, value: any) => void;
  onDeleteBlock: (blockId: string) => void;
}

export function PropertiesPanel({ selectedBlock, onUpdateProperty, onDeleteBlock }: PropertiesPanelProps) {
  if (!selectedBlock) {
    return (
      <div className="w-80 bg-gray-50 border-l border-gray-200 p-4">
        <h2 className="text-sm font-semibold text-black mb-4">Properties</h2>
        <p className="text-sm text-gray-500">Select a block to edit its properties</p>
      </div>
    );
  }

  const { id, type, properties } = selectedBlock;

  const handlePropertyChange = (property: string, value: any) => {
    onUpdateProperty(id, property, value);
  };

  const getBlockTitle = () => {
    switch (type) {
      case 'header': return 'Header Block';
      case 'text': return 'Text Block';
      case 'image': return 'Image Block';
      case 'button': return 'Button Block';
      case 'divider': return 'Divider Block';
      default: return 'Block';
    }
  };

  return (
    <div className="w-80 bg-gray-50 border-l max-h-[calc(100vh-73px)] overflow-y-auto border-gray-200 p-4">
      <h2 className="text-sm font-semibold text-black mb-4">Properties</h2>
      
      <div className="bg-white border border-gray-200 rounded-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-black">{getBlockTitle()}</h3>
          <button
            className="w-5 h-5 text-red-500 hover:bg-red-50 rounded flex items-center justify-center"
            onClick={() => onDeleteBlock(id)}
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Content Properties */}
          {type === 'header' && (
            <div>
              <label className="block text-xs font-medium text-black mb-2">Header Text</label>
              <Input
                value={properties.headerText || ''}
                onChange={(e) => handlePropertyChange('headerText', e.target.value)}
                className="text-sm"
              />
            </div>
          )}

          {type === 'text' && (
            <div>
              <label className="block text-xs font-medium text-black mb-2">Text Content</label>
              <Textarea
                rows={4}
                value={properties.textContent || ''}
                onChange={(e) => handlePropertyChange('textContent', e.target.value)}
                className="text-sm"
              />
            </div>
          )}

          {type === 'image' && (
            <div>
              <label className="block text-xs font-medium text-black mb-2">Image URL</label>
              <Input
                value={properties.imageUrl || ''}
                onChange={(e) => handlePropertyChange('imageUrl', e.target.value)}
                className="text-sm"
              />
            </div>
          )}

          {type === 'button' && (
            <div>
              <label className="block text-xs font-medium text-black mb-2">Button Text</label>
              <Input
                value={properties.buttonText || ''}
                onChange={(e) => handlePropertyChange('buttonText', e.target.value)}
                className="text-sm"
              />
            </div>
          )}

          {/* Styling Label */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Styling</label>
          </div>

          {/* Text Alignment */}
          {(type === 'header' || type === 'text' || type === 'button') && (
            <div>
              <label className="block text-xs font-medium text-black mb-2">Text Alignment</label>
              <Select
                value={properties.textAlignment || 'left'}
                onValueChange={(value: string) => handlePropertyChange('textAlignment', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Font Size */}
          {(type === 'header' || type === 'text' || type === 'button') && (
            <div>
              <label className="block text-xs font-medium text-black mb-2">Font Size</label>
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <Slider
                    value={[properties.fontSize || 16]}
                    onValueChange={([value]: number[]) => handlePropertyChange('fontSize', value)}
                    min={type === 'header' ? 12 : 12}
                    max={type === 'header' ? 48 : 24}
                    step={1}
                    className="w-full"
                  />
                </div>
                <span className="text-sm font-medium text-black w-12">{properties.fontSize || 16}px</span>
              </div>
            </div>
          )}

          {/* Font Weight */}
          {(type === 'header' || type === 'text' || type === 'button') && (
            <div>
              <label className="block text-xs font-medium text-black mb-2">Font Weight</label>
              <Select
                value={properties.fontWeight || 'normal'}
                onValueChange={(value: string) => handlePropertyChange('fontWeight', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Text Color */}
          {(type === 'header' || type === 'text' || type === 'button') && (
            <div>
              <label className="block text-xs font-medium text-black mb-2">Text Color</label>
              <ColorPicker
                value={properties.textColor || '#000000'}
                onChange={(value: string) => handlePropertyChange('textColor', value)}
              />
            </div>
          )}

          {/* Background Color */}
          <div>
            <label className="block text-xs font-medium text-black mb-2">Background Color</label>
            <Select
              value={properties.backgroundColor || 'transparent'}
              onValueChange={(value: string) => handlePropertyChange('backgroundColor', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transparent">Transparent</SelectItem>
                <SelectItem value="White">White</SelectItem>
                <SelectItem value="Light Gray">Light Gray</SelectItem>
                <SelectItem value="Light Blue">Light Blue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Padding */}
          <div>
            <label className="block text-xs font-medium text-black mb-2">Padding</label>
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <Slider
                  value={[properties.padding || 16]}
                  onValueChange={([value]) => handlePropertyChange('padding', value)}
                  min={0}
                  max={50}
                  step={1}
                  className="w-full"
                />
              </div>
              <span className="text-sm font-medium text-black w-12">{properties.padding || 16}px</span>
            </div>
          </div>

          {/* Border Radius for Image and Button */}
          {(type === 'image' || type === 'button') && (
            <div>
              <label className="block text-xs font-medium text-black mb-2">Border Radius</label>
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <Slider
                    value={[properties.borderRadius || 4]}
                    onValueChange={([value]) => handlePropertyChange('borderRadius', value)}
                    min={0}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                </div>
                <span className="text-sm font-medium text-black w-12">{properties.borderRadius || 4}px</span>
              </div>
            </div>
          )}

          {/* Divider specific properties */}
          {type === 'divider' && (
            <>
              <div>
                <label className="block text-xs font-medium text-black mb-2">Border Color</label>
                <ColorPicker
                  value={properties.borderColor || '#e5e7eb'}
                  onChange={(value) => handlePropertyChange('borderColor', value)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-black mb-2">Border Width</label>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <Slider
                      value={[properties.borderWidth || 1]}
                      onValueChange={([value]) => handlePropertyChange('borderWidth', value)}
                      min={0}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <span className="text-sm font-medium text-black w-12">{properties.borderWidth || 1}px</span>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-black mb-2">Margin</label>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <Slider
                      value={[properties.margin || 16]}
                      onValueChange={([value]) => handlePropertyChange('margin', value)}
                      min={0}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <span className="text-sm font-medium text-black w-12">{properties.margin || 16}px</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
