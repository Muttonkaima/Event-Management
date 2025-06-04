import { useEventWizard } from '@/contexts/EventWizardContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

export function Step2Details() {
  const { state, actions } = useEventWizard();
  const { event } = state;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!event.name.trim()) {
      newErrors.name = 'Event name is required';
    }
    if (!event.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!event.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (event.startDate && event.endDate && new Date(event.endDate) <= new Date(event.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (!event.timezone) {
      newErrors.timezone = 'Timezone is required';
    }
    if (event.eventType === 'in-person' || event.eventType === 'hybrid') {
      if (!event.address.trim()) {
        newErrors.address = 'Address is required for in-person/hybrid events';
      }
      if (!event.city.trim()) {
        newErrors.city = 'City is required for in-person/hybrid events';
      }
    }
    if (event.eventType === 'virtual' || event.eventType === 'hybrid') {
      if (!event.meetingLink?.trim()) {
        newErrors.meetingLink = 'Meeting link is required for virtual/hybrid events';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      actions.setStep(3);
    }
  };

  const handlePrevious = () => {
    actions.setStep(1);
  };

  const handleInputChange = (field: string, value: string) => {
    actions.updateEvent({ [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Basic Event Details</h2>
        <p className="text-gray-600">Enter the essential information about your event.</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="eventName" className="text-gray-900">Event Name</Label>
          <Input
            id="eventName"
            placeholder="Enter event name"
            value={event.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="eventDescription" className="text-gray-900">Description</Label>
          <Textarea
            id="eventDescription"
            placeholder="Describe your event"
            rows={4}
            value={event.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="startDate" className="text-gray-900">Start Date & Time *</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                id="startDate"
                value={event.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={`flex-1 ${errors.startDate ? 'border-red-500' : ''}`}
              />
              <Input
                type="time"
                value={event.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className="w-32"
              />
            </div>
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="endDate" className="text-gray-900">End Date & Time *</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                id="endDate"
                value={event.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className={`flex-1 ${errors.endDate ? 'border-red-500' : ''}`}
              />
              <Input
                type="time"
                value={event.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className="w-32"
              />
            </div>
            {errors.endDate && (
              <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="timezone" className="text-gray-900">Timezone *</Label>
          <Select value={event.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
            <SelectTrigger className={errors.timezone ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
              <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
              <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
              <SelectItem value="CST">CST (Central Standard Time)</SelectItem>
              <SelectItem value="MST">MST (Mountain Standard Time)</SelectItem>
            </SelectContent>
          </Select>
          {errors.timezone && (
            <p className="text-red-500 text-sm mt-1">{errors.timezone}</p>
          )}
        </div>

        <div>
          <Label htmlFor="eventType" className="text-gray-900">Event Type *</Label>
          <Select value={event.eventType} onValueChange={(value) => handleInputChange('eventType', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in-person">Physical Location</SelectItem>
              <SelectItem value="virtual">Virtual Event</SelectItem>
              <SelectItem value="hybrid">Hybrid Event</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(event.eventType === 'in-person' || event.eventType === 'hybrid') && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="address" className="text-gray-900">Address *</Label>
              <Input
                id="address"
                placeholder="Enter address"
                value={event.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-gray-900">City *</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={event.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
              <div>
                <Label htmlFor="state" className="text-gray-900">State/Province</Label>
                <Input
                  id="state"
                  placeholder="State/Province"
                  value={event.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country" className="text-gray-900">Country</Label>
                <Input
                  id="country"
                  placeholder="Country"
                  value={event.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="zipCode" className="text-gray-900">Zip/Postal Code</Label>
                <Input
                  id="zipCode"
                  placeholder="Zip/Postal Code"
                  value={event.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {(event.eventType === 'virtual' || event.eventType === 'hybrid') && (
          <div>
            <Label htmlFor="meetingLink" className="text-gray-900">Meeting Link *</Label>
            <Input
              id="meetingLink"
              placeholder="https://zoom.us/j/1234567890 or https://teams.microsoft.com/..."
              value={event.meetingLink}
              onChange={(e) => handleInputChange('meetingLink', e.target.value)}
              className={errors.meetingLink ? 'border-red-500' : ''}
            />
            {errors.meetingLink && (
              <p className="text-red-500 text-sm mt-1">{errors.meetingLink}</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={handlePrevious} className='border border-gray-200 cursor-pointer bg-transparent hover:bg-gray-50 text-gray-900'>
          <ArrowLeft className="mr-2 w-4 h-4" /> Previous Step
        </Button>
        <Button onClick={handleNext} className="bg-gray-900 text-white cursor-pointer">
          Next Step <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
