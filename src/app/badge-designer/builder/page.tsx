"use client";

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createBadge, updateBadge } from '@/services/organization/eventService';
import { urlToFile } from '@/utils/urlToFile';
import { ElementsSidebar } from '@/components/badge-designer/elements-sidebar';
import { BadgeCanvas } from '@/components/badge-designer/badge-canvas';
import { PropertiesPanel } from '@/components/badge-designer/properties-panel';
import { PreviewModal } from '@/components/badge-designer/preview-modal';
import { DnDProvider } from '@/lib/dnd-provider';
import { BadgeElement, BadgeTemplate } from '@/lib/badge-types';
import { Button } from '@/components/ui/button';
import { Eye, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';
import { getBadgeById } from '@/services/organization/eventService';

export default function BadgeDesigner() {
  const [elements, setElements] = useState<BadgeElement[]>([
    {
      "id": "element-1750166580357",
      "type": "qr-code",
      "x": 400,
      "y": 200,
      "width": 89,
      "height": 89,
      "content": "QR",
      "style": {
        "backgroundColor": "#F3F4F6",
        "borderRadius": 4,
        "imageUrl": "/images/qrcode.png"
      }
    },
    {
      "id": "element-1750166661091",
      "type": "event-logo",
      "x": 12,
      "y": 15.612503051757812,
      "width": 60,
      "height": 60,
      "content": "",
      "style": {
        "backgroundColor": "#F3F4F6",
        "borderRadius": 4,
        "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSg1mYu4_3BOKxIdmpEbF7-9-jet9_RqOIWO1Pln_3tazUyIQh3L_5SNQ8aslOiax90b_4&usqp=CAU"
      }
    },
    {
      "id": "element-1750166688734",
      "type": "attendee-name",
      "x": 140,
      "y": 18.612503051757812,
      "width": 200,
      "height": 40,
      "content": "SJBIT CULTURAL EVENT",
      "style": {
        "fontSize": 16,
        "fontWeight": "bold",
        "textAlign": "center",
        "color": "#000000",
        "backgroundColor": "transparent"
      }
    },
    {
      "id": "element-1750166742091",
      "type": "event-location",
      "x": 175,
      "y": 52.61250305175781,
      "width": 150,
      "height": 30,
      "content": "Uttarahalli Main Road, Kengeri",
      "style": {
        "fontSize": 11,
        "fontWeight": "normal",
        "textAlign": "left",
        "color": "#6B7280",
        "backgroundColor": "transparent"
      }
    },
    {
      "id": "element-1750166781573",
      "type": "attendee-photo",
      "x": 16,
      "y": 112.61250305175781,
      "width": 80,
      "height": 80,
      "content": "",
      "style": {
        "backgroundColor": "#F3F4F6",
        "borderRadius": 4,
        "imageUrl": "/uploads/upload-1750166892392.jpg"
      }
    },
    {
      "id": "element-1750166796945",
      "type": "attendee-name",
      "x": 146,
      "y": 110.61250305175781,
      "width": 200,
      "height": 40,
      "content": "Mithun Gowda H",
      "style": {
        "fontSize": 18,
        "fontWeight": "bold",
        "textAlign": "center",
        "color": "#000000",
        "backgroundColor": "transparent"
      }
    },
    {
      "id": "element-1750166814444",
      "type": "attendee-role",
      "x": 149,
      "y": 152.6125030517578,
      "width": 120,
      "height": 30,
      "content": "Student",
      "style": {
        "fontSize": 14,
        "fontWeight": "bold",
        "textAlign": "left",
        "color": "#2563EB",
        "backgroundColor": "transparent"
      }
    },
    {
      "id": "element-1750166847055",
      "type": "event-date",
      "x": 149,
      "y": 187.6125030517578,
      "width": 150,
      "height": 30,
      "content": "20 June, 2025",
      "style": {
        "fontSize": 14,
        "fontWeight": "bold",
        "textAlign": "left",
        "color": "#000000",
        "backgroundColor": "transparent"
      }
    }
  ]);

  const [backgroundColor, setBackgroundColor] = useState('#ECFDF5');
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(300);

  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [badgeName, setBadgeName] = useState('My Badge');
  const [badgeDescription, setBadgeDescription] = useState('My Badge Description');
  const [isEditing, setIsEditing] = useState(false);
  const [badgeId, setBadgeId] = useState<string>('');
  const [formErrors, setFormErrors] = useState<{ name?: string; description?: string }>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL;

  // Load badge data if in edit mode
  useEffect(() => {
    const loadBadge = async () => {
      const editId = searchParams?.get('edit');
      if (!editId) {
        setSelectedElementId(elements[0]?.id || null);
        return;
      }

      try {
        const response = await getBadgeById(editId);
        if (response.success && response.data) {
          const badge = response.data;
          setBadgeId(badge._id);
          setIsEditing(true);
          setBadgeName(badge.badges_name);
          setBadgeDescription(badge.badges_description || '');
          setBackgroundColor(badge.backgroundColor || '#ECFDF5');
          setWidth(badge.width || 500);
          setHeight(badge.height || 300);
          
          // Transform elements to include IDs and ensure proper types
          const transformedElements = badge.elements.map((el: any) => ({
            ...el,
            id: el._id || `element-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            width: el.width === 'max-content' ? 200 : Number(el.width),
            height: Number(el.height),
            x: Number(el.x),
            y: Number(el.y),
            style: {
              ...el.style,
              fontSize: Number(el.style?.fontSize) || 14,
            }
          }));
          
          setElements(transformedElements);
          if (transformedElements.length > 0) {
            setSelectedElementId(transformedElements[0].id);
          }
        }
      } catch (error) {
        console.error('Error loading badge:', error);
        toast({
          title: 'Error',
          description: 'Failed to load badge for editing',
          variant: 'destructive',
        });
      }
    };

    loadBadge();
  }, [searchParams, toast, searchParams]);

  const selectedElement = elements.find(el => el.id === selectedElementId) || null;


  const validateForm = () => {
    const errors: { name?: string; description?: string } = {};
    if (!badgeName.trim()) errors.name = 'Badge name is required';
    if (!badgeDescription.trim()) errors.description = 'Description is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const exportBadgeMutation = useMutation({
    mutationFn: async () => {
      if (!validateForm()) {
        throw new Error('Validation failed');
      }

      // Create form data
      const formData = new FormData();

      // Find all elements with images
      const imageElements = elements.filter(el =>
        ['attendee-photo', 'event-logo', 'qr-code'].includes(el.type) &&
        el.style?.imageUrl
      );

      console.log("images in badge", imageElements);

      let imageCounter = 0;

      // Convert image URLs to actual files and update the elements
      for (const element of imageElements) {
        const imgUrl = element.style?.imageUrl;

        // Skip if no image URL or if it's already a plain filename (not a full/relative URL)
        if (!imgUrl || (!/^https?:\/\//i.test(imgUrl) && !imgUrl.startsWith('/'))) {
          continue;
        }

        try {
          let filename: string;
          let fetchUrl = imgUrl;

          // If it's a relative URL (starts with /), convert to absolute
          if (!/^https?:\/\//i.test(imgUrl)) {
            if (imgUrl.startsWith('/assets')) {
              fetchUrl = ASSETS_URL + imgUrl;
            } else if (imgUrl.startsWith('/')) {
              fetchUrl = window.location.origin + imgUrl;
            }
          }          

          try {
            const urlObj = new URL(fetchUrl);
            const pathnameName = urlObj.pathname.split('/').pop();
            const extension = pathnameName?.includes('.') ? pathnameName.split('.').pop() : 'png';
            filename = `badge-img-${imageCounter}.${extension || 'png'}`;
            imageCounter++;
          } catch {
            filename = `badge-img-${imageCounter}.png`;
            imageCounter++;
          }

          const file = await urlToFile(fetchUrl, filename);
          formData.append('images', file);

          if (element.style) {
            element.style.imageUrl = file.name;
          }

        } catch (error) {
          console.error("Error processing image:", error);
          continue;
        }
      }


      // Prepare elements data (remove id and handle width for text elements)
      const elementsForExport = elements.map(({ id, ...rest }) => ({
        ...rest,
        width: ['attendee-name', 'event-location', 'attendee-role', 'event-date'].includes(rest.type)
          ? 'max-content'
          : rest.width.toString()
      }));

      // Prepare elements data
      const elementsData = elementsForExport.map(({ style, ...el }) => ({
        ...el,
        style: style ? JSON.parse(JSON.stringify(style)) : {}
      }));

      // Add fields directly to formData
      formData.append('name', badgeName.trim());
      formData.append('description', badgeDescription.trim());
      formData.append('elements', JSON.stringify(elementsData));
      formData.append('backgroundColor', backgroundColor);
      formData.append('width', width.toString());
      formData.append('height', height.toString());
      formData.append('exportedAt', new Date().toISOString());
      
      // If editing, include the badge ID
      if (isEditing && badgeId) {
        formData.append('_id', badgeId);
      }

      try {
        console.log(
          'Badge FormData contents:',
          [...formData.entries()].map(([k, v]) => [k, v instanceof File ? v.name : v])
        );
        // Save to server
        if (isEditing){
          await updateBadge(badgeId, formData);
        }else{
          await createBadge(formData);
        }

        // Create badge data object for JSON export
        const badgeData = {
          name: badgeName.trim(),
          description: badgeDescription.trim(),
          elements: elementsForExport,
          backgroundColor,
          width,
          height,
          exportedAt: new Date().toISOString(),
        };

        // Download the JSON file for backup
        const blob = new Blob([JSON.stringify(badgeData, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `badge-${badgeName.trim().toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        return { success: true };
      } catch (error) {
        console.error('Error saving badge:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Badge template created successfully',
        variant: 'default'
      });
      router.push('/badge-designer');
    },
    onError: (error) => {
      if (error.message !== 'Validation failed') {
        toast({
          title: 'Failed to save badge',
          description: error.message || 'An error occurred while saving the badge.',
          variant: 'destructive'
        });
      }
    },
  });

  const handleElementAdd = (element: BadgeElement) => {
    setElements(prev => [...prev, element]);
    setSelectedElementId(element.id);
  };

  const handleElementUpdate = (elementId: string, updates: Partial<BadgeElement & { width: number; height: number }>) => {
    if (elementId === 'badge-canvas') {
      if (updates.width !== undefined) setWidth(updates.width);
      if (updates.height !== undefined) setHeight(updates.height);
    } else {
      setElements(prevElements =>
        prevElements.map(el => {
          if (el.id !== elementId) return el;
          // Merge updates with the latest element state
          return { ...el, ...updates, style: { ...el.style, ...updates.style } };
        })
      );
    }
  };

  // Clamp all element positions and sizes after card resize
  useEffect(() => {
    setElements(prevElements =>
      prevElements.map(el => {
        let newX = Math.max(0, Math.min(el.x, width - el.width));
        let newY = Math.max(0, Math.min(el.y, height - el.height));
        let newWidth = Math.min(el.width, width - newX);
        let newHeight = Math.min(el.height, height - newY);
        return {
          ...el,
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        };
      })
    );
  }, [width, height]);

  const handleElementDelete = (elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  };

  const handleTemplateSelect = (template: BadgeTemplate) => {
    setBackgroundColor(template.backgroundColor);
  };

  return (
    <DnDProvider>
      <div className="bg-gray-50 font-sans min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center flex-shrink-0">
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 border-2 border-gray-200 hover:bg-gray-50 hover:text-gray-800 cursor-pointer"
              onClick={() => window.location.href = "/badge-designer"}
            >
              Back to Badges
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 border-2 border-gray-200 hover:text-gray-800 hover:bg-gray-50 cursor-pointer"
              onClick={() => setIsPreviewOpen(true)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              size="sm"
              className="bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
              onClick={() => exportBadgeMutation.mutate()}
              disabled={exportBadgeMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {exportBadgeMutation.isPending 
                ? (isEditing ? 'Updating...' : 'Saving...') 
                : (isEditing ? 'Update Badge' : 'Save Badge')}
            </Button>
          </div>
        </header>


        <div className="flex max-h-[calc(90vh)]">
          <ElementsSidebar />
          <BadgeCanvas
            elements={elements}
            backgroundColor={backgroundColor}
            width={width}
            height={height}
            selectedElementId={selectedElementId}
            onElementAdd={handleElementAdd}
            onElementSelect={setSelectedElementId}
            onElementUpdate={handleElementUpdate}
          />
          <PropertiesPanel
            selectedElement={selectedElement}
            backgroundColor={backgroundColor}
            width={width}
            height={height}
            badgeName={badgeName}
            onBadgeNameChange={setBadgeName}
            badgeDescription={badgeDescription}
            onBadgeDescriptionChange={setBadgeDescription}
            formErrors={formErrors}
            onElementUpdate={handleElementUpdate}
            onElementDelete={handleElementDelete}
            onBackgroundColorChange={setBackgroundColor}
            onTemplateSelect={handleTemplateSelect}
          />
        </div>

        <PreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          elements={elements}
          backgroundColor={backgroundColor}
          width={width}
          height={height}
          onExport={() => exportBadgeMutation.mutate()}
        />
      </div>
    </DnDProvider>
  );
}
