import { EmailBlock } from "@/shared/emailSchema";
import { useState, useRef } from "react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ColorPicker } from "@/components/ui/color-picker";
import { Trash2 } from "lucide-react";
import { FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify } from "react-icons/fa";
import Image from 'next/image';

interface PropertiesPanelProps {
  selectedBlock: EmailBlock | undefined;
  onUpdateProperty: (blockId: string, property: string, value: any) => void;
  onDeleteBlock: (blockId: string) => void;
}

export function PropertiesPanel({ selectedBlock, onUpdateProperty, onDeleteBlock }: PropertiesPanelProps) {
  // File uploader hook
  const { uploadFile, isUploading } = useFileUpload();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Trigger hidden file input
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  // Handle actual upload then update block property
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedBlock) return;
    try {
      const url = await uploadFile(file);
      onUpdateProperty(selectedBlock.id, "imageUrl", url);
    } catch (err) {
      console.error("Image upload failed", err);
    }
  };

  if (!selectedBlock) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 h-full overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-5 py-3">
          <h2 className="text-base font-semibold text-gray-900">Properties</h2>
        </div>
        <div className="p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-900">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">No block selected</h3>
          <p className="text-sm text-gray-500">Click on a block to edit its properties</p>
        </div>
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
    <div className="w-80 bg-white border-l border-gray-100 h-full overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Properties</h2>
            <p className="text-xs text-gray-500 mt-0.5">Configure the selected block</p>
          </div>
          <button
            onClick={() => onDeleteBlock(id)}
            className="p-1.5 rounded-md text-gray-400 hover:bg-gray-50 hover:text-red-500 transition-colors"
            title="Delete block"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-5">
        {/* Block Info */}
        <div className="bg-gray-50 rounded-lg p-3.5 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">{getBlockTitle()}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Content Section */}
          <div className="space-y-5">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Content</h3>

            {type === 'header' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Header Text</label>
                <Input
                  value={properties.headerText || ''}
                  onChange={(e) => handlePropertyChange('headerText', e.target.value)}
                  className="text-sm h-9"
                  placeholder="Enter header text..."
                />
              </div>
            )}

            {type === 'text' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Text Content</label>
                <Textarea
                  rows={4}
                  value={properties.textContent || ''}
                  onChange={(e) => handlePropertyChange('textContent', e.target.value)}
                  className="text-sm min-h-[100px]"
                  placeholder="Enter your text here..."
                />
              </div>
            )}

            {type === 'image' && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <div className="flex space-x-2">
                    <Input
                      value={properties.imageUrl || ''}
                      onChange={(e) => handlePropertyChange('imageUrl', e.target.value)}
                      className="text-sm h-9 flex-1"
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      type="button"
                      className="px-3 text-xs font-medium border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors h-9 whitespace-nowrap disabled:opacity-60"
                      onClick={openFilePicker}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Upload'}
                    </button>
                    {/* hidden file input */}
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      hidden
                    />
                  </div>
                </div>
                {properties.imageUrl && (
                  <div className="mt-1 p-3 border border-gray-100 rounded-lg bg-gray-50">
                    <div className="text-xs font-medium text-gray-600 mb-2">Image Preview</div>
                    <div className="overflow-hidden rounded border border-gray-200">
                      <Image
                        src={properties.imageUrl}
                        alt="Preview"
                        className="w-full h-auto object-cover"
                        width={properties.width || 500}
                        height={properties.height || 500}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {type === 'button' && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Button Text</label>
                  <Input
                    value={properties.buttonText || ''}
                    onChange={(e) => handlePropertyChange('buttonText', e.target.value)}
                    className="text-sm h-9"
                    placeholder="Click me"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Button Link</label>
                  <Input
                    value={properties.linkUrl || 'https://ellipsonic.com'}
                    onChange={(e) => handlePropertyChange('linkUrl', e.target.value)}
                    className="text-sm h-9"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Styling Section */}
          <div className="pt-2">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">Styling</h3>
            <div className="space-y-5">

              {/* Text Alignment */}
              {(type === 'header' || type === 'text' || type === 'button') && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Text Alignment</label>
                  <div className="flex border border-gray-200 rounded-md p-0.5 bg-gray-50">
                    {[
                      { value: 'left', icon: <FaAlignLeft className="w-3.5 h-3.5" />, label: 'Left' },
                      { value: 'center', icon: <FaAlignCenter className="w-3.5 h-3.5" />, label: 'Center' },
                      { value: 'right', icon: <FaAlignRight className="w-3.5 h-3.5" />, label: 'Right' },
                      { value: 'justify', icon: <FaAlignJustify className="w-3.5 h-3.5" />, label: 'Justify' }
                    ].map((align) => (
                      <button
                        key={align.value}
                        type="button"
                        className={`flex-1 py-2 flex items-center justify-center rounded-md transition-colors ${(properties.textAlignment || 'left') === align.value
                            ? 'bg-white shadow-sm border border-gray-200 text-indigo-600'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                        onClick={() => handlePropertyChange('textAlignment', align.value)}
                        title={align.label}
                      >
                        {align.icon}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Font Size */}
              {(type === 'header' || type === 'text' || type === 'button') && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Font Size</label>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {properties.fontSize || (type === 'header' ? 24 : 16)}px
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <Slider
                        value={[properties.fontSize || (type === 'header' ? 24 : 16)]}
                        onValueChange={([value]: number[]) => handlePropertyChange('fontSize', value)}
                        min={type === 'header' ? 12 : 12}
                        max={type === 'header' ? 48 : 24}
                        step={1}
                        className="w-full"
                      />
                    </div>
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
                <ColorPicker
                  value={properties.backgroundColor || '#ffffff'}
                  onChange={(value: string) => handlePropertyChange('backgroundColor', value)}
                />
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
      </div>
    </div>
  );
}
