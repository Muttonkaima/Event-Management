import { useFormBuilderStore } from "@/store/form-builder-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MousePointer, Trash2, Plus, X } from "lucide-react";

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

  const selectedField = getSelectedField();

  if (!selectedField) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex-shrink-0">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-6">Field Properties</h3>
          <div className="text-center py-12 text-gray-500">
            <MousePointer className="w-8 h-8 mx-auto mb-4 text-gray-300" />
            <p className="text-sm font-medium mb-1">No field selected</p>
            <p className="text-xs">Click on a field in the form to edit its properties</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 max-h-[calc(100vh-64px)] overflow-y-auto flex-shrink-0">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-6">Field Properties</h3>
        
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
          {selectedField.type !== 'checkbox' && (
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

          {/* Options (for dropdown fields) */}
          {selectedField.type === 'dropdown' && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Options</Label>
              <div className="space-y-2">
                {selectedField.options?.map((option: string, index: number) => (
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
