import { useEventWizard } from '@/contexts/EventWizardContext';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getEventTemplates } from '@/services/organization/eventService';


export function Step1Template() {
  const { state, actions } = useEventWizard();
  const { template } = state;
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplates() {
      setLoading(true);
      setError(null);
      try {
        const templates = await getEventTemplates();
        setTemplates(templates.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch templates');
      } finally {
        setLoading(false);
      }
    }
    fetchTemplates();
  }, []);

  const handleNext = () => {
    actions.setStep(2);
  };

  const handleTemplateSelect = (templateId: string) => {
    const selectedTemplate = templates.find(t => t._id === templateId);
    if (selectedTemplate) {
      actions.setTemplate(selectedTemplate);
      actions.updateEvent({ templateImage: selectedTemplate.image });
      // Update branding with template's colors and font
      const colors = selectedTemplate.branding_color_palette_id?.colors?.[0] || {};
      actions.updateBranding({
        themeGradient: colors.bgColor || '',
        sidebarGradient: colors.sidebarColor || '',
        buttonGradient: colors.buttonColor || '',
        fontStyle: selectedTemplate.branding_font_family_id?.font_family || ''
      });
    }
  };

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Choose an Event Template</h2>
        <p className="text-gray-600">Select a template that best fits your event type. You can customize it in the next steps.</p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading templates...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((tmpl) => (
            <div
              key={tmpl._id}
              className={`template-card bg-white rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-200 flex flex-col h-full ${
                template === tmpl._id
                  ? 'border-black border-3'
                  : 'border-gray-200 hover:border-primary hover:shadow-md'
              }`}
              onClick={() => handleTemplateSelect(tmpl._id)}
            >
              {/* Image Section - Top 60% */}
              <div className={`h-0 pb-[60%] relative bg-gradient-to-r ${tmpl.branding_color_palette_id?.colors?.[0] || ''} rounded-t-lg overflow-hidden`}>
                {template === tmpl._id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center z-1">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
                  <Image src={tmpl.image} alt={tmpl.event_template_design_name} className="w-full h-full object-cover" width={800} height={400} />
                </div>
              </div>

              {/* Content Section - Bottom 40% */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{tmpl.event_template_design_name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tmpl.event_template_design_description}</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {tmpl.tags?.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  {template === tmpl._id ? (
                    <div className="text-sm font-medium text-gray-900">
                      Currently selected
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      Click to select
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <Button onClick={handleNext} className="bg-gray-900 text-white hover:bg-gray-800 cursor-pointer" disabled={templates.length === 0}>
          Next Step <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
