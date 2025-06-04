import { useState } from 'react';
import { BadgeElement, BadgeTemplate, badgeTemplates } from '@/lib/badge-types';
import { Eye, Trash2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColorPicker } from "@/components/ui/color-picker";

interface PropertiesPanelProps {
  selectedElement: BadgeElement | null;
  backgroundColor: string;
  onElementUpdate: (elementId: string, updates: Partial<BadgeElement>) => void;
  onElementDelete: (elementId: string) => void;
  onBackgroundColorChange: (color: string) => void;
  onTemplateSelect: (template: BadgeTemplate) => void;
}

export function PropertiesPanel({
  selectedElement,
  backgroundColor,
  onElementUpdate,
  onElementDelete,
  onBackgroundColorChange,
  onTemplateSelect,
}: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState('element');

  const updateElementStyle = (updates: Partial<BadgeElement['style']>) => {
    if (selectedElement) {
      onElementUpdate(selectedElement.id, {
        style: { ...selectedElement.style, ...updates }
      });
    }
  };

  const updateElementProperty = (updates: Partial<BadgeElement>) => {
    if (selectedElement) {
      onElementUpdate(selectedElement.id, updates);
    }
  };

  const formatElementName = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const isImageElement = selectedElement?.type === 'attendee-photo' || selectedElement?.type === 'event-logo';
  const isQRElement = selectedElement?.type === 'qr-code';

  return (
    <aside className="w-80 bg-white border-l border-gray-200 flex-shrink-0 max-h-[calc(100vh)] overflow-auto">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Properties</h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
            <TabsTrigger value="element" className="text-sm text-gray-900 cursor-pointer">Element</TabsTrigger>
            <TabsTrigger value="badge" className="text-sm text-gray-900 cursor-pointer">Badge</TabsTrigger>
          </TabsList>

          <TabsContent value="element" className="space-y-6">
            {!selectedElement ? (
              <div className="text-center py-8">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-500">Select an element to edit its properties</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    {formatElementName(selectedElement.type)}
                  </h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onElementDelete(selectedElement.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Text Properties */}
                {!isImageElement && !isQRElement && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="element-text" className="text-sm font-medium text-gray-900 mb-2">Text</Label>
                      <Input
                        id="element-text"
                        value={selectedElement.content || ''}
                        onChange={(e) => updateElementProperty({ content: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-900 mb-2">Font Size</Label>
                      <div className="flex items-center space-x-3 mt-2">
                        <Slider
                          value={[selectedElement.style?.fontSize || 14]}
                          onValueChange={([value]) => updateElementStyle({ fontSize: value })}
                          min={8}
                          max={48}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-600 w-12">
                          {selectedElement.style?.fontSize || 14}px
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-900 mb-2">Font Weight</Label>
                      <Select
                        value={selectedElement.style?.fontWeight || 'normal'}
                        onValueChange={(value) => updateElementStyle({ fontWeight: value })}
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

                    <div>
                      <Label className="text-sm font-medium text-gray-900 mb-2">Text Alignment</Label>
                      <Select
                        value={selectedElement.style?.textAlign || 'left'}
                        onValueChange={(value) => updateElementStyle({ textAlign: value })}
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

                    <div>
                      <Label className="text-sm font-medium text-gray-900 mb-2">Text Color</Label>
                      <div className="flex items-center space-x-3 mt-2">
                        <ColorPicker
                          value={selectedElement.style?.color || '#000000'}
                          onChange={(value: string) => updateElementStyle({ color: value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-900 mb-2">Background Color</Label>
                      <Select
                        value={selectedElement.style?.backgroundColor || 'transparent'}
                        onValueChange={(value) => updateElementStyle({ backgroundColor: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="transparent">Transparent</SelectItem>
                          <SelectItem value="#FFFFFF">White</SelectItem>
                          <SelectItem value="#F3F4F6">Light Gray</SelectItem>
                          <SelectItem value="#000000">Black</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* QR Code Properties */}
                {isQRElement && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="qr-url" className="text-sm font-medium text-gray-900 mb-2">QR Code URL</Label>
                      <Input
                        id="qr-url"
                        type="url"
                        placeholder="https://example.com"
                        value={selectedElement.content || ''}
                        onChange={(e) => updateElementProperty({ content: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-900 mb-2">QR Code Size</Label>
                      <div className="flex items-center space-x-3 mt-2">
                        <Slider
                          value={[selectedElement.width || 100]}
                          onValueChange={([value]) => onElementUpdate(selectedElement.id, { 
                            width: value,
                            height: value // Keep it square
                          })}
                          min={50}
                          max={200}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-600 w-12">
                          {selectedElement.width || 100}px
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-900 mb-2">QR Code Color</Label>
                      <div className="flex items-center space-x-3 mt-2">
                        <ColorPicker
                          value={selectedElement.style?.color || '#000000'}
                          onChange={(value: string) => updateElementStyle({ color: value })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Image Properties */}
                {isImageElement && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-900 mb-2">Image URL</Label>
                      <Input
                        id="image-url"
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={selectedElement.style?.imageUrl || ''}
                        onChange={(e) => updateElementStyle({ imageUrl: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-900 mb-2">Border Radius</Label>
                      <div className="flex items-center space-x-3 mt-2">
                        <Slider
                          value={[selectedElement.style?.borderRadius || 0]}
                          onValueChange={([value]) => updateElementStyle({ borderRadius: value })}
                          min={0}
                          max={50}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-600 w-12">
                          {selectedElement.style?.borderRadius || 0}px
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Position & Size */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900">Position & Size</h4>
                  
                  {/* Arrow Controls for Position */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Position Controls</Label>
                    <div className="flex flex-col items-center space-y-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateElementProperty({ y: Math.max(0, selectedElement.y - 5) })}
                        className="w-8 h-8 p-0"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateElementProperty({ x: Math.max(0, selectedElement.x - 5) })}
                          className="w-8 h-8 p-0"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div className="w-8 h-8 flex items-center justify-center text-xs text-gray-500 border rounded">
                         
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateElementProperty({ x: Math.min(350 - selectedElement.width, selectedElement.x + 5) })}
                          className="w-8 h-8 p-0"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateElementProperty({ y: Math.min(220 - selectedElement.height, selectedElement.y + 5) })}
                        className="w-8 h-8 p-0"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-900 mb-2">X Position</Label>
                      <Input
                        id="pos-x"
                        type="number"
                        value={selectedElement.x}
                        onChange={(e) => updateElementProperty({ x: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-900 mb-2">Y Position</Label>
                      <Input
                        id="pos-y"
                        type="number"
                        value={selectedElement.y}
                        onChange={(e) => updateElementProperty({ y: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-900 mb-2">Width</Label>
                      <Input
                        id="width"
                        type="number"
                        value={selectedElement.width}
                        onChange={(e) => updateElementProperty({ width: parseInt(e.target.value) || 100 })}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-900 mb-2">Height</Label>
                      <Input
                        id="height"
                        type="number"
                        value={selectedElement.height}
                        onChange={(e) => updateElementProperty({ height: parseInt(e.target.value) || 30 })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="badge" className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-900 mb-2">Badge Background Color</Label>
              <div className="flex items-center space-x-3 mt-2">
              <ColorPicker
                    value={backgroundColor}
                    onChange={(value: string) => onBackgroundColorChange(value)}
                  />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Badge Size</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">3.5" x 2.2" (Credit Card)</span>
                  <span className="text-sm text-gray-500">350px x 220px</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">Badge Templates</h3>
              <div className="grid grid-cols-2 gap-3">
                {badgeTemplates.map((template) => (
                  <div
                    key={template.color}
                    className="template-option border-2 border-gray-200 rounded-lg p-3 cursor-pointer hover:border-blue-300 transition-colors"
                    onClick={() => onTemplateSelect(template)}
                  >
                    <div 
                      className="w-full h-16 border border-gray-200 rounded mb-2"
                      style={{ backgroundColor: template.backgroundColor }}
                    />
                    <p className="text-xs text-center text-gray-600">{template.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  );
}
