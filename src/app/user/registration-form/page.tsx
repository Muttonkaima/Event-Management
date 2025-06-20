"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getRegistrationFormById } from "@/services/organization/eventService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";

type FormField = {
  type: string;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  validation?: Array<{ pattern?: string }>;
  options?: string[];
  _id: string;
};

type FormData = {
  [key: string]: string | File | null;
};

export default function RegistrationFormPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("event_id");
  const formId = searchParams.get("form_id");
  
  const [formData, setFormData] = useState<FormData>({});
  const [form, setForm] = useState<{
    _id: string;
    registration_form_name: string;
    registration_form_description: string;
    fields: FormField[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (formId) {
      fetchForm();
    }
  }, [formId]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const response = await getRegistrationFormById(formId!);
      if (response?.data) {
        setForm(response.data);
        // Initialize form data with empty values
        const initialData: FormData = {};
        response.data.fields.forEach((field: FormField) => {
          initialData[field._id] = "";
        });
        setFormData(initialData);
      }
    } catch (error) {
      console.error("Error fetching form:", error);
      toast({
        title: "Error",
        description: "Failed to load registration form",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleFileChange = (fieldId: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: file
    }));
  };

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && !value) {
      return "This field is required";
    }

    if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address";
    }

    if (field.validation?.[0]?.pattern && value) {
      const regex = new RegExp(field.validation[0].pattern);
      if (!regex.test(value)) {
        return field.helpText || "Invalid format";
      }
    }

    return null;
  };

  const validateForm = (): boolean => {
    if (!form) return false;
    
    const newErrors: {[key: string]: string} = {};
    let isValid = true;

    form.fields.forEach(field => {
      const error = validateField(field, formData[field._id]);
      if (error) {
        newErrors[field._id] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      // Prepare form data for submission
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          formDataToSend.append(key, value);
        } else if (value !== null) {
          formDataToSend.append(key, value);
        }
      });

      // TODO: Replace with your actual API endpoint
      // const response = await fetch('/api/submit-registration', {
      //   method: 'POST',
      //   body: formDataToSend,
      // });
      // const result = await response.json();

      toast({
        title: "Success!",
        description: "Your registration has been submitted successfully.",
      });
      
      // Reset form after successful submission
      const initialData: FormData = {};
      form?.fields.forEach((field: FormField) => {
        initialData[field._id] = "";
      });
      setFormData(initialData);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to submit registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const fieldId = field._id;
    const error = errors[fieldId];
    const isRequired = field.required;

    switch (field.type) {
      case "text":
      case "email":
        return (
          <div key={fieldId} className="mb-4">
            <Label htmlFor={fieldId} className="font-medium text-gray-700">
              {field.label} {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={fieldId}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[fieldId] as string || ""}
              onChange={(e) => handleChange(fieldId, e.target.value)}
              className={`mt-1 ${error ? 'border-red-500' : ''}`}
              required={isRequired}
            />
            {field.helpText && (
              <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
            )}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        );

      case "select":
        return (
          <div key={fieldId} className="mb-4">
            <Label htmlFor={fieldId} className="font-medium text-gray-700">
              {field.label} {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <Select
              onValueChange={(value) => handleChange(fieldId, value)}
              value={formData[fieldId] as string || ""}
              required={isRequired}
            >
              <SelectTrigger className={`mt-1 ${error ? 'border-red-500' : ''}`}>
                <SelectValue placeholder={field.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.length ? (
                  field.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-options" disabled>
                    No options available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {field.helpText && (
              <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
            )}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        );

      case "radio":
        return (
          <div key={fieldId} className="mb-4">
            <Label className="font-medium text-gray-700">
              {field.label} {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <RadioGroup
              onValueChange={(value) => handleChange(fieldId, value)}
              value={formData[fieldId] as string || ""}
              className="space-y-2"
              required={isRequired}
            >
              {field.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${fieldId}-${option}`} required={isRequired} />
                  <Label htmlFor={`${fieldId}-${option}`} className="font-medium text-gray-700">{option}</Label>
                </div>
              ))}
            </RadioGroup>
            {field.helpText && (
              <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
            )}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        );

      case "file":
        return (
          <div key={fieldId} className="mb-4">
            <Label htmlFor={fieldId} className="font-medium text-gray-700">
              {field.label} {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={fieldId}
              type="file"
              className="mt-1"
              required={isRequired}
              onChange={(e) => handleFileChange(fieldId, e.target.files?.[0] || null)}
            />
            {field.helpText && (
              <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
            )}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading registration form...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Form Not Found</h2>
          <p className="text-gray-600">The requested registration form could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{form.registration_form_name}</h1>
              {form.registration_form_description && (
                <p className="mt-2 text-gray-600">{form.registration_form_description}</p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {form.fields.map((field) => renderField(field))}
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-black hover:bg-gray-800 text-white py-3 px-4 rounded-md text-base font-medium transition-colors"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Registration"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}