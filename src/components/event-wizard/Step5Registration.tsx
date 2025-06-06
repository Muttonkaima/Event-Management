import { useEventWizard } from '@/contexts/EventWizardContext';
import { ArrowLeft, Check, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Ticket = {
  id: string;
  name: string;
  type: 'free' | 'paid';
  price?: number;
  currency?: string;
};

export function Step5Registration() {
  const router = useRouter();
  const { state, actions } = useEventWizard();
  const { registration } = state;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [limitAttendees, setLimitAttendees] = useState(!!registration.maxAttendees);
  const [tickets, setTickets] = useState<Ticket[]>(
    registration.tickets && registration.tickets.length > 0 
      ? registration.tickets 
      : []
  );
  
  // Sync tickets with registration when component mounts
  useState(() => {
    if ((!registration.tickets || registration.tickets.length === 0) && tickets.length > 0) {
      actions.updateRegistration({ tickets });
    }
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const now = new Date();

    // Start date validation
    if (!registration.registrationOpen) {
      newErrors.registrationOpen = 'Start date and time are required';
    } else {
      const startDate = new Date(registration.registrationOpen);
      if (startDate < new Date(now.getTime() - 60000)) { // Allow 1 minute buffer
        newErrors.registrationOpen = 'Start date and time cannot be in the past';
      }
    }

    // End date validation
    if (!registration.registrationClose) {
      newErrors.registrationClose = 'End date and time are required';
    } else {
      const endDate = new Date(registration.registrationClose);
      if (endDate < new Date(now.getTime() - 60000)) { // Allow 1 minute buffer
        newErrors.registrationClose = 'End date and time cannot be in the past';
      } else if (registration.registrationOpen) {
        const startDate = new Date(registration.registrationOpen);
        if (endDate <= startDate) {
          newErrors.registrationClose = 'End date and time must be after start date and time';
        }
      }
    }
    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };  

  const handlePrevious = () => {
    actions.setStep(4);
  };

  const downloadJSON = (data: any, filename: string) => {
    // Convert the data to a JSON string with proper formatting
    const jsonString = JSON.stringify(data, null, 2);
    
    // Create a Blob with the JSON data
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'event-export.json';
    
    // Trigger the download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleComplete = () => {
    if (validateForm()) {
      // Save tickets to registration
      actions.updateRegistration({ tickets });
      
      // Create a new registration object without the unwanted fields
      const { tickets: _, ...restRegistration } = state.registration;
      // Create a new object with only the fields we want to keep
      const registrationData: Record<string, any> = { ...restRegistration };
      // Remove any unwanted fields
      ['paymentType', 'currency', 'fields'].forEach(field => {
        if (field in registrationData) {
          delete registrationData[field];
        }
      });
      
      // Add tickets with proper formatting
      const updatedRegistration = {
        ...registrationData,
        tickets: tickets.map(ticket => ({
          id: ticket.id,
          name: ticket.name,
          type: ticket.type,
          ...(ticket.type === 'paid' && {
            price: ticket.price || 0,
            currency: ticket.currency || 'USD'
          })
        }))
      };
      
      // Create the complete event data without the unwanted fields
      const eventData = {
        ...state,
        registration: updatedRegistration
      };
      
      // Generate a filename with event name and current date
      const eventName = state.event.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `event_${eventName}_${dateStr}.json`;
      
      // Download the JSON file
      downloadJSON(eventData, filename);
      
      // Show success message and redirect
      alert('🎉 Event setup completed successfully! Your event data has been downloaded.');
      router.push('/events');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    actions.updateRegistration({ [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addTicket = () => {
    const newTicket: Ticket = {
      id: Date.now().toString(),
      name: `Ticket ${tickets.length + 1}`,
      type: 'free',
      price: 0,
      currency: 'USD'
    };
    const updatedTickets = [...tickets, newTicket];
    setTickets(updatedTickets);
    actions.updateRegistration({ tickets: updatedTickets });
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    const updatedTickets = tickets.map(ticket => 
      ticket.id === id ? { ...ticket, ...updates } : ticket
    );
    setTickets(updatedTickets);
    actions.updateRegistration({ tickets: updatedTickets });
  };

  const removeTicket = (id: string) => {
    const updatedTickets = tickets.filter(ticket => ticket.id !== id);
    setTickets(updatedTickets);
    actions.updateRegistration({ tickets: updatedTickets });
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
            <Label htmlFor="startDate" className="text-gray-900">Start Date & Time *</Label>
            <div className="flex gap-2">
              <Input
                type="datetime-local"
                id="startDate"
                value={registration.registrationOpen}
                onChange={(e) => {
                  handleInputChange('registrationOpen', e.target.value);
                  // If end date is not set, set it to 1 hour after start
                  if (!registration.registrationClose && e.target.value) {
                    const start = new Date(e.target.value);
                    start.setHours(start.getHours() + 1);
                    const endDate = start.toISOString().slice(0, 16); // Format for datetime-local
                    handleInputChange('registrationClose', endDate);
                  }
                }}
                min={new Date().toISOString().slice(0, 16)}
                className={`flex-1 ${errors.registrationOpen ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.registrationOpen && (
              <p className="text-red-500 text-sm mt-1">{errors.registrationOpen}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="endDate" className="text-gray-900">End Date & Time *</Label>
            <div className="flex gap-2">
              <Input
                type="datetime-local"
                id="endDate"
                value={registration.registrationClose}
                onChange={(e) => handleInputChange('registrationClose', e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className={`flex-1 ${errors.registrationClose ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.registrationClose && (
              <p className="text-red-500 text-sm mt-1">{errors.registrationClose}</p>
            )}
          </div>
          </div>

          {/* Update/Cancellation Deadline */}
          <div className="mt-4">
            <Label htmlFor="updateDeadline" className="text-gray-900">Update/Cancellation Deadline</Label>
            <Input
              type="datetime-local"
              id="updateDeadline"
              value={registration.updateDeadline || ''}
              onChange={(e) => handleInputChange('updateDeadline', e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="mt-1 w-full"
            />
            <p className="text-xs text-gray-500 mt-1">Last date attendees can update or cancel their registration</p>
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



        {/* Tickets */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tickets</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addTicket}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Ticket
            </Button>
          </div>
          
          {tickets.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <p className="text-gray-500">No tickets added yet</p>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={addTicket}
                className="mt-2"
              >
                Add your first ticket
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="border rounded-lg p-4 relative">
                  <button
                    type="button"
                    onClick={() => removeTicket(ticket.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                    aria-label="Remove ticket"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor={`ticket-name-${ticket.id}`} className="text-sm font-medium text-gray-700">Ticket Name *</Label>
                      <Input
                        id={`ticket-name-${ticket.id}`}
                        placeholder="e.g., General Admission, VIP, Early Bird"
                        value={ticket.name}
                        onChange={(e) => updateTicket(ticket.id, { name: e.target.value })}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Ticket Type</Label>
                      <RadioGroup
                        value={ticket.type}
                        onValueChange={(value: 'free' | 'paid') => updateTicket(ticket.id, { type: value as 'free' | 'paid' })}
                        className="flex space-x-4 text-gray-700"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="free" id={`free-${ticket.id}`} className="cursor-pointer" />
                          <Label htmlFor={`free-${ticket.id}`} className="text-sm font-medium text-gray-700">Free</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="paid" id={`paid-${ticket.id}`} className="cursor-pointer" />
                          <Label htmlFor={`paid-${ticket.id}`} className="text-sm font-medium text-gray-700">Paid</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {ticket.type === 'paid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
                      <div>
                        <Label htmlFor={`price-${ticket.id}`} className="text-sm font-medium text-gray-700">Price *</Label>
                        <Input
                          id={`price-${ticket.id}`}
                          type="number"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          value={ticket.price || ''}
                          onChange={(e) => updateTicket(ticket.id, { price: parseFloat(e.target.value) || 0 })}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`currency-${ticket.id}`} className="text-sm font-medium text-gray-700">Currency</Label>
                        <Select
                          value={ticket.currency || 'USD'}
                          onValueChange={(value) => updateTicket(ticket.id, { currency: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="INR">INR (₹)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
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
