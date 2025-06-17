import { useDrop, useDrag } from 'react-dnd';
import { BadgeElement, BadgeElementType, elementDefaults } from '@/lib/badge-types';
import Image from 'next/image';

interface BadgeCanvasProps {
  elements: BadgeElement[];
  backgroundColor: string;
  selectedElementId: string | null;
  width: number;
  height: number;
  onElementAdd: (element: BadgeElement) => void;
  onElementSelect: (elementId: string | null) => void;
  onElementUpdate: (elementId: string, updates: Partial<BadgeElement & { width: number; height: number }>) => void;
}

interface DroppedItem {
  elementType: BadgeElementType;
}

interface MovedItem {
  elementId: string;
  x: number;
  y: number;
}

function BadgeElementComponent({
  element,
  isSelected,
  onSelect,
  onUpdate,
}: {
  element: BadgeElement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<BadgeElement>) => void;
}) {
  const style = element.style || {};

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'canvas-element',
    item: { elementId: element.id, x: element.x, y: element.y },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const setRef = (node: HTMLDivElement | null) => {
    // Type assertion to handle the drag ref
    (drag as (node: HTMLDivElement | null) => void)(node);
  };

  const elementStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: ['attendee-name', 'event-location', 'attendee-role'].includes(element.type)
  ? 'fit-content'
  : `${element.width}px`,
    height: `${element.height}px`,
    cursor: 'move',
    userSelect: 'none',
    fontSize: style.fontSize ? `${style.fontSize}px` : undefined,
    fontWeight: style.fontWeight || 'normal',
    textAlign: style.textAlign as any || 'left',
    color: style.color || '#000000',
    backgroundColor: style.backgroundColor !== 'transparent' ? style.backgroundColor : undefined,
    borderRadius: style.borderRadius ? `${style.borderRadius}px` : undefined,
    outline: isSelected ? '2px solid #3B82F6' : undefined,
    outlineOffset: isSelected ? '2px' : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderContent = () => {
    if (element.type === 'attendee-photo' || element.type === 'event-logo') {
      if (style.imageUrl) {
        return (
          <Image
            src={style.imageUrl}
            alt={element.type}
            className="w-full h-full object-cover"
            width={element.width}
            height={element.height}
            style={{ borderRadius: style.borderRadius ? `${style.borderRadius}px` : undefined }}
          />
        );
      }
      return (
        <div
          className="w-full h-full bg-gray-200 border border-gray-300 flex items-center justify-center text-xs text-gray-500"
          style={{ borderRadius: style.borderRadius ? `${style.borderRadius}px` : undefined }}
        >
          {element.type === 'attendee-photo' ? 'Photo' : 'Logo'}
        </div>
      );
    }

    if (element.type === 'qr-code') {
      return (
        <Image
          src="/images/qrcode.png"
          alt="QR Code"
          className="w-full h-full object-contain"
          width={element.width}
          height={element.height}
        />
      );
    }


    return (
      <div className="w-fit h-full flex items-center">
        {element.content || 'Text'}
      </div>

    );
  };

  return (
    <div
      ref={setRef}
      style={elementStyle}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`badge-element ${isSelected ? 'selected' : ''} hover:border hover:border-gray-400 hover:border-offset-1`}
    >
      {renderContent()}
    </div>
  );
}

export function BadgeCanvas({
  elements,
  backgroundColor,
  selectedElementId,
  width = 400,
  height = 500,
  onElementAdd,
  onElementSelect,
  onElementUpdate,
}: BadgeCanvasProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['badge-element', 'canvas-element'],
    drop: (item: DroppedItem | MovedItem, monitor) => {
      const clientOffset = monitor.getClientOffset();

      if (clientOffset) {
        const canvasRect = document.getElementById('badge-canvas')?.getBoundingClientRect();
        if (canvasRect) {
          const x = clientOffset.x - canvasRect.left;
          const y = clientOffset.y - canvasRect.top;

          // Handle new element from sidebar
          if ('elementType' in item) {
            const defaults = elementDefaults[item.elementType];
            const newElement: BadgeElement = {
              id: `element-${Date.now()}`,
              type: item.elementType,
              x: Math.max(0, Math.min(x - (defaults.width || 100) / 2, width - (defaults.width || 100))),
              y: Math.max(0, Math.min(y - (defaults.height || 30) / 2, height - (defaults.height || 30))),
              width: defaults.width || 100,
              height: defaults.height || 30,
              content: defaults.content || '',
              style: { ...defaults.style },
            };

            onElementAdd(newElement);
          }
          // Handle moving existing element within canvas
          else if ('elementId' in item) {
            const element = elements.find(el => el.id === item.elementId);
            if (element) {
              const newX = Math.max(0, Math.min(x - element.width / 2, width - element.width));
              const newY = Math.max(0, Math.min(y - element.height / 2, height - element.height));

              onElementUpdate(item.elementId, { x: newX, y: newY });
            }
          }
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (


    <div className="flex-1 bg-gray-50 overflow-y-auto p-4 md:p-8">
      <div className="w-fit p-2 mx-auto bg-transparent rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Email header */}
        <div className="border-b border-gray-200 p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="text-xs text-gray-500">
              Canvas
            </div>
            <div className="w-20"></div>
          </div>
        </div>

        {/* Email content */}
        <div className="flex justify-center mt-3">
          <div
            ref={drop as any}
            id="badge-canvas"
            className={`relative border-2 shadow-lg ${isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
              }`}
            style={{
              width: `${width}px`,
              height: `${height}px`,
              backgroundColor: backgroundColor,
            }}
            onClick={() => onElementSelect(null)}
          >
            {elements.map((element) => (
              <BadgeElementComponent
                key={element.id}
                element={element}
                isSelected={selectedElementId === element.id}
                onSelect={() => onElementSelect(element.id)}
                onUpdate={(updates) => onElementUpdate(element.id, updates)}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-2">
         
        </div>
      </div>
    </div>
  );
}
