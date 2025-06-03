'use client';

import { DndProvider as DndProviderOriginal } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export function DndProvider({ children }: { children: React.ReactNode }) {
  return (
    <DndProviderOriginal backend={HTML5Backend}>
      {children}
    </DndProviderOriginal>
  );
}
