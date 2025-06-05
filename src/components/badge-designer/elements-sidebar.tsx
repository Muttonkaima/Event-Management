import { useDrag } from 'react-dnd';
import { 
  User, 
  Camera, 
  QrCode, 
  Award, 
  Calendar, 
  MapPin, 
  Hash, 
  UserCheck 
} from 'lucide-react';
import { BadgeElementType } from '@/lib/badge-types';

interface DraggableElementProps {
  type: BadgeElementType;
  icon: React.ReactNode;
  label: string;
}

function DraggableElement({ type, icon, label }: DraggableElementProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'badge-element',
    item: { elementType: type },
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
      className={`flex items-center p-3 bg-gray-50 rounded-lg border border-gray-50 cursor-grab active:cursor-grabbing hover:bg-gray-100 transition-colors ${
        isDragging ? 'opacity-50 transform rotate-1' : ''
      }`}
    >
      <div className="w-5 h-5 text-gray-500 mr-3">
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
  );
}

export function ElementsSidebar() {
  const elements: DraggableElementProps[] = [
    { type: 'attendee-name', icon: <User />, label: 'Attendee Name' },
    { type: 'attendee-photo', icon: <Camera />, label: 'Attendee Photo' },
    { type: 'qr-code', icon: <QrCode />, label: 'QR Code' },
    { type: 'event-logo', icon: <Award />, label: 'Event Logo' },
    { type: 'event-date', icon: <Calendar />, label: 'Event Date' },
    { type: 'event-location', icon: <MapPin />, label: 'Event Location' },
    { type: 'attendee-id', icon: <Hash />, label: 'Attendee ID' },
    { type: 'attendee-role', icon: <UserCheck />, label: 'Attendee Role' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Badge Elements</h2>
        <div className="space-y-3">
          {elements.map((element) => (
            <DraggableElement
              key={element.type}
              type={element.type}
              icon={element.icon}
              label={element.label}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
