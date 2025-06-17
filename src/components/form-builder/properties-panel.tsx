import { useFormBuilderStore } from "@/store/form-builder-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MousePointer, Trash2, Plus, X } from "lucide-react";
import { useState, useEffect } from 'react';

// Define validation state type
type ValidationState = {
  minLength?: number;
  maxLength?: number;
  allowText: boolean;
  allowNumbers: boolean;
  allowSpecialChars: boolean;
  fileTypes: string[];
  maxFileSize?: number;
  pattern: string;
};

export default function PropertiesPanel() {
  const { 
    selectedFieldId, 
    getSelectedField, 
    updateField, 
    deleteField,
    addOption,
    removeOption,
    updateOption
  } = useFormBuilderStore();

  const selectedField = useFormBuilderStore((state) =>
    state.fields.find((field) => field.id === state.selectedFieldId)
  );

  // Calculate derived values without conditional hooks
  const fieldType = selectedField?.type;
  const isTextOrTextarea = fieldType === 'text' || fieldType === 'textarea' || fieldType === 'number';
  const isFile = fieldType === 'file';
  const showValidation = selectedField && !['select', 'radio', 'checkbox', 'date', 'email'].includes(fieldType || '');

  // Initialize validation state with default values
  const [validation, setValidation] = useState<ValidationState>({
    allowText: true,
    allowNumbers: true,
    allowSpecialChars: false,
    minLength: undefined,
    maxLength: undefined,
    fileTypes: [],
    maxFileSize: undefined,
    pattern: ''
  });

  // Update validation state when selected field changes
  useEffect(() => {
    if (!selectedField) return;
    
    const fieldValidation = selectedField.validation || {};
    setValidation({
      allowText: fieldValidation.allowText ?? true,
      allowNumbers: fieldValidation.allowNumbers ?? true,
      allowSpecialChars: fieldValidation.allowSpecialChars ?? false,
      minLength: fieldValidation.minLength,
      maxLength: fieldValidation.maxLength,
      fileTypes: fieldValidation.fileTypes || [],
      maxFileSize: fieldValidation.maxFileSize,
      pattern: fieldValidation.pattern || ''
    });
  }, [selectedField?.id]);

  if (!selectedField) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex-shrink-0">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Properties</h3>
          <div className="text-center py-12 text-gray-500">
            <MousePointer className="w-8 h-8 mx-auto mb-4 text-gray-300" />
            <p className="text-sm font-medium mb-1">No field selected</p>
            <p className="text-xs">Click on a field in the form to edit its properties</p>
          </div>
        </div>
      </div>
    );
  }
  
  const handleValidationChange = (updates: Partial<ValidationState>) => {
    const updated = {
      ...validation,
      ...updates
    };
  
    // Generate the new pattern right here
    const generatePattern = (val: typeof validation) => {
      if (!isTextOrTextarea) return '';
  
      const parts = [];
      if (val.allowText) parts.push('a-zA-Z\\s');
      if (val.allowNumbers) parts.push('0-9');
      if (val.allowSpecialChars) {
        parts.push('!@#$%^&*()_+\\-=\\[\\]{};:\\' + "'" + '\\"\\\\|,.<>/?`~');
      }
  
      if (parts.length === 0) return '';
  
      if (val.minLength || val.maxLength) {
        return `^[${parts.join('')}]{${val.minLength || 0},${val.maxLength || ''}}$`;
      }
      return `^[${parts.join('')}]*$`;
    };
  
    const newPattern = generatePattern(updated);
  
    // Update state
    setValidation({
      ...updated,
      pattern: newPattern
    });
  
    // Also update the field in the form store
    if (selectedField) {
      updateField(selectedField.id, {
        validation: {
          ...selectedField.validation,
          ...updated,
          pattern: newPattern
        }
      });
    }
  };
  
  
  const handleFileTypeChange = (type: string, checked: boolean) => {
    const currentTypes = validation.fileTypes || [];
    const newTypes = checked 
      ? [...currentTypes, type]
      : currentTypes.filter(t => t !== type);
    
    handleValidationChange({ fileTypes: newTypes });
  };
  
  const fileTypes = [
    { value: 'image/*', label: 'Images' },
    { value: '.pdf', label: 'PDF' },
    { value: '.doc,.docx', label: 'Word' },
    { value: '.xls,.xlsx', label: 'Excel' },
    { value: '.zip,.rar', label: 'Archive' },
  ];

  return (
    <div className="w-80 bg-white border-l border-gray-200 max-h-[calc(100vh-64px)] overflow-y-auto flex-shrink-0">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Properties</h3>
        
        <div className="space-y-6">
          {/* Field Label */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Field Label</Label>
            <Input
              value={selectedField.label}
              onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
              className="mt-2"
            />
          </div>

          {/* Placeholder */}
          {selectedField.type !== 'checkbox' && selectedField.type !== 'radio' && selectedField.type !== 'file' && selectedField.type !== 'date' && (
            <div>
              <Label className="text-sm font-medium text-gray-700">Placeholder</Label>
              <Input
                value={selectedField.placeholder || ''}
                onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
                className="mt-2"
              />
            </div>
          )}

          {/* Help Text */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Help Text</Label>
            <Textarea
              value={selectedField.helpText || ''}
              onChange={(e) => updateField(selectedField.id, { helpText: e.target.value })}
              rows={3}
              className="mt-2 resize-none"
              placeholder="Enter help text or description"
            />
          </div>

          {/* Required Field Toggle */}
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">Required Field</Label>
            <Switch
              checked={selectedField.required}
              onCheckedChange={(checked) => updateField(selectedField.id, { required: checked })}
            />
          </div>

          {/* Validation Section */}
          {showValidation && (
            <div className="space-y-4 pt-4 border-t border-gray-200 mt-4">
              <h4 className="text-sm font-medium text-gray-700">Validation Rules</h4>
              
              {isTextOrTextarea && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="allow-text" 
                      checked={validation.allowText}
                      onCheckedChange={checked => handleValidationChange({ allowText: checked })}
                    />
                    <Label htmlFor="allow-text" className="text-gray-500">Allow text</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="allow-numbers" 
                      checked={validation.allowNumbers}
                      onCheckedChange={checked => handleValidationChange({ allowNumbers: checked })}
                    />
                    <Label htmlFor="allow-numbers" className="text-gray-500">Allow numbers</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="allow-special" 
                      checked={validation.allowSpecialChars}
                      onCheckedChange={checked => handleValidationChange({ allowSpecialChars: checked })}
                    />
                    <Label htmlFor="allow-special" className="text-gray-500">Allow special characters</Label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-gray-500">Min Length</Label>
                      <Input 
                        type="number" 
                        min="0"
                        value={validation.minLength || ''}
                        onChange={(e) => handleValidationChange({ 
                          minLength: e.target.value ? parseInt(e.target.value) : undefined 
                        })}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Max Length</Label>
                      <Input 
                        type="number" 
                        min={validation.minLength || 0}
                        value={validation.maxLength || ''}
                        onChange={(e) => handleValidationChange({ 
                          maxLength: e.target.value ? parseInt(e.target.value) : undefined 
                        })}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {isFile && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-gray-500">Max File Size (KB)</Label>
                    <Input 
                      type="number" 
                      min="0"
                      value={validation.maxFileSize || ''}
                      onChange={(e) => handleValidationChange({ 
                        maxFileSize: e.target.value ? parseInt(e.target.value) : undefined 
                      })}
                      className="h-8 text-sm mt-1"
                      placeholder="e.g., 1024 (for 1MB)"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs text-gray-500 mb-2 block">Allowed File Types</Label>
                    <div className="space-y-2">
                      {fileTypes.map((type) => (
                        <div key={type.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`file-type-${type.value}`}
                            checked={validation.fileTypes?.includes(type.value) || false}
                            onChange={(e) => handleFileTypeChange(type.value, e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <Label htmlFor={`file-type-${type.value}`} className="text-sm text-gray-500">
                            {type.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    
                    {/* Show the accept attribute preview */}
                    {validation.fileTypes && validation.fileTypes.length > 0 && (
                      <div className="mt-3 p-2 bg-gray-50 rounded border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Will be saved as:</div>
                        <code className="text-xs break-all text-gray-500">
                          accept="{validation.fileTypes.join(',')}"
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {validation.pattern && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-500 break-all">
                  <div className="font-medium mb-1">Pattern:</div>
                  <code>{validation.pattern}</code>
                </div>
              )}
            </div>
          )}
          
          {/* Options (for select and radio fields) */}
          {(selectedField.type === 'select' || selectedField.type === 'radio') && selectedField.options && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                {selectedField.type === 'select' ? 'Dropdown Options' : 'Radio Button Options'}
              </Label>
              <div className="space-y-2">
                {selectedField.options.map((option: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={option}
                      onChange={(e) => {
                        updateOption(selectedField.id, index, e.target.value);
                      }}
                      onBlur={(e) => {
                        if (!e.target.value.trim()) {
                          updateOption(selectedField.id, index, `Option ${index + 1}`);
                        }
                      }}
                      className="flex-1 text-sm"
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-red-500 p-1"
                      onClick={() => removeOption(selectedField.id, index)}
                      disabled={!selectedField.options || selectedField.options.length <= 1}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mt-3 p-0"
                onClick={() => addOption(selectedField.id)}
              >
                <Plus className="w-4 h-4" />
                Add Option
              </Button>
            </div>
          )}

          {/* Field Actions */}
          <div className="pt-6 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => deleteField(selectedField.id)}
            >
              <Trash2 className="w-4 h-4" />
              Delete Field
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

