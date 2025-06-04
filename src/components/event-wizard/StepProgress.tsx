import { useEventWizard } from '@/contexts/EventWizardContext';
import { Check } from 'lucide-react';

const steps = [
  { number: 1, title: 'Select Template' },
  { number: 2, title: 'Event Details' },
  { number: 3, title: 'Branding' },
  { number: 4, title: 'Schedule' },
  { number: 5, title: 'Registration' }
];

export function StepProgress() {
  const { state } = useEventWizard();
  const { currentStep } = state;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-8 mb-6">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-200 ${
                  step.number < currentStep
                    ? 'bg-green-500 text-white'
                    : step.number === currentStep
                    ? 'bg-primary text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {step.number < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`text-sm font-medium transition-colors duration-200 ${
                  step.number <= currentStep
                    ? step.number < currentStep
                      ? 'text-green-600'
                      : 'text-gray-900'
                    : 'text-gray-500'
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-20 h-0.5 mx-4 transition-colors duration-200 ${
                  step.number < currentStep ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
