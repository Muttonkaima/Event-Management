import { FormField, Form } from '@/shared/formSchema';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
            <span className="text-sm text-gray-700">{field.label}</span>
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
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto p-0 bg-white">
        <DialogHeader className="border-b border-gray-200 p-3 sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Form Preview
                <span className="ml-2 text-xs text-gray-400">{form.id}</span>
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                This is how your form will appear to users
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 cursor-pointer"
            >
              <X className="h-5 w-5 text-gray-500" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto p-6">
          {/* Email Container */}
          <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Email Header */}
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-sm text-gray-500">
                  {form.title}
                </div>
                <div className="w-12"></div>
              </div>
            </div>



            {/* Email Content */}
            <div className="p-8">
              <div className="mb-6 text-center">
                <div className="text-3xl font-semibold text-gray-900">
                  {form.title}
                </div>
                {/* Preview Text (hidden in most email clients but visible in inbox) */}
                <div className="text-gray-500 text-md mb-6">
                  {form.description}
                </div>
              </div>

              {/* Email Body */}
              <div className="prose max-w-none">
                {fields.length > 0 ? (
                  fields.map((field) => (
                    <div key={field.id} className="mb-6 last:mb-0">
                      <div className="mb-2 text-sm text-gray-900 flex items-center gap-1">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </div>
                      {renderField(field)}
                      {field.helpText && (
                        <div className="text-xs text-gray-500 mt-1">{field.helpText}</div>
                      )}
                    </div>

                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-lg font-medium mb-2">No content added yet</p>
                    <p className="text-sm">Add some blocks to see the preview</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-not-allowed"
                >Submit</Button>
              </div>
              {/* Email Footer */}
              <div className="mt-12 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
                <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
                <p className="mt-1">
                  <a href="#" className="text-blue-600 hover:underline">Unsubscribe</a> |
                  <a href="#" className="text-blue-600 hover:underline ml-2">View in browser</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}