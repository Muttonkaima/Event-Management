import { useDrop } from "react-dnd";
import { useFormBuilderStore } from "@/store/form-builder-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MousePointer } from "lucide-react";
import FieldComponent from "./field-components";

export default function FormCanvas() {
  const { form, updateForm, addField, fields, selectedFieldId, selectField } = useFormBuilderStore();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'field',
    drop: (item: { fieldType: string }) => {
      addField(item.fieldType);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-4 my-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
     <div>
      <div className="border-b border-gray-200 p-4 mb-3 bg-white">
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
      {/* Form Title Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Form Title</h3>
        <Input
          value={form.title}
          onChange={(e) => updateForm({ title: e.target.value })}
          className="text-lg font-medium"
          placeholder="Enter form title"
        />
      </div>

      {/* Form Description Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Form Description</h3>
        <Textarea
          value={form.description || ''}
          onChange={(e) => updateForm({ description: e.target.value })}
          rows={3}
          className="resize-none"
          placeholder="Enter form description"
        />
      </div>

      {/* Form Preview Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-6">Form Preview</h3>

        {/* Drop Zone */}
        <div
          ref={drop}
          className={`min-h-96 border-2 border-dashed rounded-lg p-6 transition-colors ${isOver
            ? 'border-blue-300 bg-blue-50'
            : 'border-gray-200'
            }`}
        >
          {fields.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MousePointer className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Drag fields here to build your form</p>
              <p className="text-sm">Start by dragging form fields from the left sidebar</p>
            </div>
          ) : (
            <div className="space-y-6">
              {fields.map((field) => (
                <FieldComponent
                  key={field.id}
                  field={field}
                  isSelected={selectedFieldId === field.id}
                  onSelect={() => selectField(field.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
