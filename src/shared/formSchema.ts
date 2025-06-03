export interface FormField {
  id: string;
  type: 'text-input' | 'email' | 'number' | 'textarea' | 'dropdown' | 'checkbox' | 'file' | 'date' | 'phone';
  label: string;
  placeholder?: string;
  required: boolean;
  helpText?: string;
  options?: string[];
  order: number;
}

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
