import { useEventWizard } from '@/contexts/EventWizardContext';
import { EventTemplate } from '@/shared/eventSchema';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const templates = [
  {
    id: 'professional' as EventTemplate,
    name: 'Professional Conference',
    description: 'Perfect for business conferences, seminars, and industry events.',
    color: 'from-blue-500 to-purple-600',
    tags: ['Multiple tracks', 'Speaker profiles', 'Networking sessions']
  },
  {
    id: 'workshop' as EventTemplate,
    name: 'Interactive Workshop',
    description: 'Engaging workshops, training sessions, and hands-on activities.',
    color: 'from-green-500 to-teal-600',
    tags: ['Training formats', 'Group activities', 'Resource sharing']
  },
  {
    id: 'social' as EventTemplate,
    name: 'Social Gathering',
    description: 'Casual meetups, networking events, and social celebrations.',
    color: 'from-orange-500 to-red-500',
    tags: ['Casual format', 'RSVP options', 'Social sharing']
  },
  {
    id: 'webinar' as EventTemplate,
    name: 'Virtual Webinar',
    description: 'Online presentations, webinars, and virtual events.',
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
            className={`template-card bg-white rounded-xl border-2 p-6 cursor-pointer transition-all duration-200 ${
              template === tmpl.id
                ? 'border-primary bg-blue-50'
                : 'border-gray-200 hover:border-primary hover:shadow-md'
            }`}
            onClick={() => actions.setTemplate(tmpl.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${tmpl.color} rounded-lg flex items-center justify-center`}>
                <div className="w-6 h-6 bg-white rounded opacity-80" />
              </div>
              {template === tmpl.id && (
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{tmpl.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{tmpl.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {tmpl.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="text-xs text-gray-500">
              {template === tmpl.id ? 'Currently selected' : 'Click to select'}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleNext} className="bg-gray-900 text-white hover:bg-gray-800">
          Next Step <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
