import { EmailBlock } from "@/shared/schema";

export const defaultBlocks: EmailBlock[] = [
  {
    id: 'header-1',
    type: 'header',
    properties: {
      headerText: 'Welcome to Our Newsletter',
      textAlignment: 'center',
      fontSize: 24,
      fontWeight: 'bold',
      textColor: '#000000',
      backgroundColor: '#ffffff',
      padding: 16
    }
  },
  {
    id: 'text-1',
    type: 'text',
    properties: {
      textContent: 'This is a sample newsletter. You can edit this content and add more blocks to create your custom email template.',
      textAlignment: 'left',
      fontSize: 16,
      fontWeight: 'normal',
      textColor: '#374151',
      backgroundColor: 'transparent',
      padding: 16
    }
  },
  {
    id: 'image-1',
    type: 'image',
    properties: {
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
      backgroundColor: 'transparent',
      padding: 16,
      borderRadius: 4
    }
  },
  {
    id: 'text-2',
    type: 'text',
    properties: {
      textContent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.',
      textAlignment: 'left',
      fontSize: 16,
      fontWeight: 'normal',
      textColor: '#374151',
      backgroundColor: 'transparent',
      padding: 16
    }
  },
  {
    id: 'button-1',
    type: 'button',
    properties: {
      buttonText: 'Read More',
      textAlignment: 'center',
      fontSize: 16,
      fontWeight: 'medium',
      textColor: '#ffffff',
      backgroundColor: 'blue',
      padding: 16,
      borderRadius: 10
    }
  },
  {
    id: 'divider-1',
    type: 'divider',
    properties: {
      backgroundColor: 'transparent',
      padding: 16,
      borderColor: '#e5e7eb',
      borderWidth: 1,
      margin: 16
    }
  }
];

export const blockTemplates = {
  header: {
    type: 'header' as const,
    properties: {
      headerText: 'Header Text',
      textAlignment: 'center',
      fontSize: 24,
      fontWeight: 'bold',
      textColor: '#000000',
      backgroundColor: '#ffffff',
      padding: 16
    }
  },
  text: {
    type: 'text' as const,
    properties: {
      textContent: 'Sample text content.',
      textAlignment: 'left',
      fontSize: 16,
      fontWeight: 'normal',
      textColor: '#374151',
      backgroundColor: 'transparent',
      padding: 16
    }
  },
  image: {
    type: 'image' as const,
    properties: {
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
      backgroundColor: 'transparent',
      padding: 16,
      borderRadius: 4
    }
  },
  button: {
    type: 'button' as const,
    properties: {
      buttonText: 'Button Text',
      textAlignment: 'center',
      fontSize: 16,
      fontWeight: 'medium',
      textColor: '#ffffff',
      backgroundColor: 'blue',
      padding: 16,
      borderRadius: 4
    }
  },
  divider: {
    type: 'divider' as const,
    properties: {
      backgroundColor: 'transparent',
      padding: 16,
      borderColor: '#e5e7eb',
      borderWidth: 1,
      margin: 16
    }
  }
};
