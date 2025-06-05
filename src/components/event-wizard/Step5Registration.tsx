import { useEventWizard } from '@/contexts/EventWizardContext';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function Step5Registration() {
  const router = useRouter();
  const { state, actions } = useEventWizard();
  const { registration } = state;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [limitAttendees, setLimitAttendees] = useState(!!registration.maxAttendees);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!registration.registrationOpen) {
      newErrors.registrationOpen = 'Registration open date is required';
    }
    if (!registration.registrationClose) {
      newErrors.registrationClose = 'Registration close date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePrevious = () => {
    actions.setStep(4);
  };

  const handleComplete = () => {
    if (validateForm()) {
      // Here you would typically save the event data
      alert('🎉 Event setup completed successfully! Your event is now ready to publish.');
      router.push('/events');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    actions.updateRegistration({ [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleAttendeeLimit = (checked: boolean) => {
    setLimitAttendees(checked);
    if (!checked) {
      actions.updateRegistration({ maxAttendees: undefined });
    }
  };

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Registration & Settings</h2>
        <p className="text-gray-600">Configure registration details and additional settings for your event.</p>
      </div>

      <div className="space-y-8">
        {/* Registration Period */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Period</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="registrationOpen" className="text-sm font-medium text-gray-700">Registration Opens *</Label>
              <Input
                type="datetime-local"
                id="registrationOpen"
                value={registration.registrationOpen}
                onChange={(e) => handleInputChange('registrationOpen', e.target.value)}
                className={errors.registrationOpen ? 'border-red-500' : ''}
              />
              {errors.registrationOpen && (
                <p className="text-red-500 text-sm mt-1">{errors.registrationOpen}</p>
              )}
            </div>
            <div>
              <Label htmlFor="registrationClose" className="text-sm font-medium text-gray-700">Registration Closes *</Label>
              <Input
                type="datetime-local"
                id="registrationClose"
                value={registration.registrationClose}
                onChange={(e) => handleInputChange('registrationClose', e.target.value)}
                className={errors.registrationClose ? 'border-red-500' : ''}
              />
              {errors.registrationClose && (
                <p className="text-red-500 text-sm mt-1">{errors.registrationClose}</p>
              )}
            </div>
          </div>
        </div>

        {/* Attendee Limit */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendee Limit</h3>
          <div className="flex items-center space-x-4 mb-4">
            <Checkbox
              id="limitAttendees"
              checked={limitAttendees}
              onCheckedChange={toggleAttendeeLimit}
            />
            <Label htmlFor="limitAttendees" className="text-sm font-medium text-gray-700">
              Limit the number of attendees
            </Label>
          </div>
          {limitAttendees && (
            <Input
              type="number"
              placeholder="Maximum number of attendees"
              value={registration.maxAttendees || ''}
              onChange={(e) => handleInputChange('maxAttendees', parseInt(e.target.value) || undefined)}
              className="w-full"
            />
          )}
        </div>



        {/* Payment Options */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Options</h3>
       
          <RadioGroup
            value={registration.paymentType}
            onValueChange={(value: 'free' | 'paid') => handleInputChange('paymentType', value)}
            className="space-x-3 flex"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="free" id="free" className="cursor-pointer text-gray-700" />
              <Label htmlFor="free" className="text-sm font-medium text-gray-700">Free</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paid" id="paid" className="cursor-pointer text-gray-700" />
              <Label htmlFor="paid" className="text-sm font-medium text-gray-700">Paid</Label>
            </div>
          </RadioGroup>

          {registration.paymentType === 'paid' && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ticketPrice" className="text-sm font-medium text-gray-700">Ticket Price</Label>
                  <Input
                    type="number"
                    id="ticketPrice"
                    placeholder="0.00"
                    step="0.01"
                    value={registration.ticketPrice || ''}
                    onChange={(e) => handleInputChange('ticketPrice', parseFloat(e.target.value) || undefined)}
                  />
                </div>
                <div>
                  <Label htmlFor="currency" className="text-sm font-medium text-gray-700">Currency</Label>
                  <Select value={registration.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Email */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmation Email</h3>
          <p className="text-sm text-gray-600 mb-4">This message will be sent to attendees after they register.</p>
          <Textarea
            rows={6}
            value={registration.confirmationEmail}
            onChange={(e) => handleInputChange('confirmationEmail', e.target.value)}
            placeholder="Thank you for registering for our event. We look forward to seeing you!"
          />
        </div>

        {/* Terms & Conditions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms & Conditions</h3>
          <Textarea
            rows={4}
            value={registration.termsConditions}
            onChange={(e) => handleInputChange('termsConditions', e.target.value)}
            placeholder="By registering for this event, you agree to our terms and conditions..."
          />
        </div>
      </div>

      <div className="mt-8 flex justify-between">
      <Button variant="outline" onClick={handlePrevious} className='border border-gray-200 cursor-pointer bg-transparent hover:bg-gray-50 text-gray-900'>
          <ArrowLeft className="mr-2 w-4 h-4" /> Previous Step
        </Button>
        <Button onClick={handleComplete} className="bg-gray-900 text-white cursor-pointer">
          <Check className="mr-2 w-4 h-4" /> Complete Setup
        </Button>
      </div>
    </div>
  );
}
