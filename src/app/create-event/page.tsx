"use client";

import { EventWizardProvider } from '@/contexts/EventWizardContext';
import { StepProgress } from '@/components/event-wizard/StepProgress';
import { Step1Template } from '@/components/event-wizard/Step1Template';
import { Step2Details } from '@/components/event-wizard/Step2Details';
import { Step3Branding } from '@/components/event-wizard/Step3Branding';
import { Step4Schedule } from '@/components/event-wizard/Step4Schedule';
import { Step5Registration } from '@/components/event-wizard/Step5Registration';
import { LivePreview } from '@/components/event-wizard/LivePreview';
import { useEventWizard } from '@/contexts/EventWizardContext';
import Header from '@/components/event-wizard/Header';

function WizardContent() {
  const { state } = useEventWizard();
  const { currentStep } = state;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Template />;
      case 2:
        return <Step2Details />;
      case 3:
        return <Step3Branding />;
      case 4:
        return <Step4Schedule />;
      case 5:
        return <Step5Registration />;
      default:
        return <Step1Template />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleSidebarAction={() => {}} />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Step Progress */}
        <StepProgress />

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content - Wizard Steps */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              {renderCurrentStep()}
            </div>
          </div>

          {/* Right Sidebar - Live Preview */}
          <div className="lg:col-span-1">
            <LivePreview />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventWizardPage() {
  return (
    <EventWizardProvider>
      <WizardContent />
    </EventWizardProvider>
  );
}
