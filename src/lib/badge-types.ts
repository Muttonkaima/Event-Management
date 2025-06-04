export interface BadgeElement {
  id: string;
  type: BadgeElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style?: {
    fontSize?: number;
    fontWeight?: string;
    textAlign?: string;
    color?: string;
    backgroundColor?: string;
    borderRadius?: number;
    imageUrl?: string;
  };
}

export type BadgeElementType = 
  | 'attendee-name'
  | 'attendee-photo'
  | 'qr-code'
  | 'event-logo'
  | 'event-date'
  | 'event-location'
  | 'attendee-id'
  | 'attendee-role';

export interface BadgeTemplate {
  name: string;
  backgroundColor: string;
  color: 'white' | 'blue' | 'green' | 'pink';
}

export const badgeTemplates: BadgeTemplate[] = [
  { name: 'Simple White', backgroundColor: '#FFFFFF', color: 'white' },
  { name: 'Light Blue', backgroundColor: '#EBF4FF', color: 'blue' },
  { name: 'Light Green', backgroundColor: '#ECFDF5', color: 'green' },
  { name: 'Light Pink', backgroundColor: '#FDF2F8', color: 'pink' },
];

export const elementDefaults: Record<BadgeElementType, Partial<BadgeElement>> = {
  'attendee-name': {
    width: 200,
    height: 40,
    content: 'Attendee Name',
    style: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#000000',
      backgroundColor: 'transparent',
    }
  },
  'attendee-photo': {
    width: 80,
    height: 80,
    content: '',
    style: {
      backgroundColor: '#F3F4F6',
      borderRadius: 4,
      imageUrl: '',
    }
  },
  'qr-code': {
    width: 80,
    height: 80,
    content: 'QR',
    style: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#000000',
      backgroundColor: '#F3F4F6',
      borderRadius: 4,
    }
  },
  'event-logo': {
    width: 120,
    height: 60,
    content: '',
    style: {
      backgroundColor: '#F3F4F6',
      borderRadius: 4,
      imageUrl: '',
    }
  },
  'event-date': {
    width: 150,
    height: 30,
    content: 'Event Date',
    style: {
      fontSize: 14,
      fontWeight: 'normal',
      textAlign: 'left',
      color: '#6B7280',
      backgroundColor: 'transparent',
    }
  },
  'event-location': {
    width: 150,
    height: 30,
    content: 'Event Location',
    style: {
      fontSize: 14,
      fontWeight: 'normal',
      textAlign: 'left',
      color: '#6B7280',
      backgroundColor: 'transparent',
    }
  },
  'attendee-id': {
    width: 100,
    height: 30,
    content: '#12345',
    style: {
      fontSize: 14,
      fontWeight: 'normal',
      textAlign: 'left',
      color: '#374151',
      backgroundColor: 'transparent',
    }
  },
  'attendee-role': {
    width: 120,
    height: 30,
    content: 'Attendee Role',
    style: {
      fontSize: 14,
      fontWeight: 'medium',
      textAlign: 'left',
      color: '#2563EB',
      backgroundColor: 'transparent',
    }
  },
};
