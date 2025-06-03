// React DnD type definitions and utilities
export const ItemTypes = {
  FIELD: 'field',
} as const;

export interface DragItem {
  fieldType: string;
}

export interface DropResult {
  fieldType: string;
}
