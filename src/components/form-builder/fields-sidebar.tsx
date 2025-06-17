import { useDrag } from "react-dnd";
import { 
  AlignLeft, 
  Mail, 
  Hash, 
  ChevronDown, 
  CheckSquare, 
  Upload, 
  Calendar, 
  Phone,
  Circle
} from "lucide-react";

interface FieldType {
  type: string;
  label: string;
  icon: React.ReactNode;
}

const fieldTypes: FieldType[] = [
  { type: 'text', label: 'Text Input', icon: <AlignLeft className="w-4 h-4" /> },
  { type: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
  { type: 'number', label: 'Number', icon: <Hash className="w-4 h-4" /> },
  { type: 'textarea', label: 'Text Area', icon: <AlignLeft className="w-4 h-4" /> },
  { type: 'select', label: 'Dropdown', icon: <ChevronDown className="w-4 h-4" /> },
  { type: 'radio', label: 'Radio Buttons', icon: <Circle className="w-4 h-4" /> },
  { type: 'checkbox', label: 'Checkbox', icon: <CheckSquare className="w-4 h-4" /> },
  { type: 'file', label: 'File Upload', icon: <Upload className="w-4 h-4" /> },
  { type: 'date', label: 'Date', icon: <Calendar className="w-4 h-4" /> },
  { type: 'phone', label: 'Phone', icon: <Phone className="w-4 h-4" /> },
];

interface DraggableFieldProps {
  fieldType: FieldType;
}

function DraggableField({ fieldType }: DraggableFieldProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'field',
    item: { fieldType: fieldType.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const setRef = (node: HTMLDivElement | null) => {
    // Type assertion to handle the drag ref
    (drag as (node: HTMLDivElement | null) => void)(node);
  };

  return (
    <div
      ref={setRef}
      className={`flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-grab active:cursor-grabbing transition-colors border border-transparent hover:border-gray-200 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="text-gray-500">{fieldType.icon}</div>
      <span className="text-sm font-medium text-gray-700">{fieldType.label}</span>
    </div>
  );
}

export default function FieldsSidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Fields</h3>
        <div className="space-y-2">
          {fieldTypes.map((fieldType) => (
            <DraggableField key={fieldType.type} fieldType={fieldType} />
          ))}
        </div>
      </div>
    </div>
  );
}
