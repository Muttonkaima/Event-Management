import { create } from 'zustand';
import { Form, FormField, FieldType } from '@/shared/formSchema';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface FormBuilderState {
  form: Partial<Form>;
  fields: FormField[];
  selectedFieldId: string | null;
  savedFormId: number | null;
  isSaving: boolean;
}

interface FormBuilderActions {
  updateForm: (updates: Partial<Form>) => void;
  addField: (fieldType: string) => void;
  updateField: (fieldId: string, updates: Partial<FormField>) => void;
  deleteField: (fieldId: string) => void;
  selectField: (fieldId: string) => void;
  getSelectedField: () => FormField | undefined;
  addOption: (fieldId: string) => void;
  removeOption: (fieldId: string, optionIndex: number) => void;
  updateOption: (fieldId: string, optionIndex: number, value: string) => void;
  saveForm: () => Promise<void>;
  loadForm: (formId: number) => Promise<void>;
  resetForm: () => void;
}

// Helper function to get default label based on field type
const getDefaultLabel = (type: string): string => {
  switch (type) {
    case 'text': return 'Text Input';
    case 'email': return 'Email';
    case 'number': return 'Number';
    case 'textarea': return 'Text Area';
    case 'select': return 'Dropdown';
    case 'radio': return 'Radio Buttons';
    case 'checkbox': return 'Checkbox';
    case 'file': return 'File Upload';
    case 'date': return 'Date';
    case 'phone': return 'Phone';
    default: return 'Field';
  }
};

const getDefaultPlaceholder = (type: string): string => {
  const placeholders: Record<string, string> = {
    'text': 'Enter text here',
    'email': 'your@email.com',
    'number': 'Enter number',
    'textarea': 'Enter your message',
    'select': 'Select an option',
    'radio': 'Select an option',
    'file': 'Choose file',
    'date': 'Select date',
    'phone': 'Enter phone number'
  };
  return placeholders[type] || 'Enter value';
};

export const useFormBuilderStore = create<FormBuilderState & FormBuilderActions>((set, get) => ({
  form: {
    title: 'Event Registration Form',
    description: 'Please fill out the registration form below to secure your spot at the event.',
  },
  fields: [],
  selectedFieldId: null,
  savedFormId: null,
  isSaving: false,

  updateForm: (updates) => {
    set((state) => ({
      form: { ...state.form, ...updates }
    }));
  },

  addField: (type: string) => {
    const fieldType = type as FieldType;
    const baseField: Omit<FormField, 'type' | 'options'> = {
      id: `field-${Date.now()}`,
      label: getDefaultLabel(type),
      placeholder: getDefaultPlaceholder(type),
      required: false,
      helpText: '',
      order: get().fields.length + 1,
    };

    const field: FormField = {
      ...baseField,
      type: fieldType,
      ...(fieldType === 'select' || fieldType === 'radio' 
        ? { options: ['Option 1', 'Option 2'] } 
        : {})
    };

    set((state) => ({
      fields: [...state.fields, field],
      selectedFieldId: field.id
    }));
  },

  updateField: (fieldId: string, updates: Partial<FormField>) =>
    set((state) => {
      const fields = state.fields.map((field) => {
        if (field.id === fieldId) {
          // If this is not a select/radio field, ensure we don't set options
          if (field.type !== 'select' && field.type !== 'radio' && 'options' in updates) {
            const { options, ...rest } = updates;
            return { ...field, ...rest };
          }
          return { ...field, ...updates };
        }
        return field;
      });
      return { fields };
    }),

  deleteField: (fieldId) => {
    set((state) => {
      const newFields = state.fields.filter(field => field.id !== fieldId);
      const newSelectedId = state.selectedFieldId === fieldId 
        ? (newFields.length > 0 ? newFields[0].id : null)
        : state.selectedFieldId;
      
      return {
        fields: newFields,
        selectedFieldId: newSelectedId
      };
    });
  },

  selectField: (fieldId) => {
    set({ selectedFieldId: fieldId });
  },

  getSelectedField: () => {
    const { fields, selectedFieldId } = get();
    return fields.find(field => field.id === selectedFieldId);
  },

  addOption: (fieldId) => {
    set((state) => ({
      fields: state.fields.map(field => 
        field.id === fieldId 
          ? { 
              ...field, 
              options: [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`]
            }
          : field
      )
    }));
  },

  removeOption: (fieldId, optionIndex) => {
    set((state) => ({
      fields: state.fields.map(field => 
        field.id === fieldId 
          ? { 
              ...field, 
              options: field.options?.filter((_, index) => index !== optionIndex)
            }
          : field
      )
    }));
  },

  updateOption: (fieldId, optionIndex, value) => {
    set((state) => ({
      fields: state.fields.map(field => 
        field.id === fieldId 
          ? { 
              ...field, 
              options: field.options?.map((option, index) => 
                index === optionIndex ? (value.trim() || `Option ${optionIndex + 1}`) : option
              )
            }
          : field
      )
    }));
  },

  saveForm: async () => {
    const { form, fields, savedFormId } = get();
    set({ isSaving: true });
    
    try {
      const formData = {
        title: form.title || 'Untitled Form',
        description: form.description || '',
        fields: fields
      };

      let response;
      if (savedFormId) {
        // Update existing form
        response = await apiRequest('PUT', `/api/forms/${savedFormId}`, formData);
      } else {
        // Create new form
        response = await apiRequest('POST', '/api/forms', formData);
      }
      
      const savedForm = await response.json() as Form;
      
      set({ 
        savedFormId: savedForm.id,
        isSaving: false 
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/forms'] });
    } catch (error) {
      set({ isSaving: false });
      throw error;
    }
  },

  loadForm: async (formId: number) => {
    try {
      const response = await apiRequest('GET', `/api/forms/${formId}`);
      const savedForm = await response.json() as Form;
      set({
        form: {
          title: savedForm.title,
          description: savedForm.description
        },
        fields: savedForm.fields || [],
        savedFormId: formId,
        selectedFieldId: null
      });
    } catch (error) {
      console.error('Failed to load form:', error);
      throw error;
    }
  },

  resetForm: () => {
    set({
      form: {
        title: 'Event Registration Form',
        description: 'Please fill out the registration form below to secure your spot at the event.',
      },
      fields: [],
      selectedFieldId: null,
      savedFormId: null,
      isSaving: false
    });
  }
}));
