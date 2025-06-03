import { FormField } from "@/shared/formSchema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useFormBuilderStore } from "@/store/form-builder-store";

interface FieldComponentProps {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
}

export default function FieldComponent({ field, isSelected, onSelect }: FieldComponentProps) {
  const { deleteField } = useFormBuilderStore();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteField(field.id);
  };

  const renderFieldInput = () => {
    switch (field.type) {
      case 'text-input':
        return (
          <Input
            placeholder={field.placeholder}
            disabled
            className="w-full"
          />
        );
      
      case 'email':
        return (
          <Input
            type="email"
            placeholder={field.placeholder}
            disabled
            className="w-full"
          />
        );
      
      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            disabled
            className="w-full"
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            disabled
            rows={3}
            className="w-full resize-none"
          />
        );
      
      case 'dropdown':
        return (
          <Select disabled>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.filter(option => option && option.trim()).map((option, index) => (
                <SelectItem key={index} value={option || `option-${index}`}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center gap-3">
            <Checkbox disabled />
            <span className="text-sm text-gray-700">{field.label}</span>
          </div>
        );
      
      case 'file':
        return (
          <Input
            type="file"
            disabled
            className="w-full"
          />
        );
      
      case 'date':
        return (
          <Input
            type="date"
            placeholder={field.placeholder}
            disabled
            className="w-full"
          />
        );
      
      case 'phone':
        return (
          <Input
            type="tel"
            placeholder={field.placeholder}
            disabled
            className="w-full"
          />
        );
      
      default:
        return (
          <Input
            placeholder={field.placeholder}
            disabled
            className="w-full"
          />
        );
    }
  };

  return (
    <div
      className={`p-3 rounded-lg cursor-pointer transition-all border ${
        isSelected 
          ? 'border-2 border-blue-200 bg-blue-50' 
          : 'border border-transparent hover:border-gray-200 hover:bg-gray-50'
      }`}
      onClick={onSelect}
    >
      {field.type !== 'checkbox' && (
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-red-500 p-1 h-auto"
            onClick={handleDelete}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      )}
      
      <div className={field.type === 'checkbox' ? 'flex items-center justify-between' : ''}>
        {renderFieldInput()}
        {field.type === 'checkbox' && (
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-red-500 p-1 h-auto"
            onClick={handleDelete}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        )}
      </div>
      
      {field.helpText && (
        <p className="text-xs text-gray-500 mt-2">{field.helpText}</p>
      )}
    </div>
  );
}
