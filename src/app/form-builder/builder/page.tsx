"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import FormBuilderComponent from "@/components/form-builder/form-builder";
import { useFormBuilderStore } from '@/store/form-builder-store';
import { getRegistrationFormById } from '@/services/organization/eventService';

export default function FormBuilderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const { updateForm, setFields, resetForm } = useFormBuilderStore();

  useEffect(() => {
    const loadForm = async () => {
      const editId = searchParams?.get('edit');
      
      if (!editId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getRegistrationFormById(editId);
        if (response.success && response.data) {
          const formData = response.data;
          
          // Update form details
          updateForm({
            id: formData._id,
            title: formData.registration_form_name,
            description: formData.registration_form_description || '',
          });

          // Transform fields to match the expected format
          const transformedFields = formData.fields.map((field: any) => {
            // Extract validation pattern if it exists
            let validation;
            if (field.validation && field.validation.length > 0) {
              const pattern = field.validation[0].pattern;
              if (pattern) {
                validation = {
                  pattern: pattern,
                  // Set default values for validation toggles
                  allowText: /[a-zA-Z]/.test(pattern),
                  allowNumbers: /\d/.test(pattern),
                  allowSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]/.test(pattern),
                };
              } else if (field.validation[0].accept) {
                // Handle file validation
                validation = {
                  fileTypes: field.validation[0].accept.split(','),
                  maxFileSize: field.validation[0].file_size
                };
              }
            }

            return {
              id: field._id || `field-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              type: field.type,
              label: field.label,
              placeholder: field.placeholder || '',
              helpText: field.helpText || '',
              required: field.required || false,
              options: field.options || [],
              validation: validation
            };
          });

          // Set the transformed fields
          setFields(transformedFields);
        } else {
          toast({
            title: 'Error',
            description: 'Failed to load form data',
            variant: 'destructive',
          });
          router.push('/form-builder');
        }
      } catch (error) {
        console.error('Error loading form:', error);
        toast({
          title: 'Error',
          description: 'An error occurred while loading the form',
          variant: 'destructive',
        });
        router.push('/form-builder');
      } finally {
        setIsLoading(false);
      }
    };

    loadForm();

    // Cleanup function to reset the form when component unmounts
    return () => {
      resetForm();
    };
  }, [searchParams, updateForm, setFields, resetForm, router, toast]);

  if (isLoading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50">
      <FormBuilderComponent />
    </div>
  );
}
