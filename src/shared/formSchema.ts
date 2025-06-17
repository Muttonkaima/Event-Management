export type FieldType = 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file' | 'date' | 'phone';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  helpText?: string;
  order: number;
  options?: string[]; // Only used for 'select' and 'radio' types
}

// Type guard to check if a field has options
const hasOptions = (field: FormField): field is FormField & { options: string[] } => {
  return (field.type === 'select' || field.type === 'radio') && Array.isArray(field.options);
};

export interface Form {
  id?: number;
  title: string;
  description: string;
  fields: FormField[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FormResponse {
  id: number;
  formId: number;
  data: Record<string, any>;
  submittedAt: string;
}

export interface FormWithResponses extends Form {
  responses: FormResponse[];
}

export const defaultForm: Form = {
  title: 'Untitled Form',
  description: '',
  fields: [],
};
