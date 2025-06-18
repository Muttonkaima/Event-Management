'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { EmailBuilderClient } from "@/components/email/EmailBuilderClient";
import { getEmailTemplateById } from '@/services/organization/eventService';
import { toast } from '@/hooks/use-toast';

export default function EmailBuilderPage() {
  const searchParams = useSearchParams();
  const [initialData, setInitialData] = useState<any>({
    blocks: [],
    emailSubject: '',
    previewText: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL;
  
  useEffect(() => {
    const fetchTemplate = async () => {
      const templateId = searchParams?.get('edit');
      
      // If no template ID, we'll use the default blocks
      if (!templateId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getEmailTemplateById(templateId);
        if (response.success && response.data) {
          const template = response.data;
          setInitialData({
            blocks: template.email_fields.map((field: any) => {
              const updatedProperties = { ...field.properties };
      
              if (field.type === 'image' && updatedProperties.imageUrl) {
                updatedProperties.imageUrl = ASSETS_URL + updatedProperties.imageUrl;
              }
      
              return {
                id: field._id || `${field.type}-${Date.now()}`,
                type: field.type,
                properties: updatedProperties
              };
            }) || [],
            emailSubject: template.email_template_name || '',
            previewText: template.email_template_description || ''
          });
        }
      }
       catch (error) {
        console.error('Error fetching template:', error);
        toast({
          title: 'Error',
          description: 'Failed to load template',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplate();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <EmailBuilderClient 
      initialData={initialData} 
      templateId={searchParams?.get('edit') || undefined} 
    />
  );
}
