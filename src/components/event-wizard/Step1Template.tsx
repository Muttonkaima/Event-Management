import { useEventWizard } from '@/contexts/EventWizardContext';
import { EventTemplate } from '@/shared/eventSchema';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const templates = [
  {
    id: 'professional' as EventTemplate,
    name: 'Professional Conference',
    description: 'Perfect for business conferences, seminars, and industry events.',
    image: '/images/image1.jpg',
    color: 'from-blue-500 to-purple-600',
    tags: ['Multiple tracks', 'Speaker profiles', 'Networking sessions']
  },
  {
    id: 'workshop' as EventTemplate,
    name: 'Interactive Workshop',
    description: 'Engaging workshops, training sessions, and hands-on activities.',
    image: '/images/image2.jpg',
    color: 'from-green-500 to-teal-600',
    tags: ['Training formats', 'Group activities', 'Resource sharing']
  },
  {
    id: 'social' as EventTemplate,
    name: 'Social Gathering',
    description: 'Casual meetups, networking events, and social celebrations.',
    image: '/images/image3.jpeg',
    color: 'from-orange-500 to-red-500',
    tags: ['Casual format', 'RSVP options', 'Social sharing']
  },
  {
    id: 'webinar' as EventTemplate,
    name: 'Virtual Webinar',
    description: 'Online presentations, webinars, and virtual events.',
    image: '/images/image4.jpg',
    color: 'from-purple-500 to-indigo-600',
    tags: ['Live streaming', 'Q&A sessions', 'Digital handouts']
  }
];

export function Step1Template() {
  const { state, actions } = useEventWizard();
  const { template } = state;

  const handleNext = () => {
    actions.setStep(2);
  };

  const handleTemplateSelect = (templateId: EventTemplate) => {
    const selectedTemplate = templates.find(t => t.id === templateId);
    if (selectedTemplate) {
      actions.setTemplate(templateId);
      // Update the template image in the context
      actions.updateEvent({ templateImage: selectedTemplate.image });
    }
  };

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Choose an Event Template</h2>
        <p className="text-gray-600">Select a template that best fits your event type. You can customize it in the next steps.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((tmpl) => (
          <div
            key={tmpl.id}
            className={`template-card bg-white rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-200 flex flex-col h-full ${
              template === tmpl.id
                ? 'border-black border-3'
                : 'border-gray-200 hover:border-primary hover:shadow-md'
            }`}
            onClick={() => handleTemplateSelect(tmpl.id)}
          >
            {/* Image Section - Top 60% */}
            <div className="h-0 pb-[60%] relative bg-gradient-to-r ${tmpl.color} rounded-t-lg overflow-hidden">
              {template === tmpl.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center z-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
                <img src={tmpl.image} alt={tmpl.name} className="w-full h-full object-cover" />
              </div>
            </div>
            
            {/* Content Section - Bottom 40% */}
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{tmpl.name}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tmpl.description}</p>
              
              <div className="flex flex-wrap gap-1.5 mb-3">
                {tmpl.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="mt-auto">
                {template === tmpl.id ? (
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

      <div className="mt-8 flex justify-end">
        <Button onClick={handleNext} className="bg-gray-900 text-white hover:bg-gray-800 cursor-pointer">
          Next Step <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
