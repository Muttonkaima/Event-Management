import { FormField, Form } from '@/shared/formSchema';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FormPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  form: Partial<Form>;
  fields: FormField[];
}

export default function FormPreview({ isOpen, onClose, form, fields }: FormPreviewProps) {
  const renderField = (field: FormField) => {
    const baseClasses = "w-full";
    
    switch (field.type) {
      case 'text-input':
        return (
          <Input
            placeholder={field.placeholder}
            className={baseClasses}
            required={field.required}
          />
        );
      
      case 'email':
        return (
          <Input
            type="email"
            placeholder={field.placeholder}
            className={baseClasses}
            required={field.required}
          />
        );
      
      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            className={baseClasses}
            required={field.required}
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            rows={3}
            className={`${baseClasses} resize-none`}
            required={field.required}
          />
        );
      
      case 'dropdown':
        return (
          <Select required={field.required}>
            <SelectTrigger className={baseClasses}>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.filter(option => option && option.trim()).map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center gap-3">
            <Checkbox required={field.required} />
            <span className="text-sm">{field.label}</span>
          </div>
        );
      
      case 'file':
        return (
          <Input
            type="file"
            className={baseClasses}
            required={field.required}
          />
        );
      
      case 'date':
        return (
          <Input
            type="date"
            placeholder={field.placeholder}
            className={baseClasses}
            required={field.required}
          />
        );
      
      case 'phone':
        return (
          <Input
            type="tel"
            placeholder={field.placeholder}
            className={baseClasses}
            required={field.required}
          />
        );
      
      default:
        return (
          <Input
            placeholder={field.placeholder}
            className={baseClasses}
            required={field.required}
          />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-white overflow-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="text-xl font-semibold text-gray-900">Form Preview</DialogTitle>
            <p className="text-sm text-gray-500 mt-1">This is how your form will appear to users</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4 text-gray-500 cursor-pointer" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Form Header */}
          <div className="text-center space-y-2 pb-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">
              {form.title || "Untitled Form"}
            </h1>
            {form.description && (
              <p className="text-gray-600 max-w-lg mx-auto">
                {form.description}
              </p>
            )}
          </div>

          {/* Form Fields */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {fields.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg font-medium mb-2">No fields added yet</p>
                <p className="text-sm">Add some fields to see the preview</p>
              </div>
            ) : (
              fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  {field.type !== 'checkbox' && (
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                      {field.required && (
                        <Badge variant="destructive" className="ml-2 text-xs px-1 py-0 bg-red-100 text-red-600">
                          Required
                        </Badge>
                      )}
                    </label>
                  )}
                  
                  {renderField(field)}
                  
                  {field.helpText && (
                    <p className="text-xs text-gray-500 mt-1">
                      {field.helpText}
                    </p>
                  )}
                </div>
              ))
            )}

            {fields.length > 0 && (
              <div className="pt-6 border-t">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Submit Form
                </Button>
              </div>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}