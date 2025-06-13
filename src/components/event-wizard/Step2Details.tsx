import { useEventWizard } from '@/contexts/EventWizardContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { Country, State, City } from 'country-state-city';

export function Step2Details() {
  const { state, actions } = useEventWizard();
  const { event } = state;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [selectedState, setSelectedState] = useState('Karnataka');
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const countries = Country.getAllCountries();

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry);
      setStates(countryStates);
      setSelectedState('');
      // Update event with selected country
      const countryData = countries.find(c => c.isoCode === selectedCountry);
      if (countryData) {
        actions.updateEvent({ 
          country: countryData.name,
          state: '',
          city: ''
        });
      }
    }
  }, [selectedCountry]);

  // Load cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      const stateCities = City.getCitiesOfState(selectedCountry, selectedState);
      setCities(stateCities);
      // Update event with selected state
      const stateData = states.find(s => s.isoCode === selectedState);
      if (stateData) {
        actions.updateEvent({ 
          state: stateData.name,
          city: ''
        });
      }
    }
  }, [selectedState]);

  // Initialize selected country and state from event data
  useEffect(() => {
    if (event.country) {
      const country = countries.find(c => c.name === event.country);
      if (country) {
        setSelectedCountry(country.isoCode);
        
        // Set states for the country
        const countryStates = State.getStatesOfCountry(country.isoCode);
        setStates(countryStates);
        
        // If state is set in event, select it
        if (event.state) {
          const state = countryStates.find(s => s.name === event.state);
          if (state) {
            setSelectedState(state.isoCode);
            
            // Set cities for the state
            const stateCities = City.getCitiesOfState(country.isoCode, state.isoCode);
            setCities(stateCities);
          }
        }
      }
    }
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const now = new Date();

    if (!event.name.trim()) {
      newErrors.name = 'Event name is required';
    }

    // Start date validation
    if (!event.startDate) {
      newErrors.startDate = 'Start date and time are required';
    } else {
      const startDate = new Date(event.startDate);
      if (startDate < new Date(now.getTime() - 60000)) { // Allow 1 minute buffer
        newErrors.startDate = 'Start date and time cannot be in the past';
      }
    }

    // End date validation
    if (!event.endDate) {
      newErrors.endDate = 'End date and time are required';
    } else {
      const endDate = new Date(event.endDate);
      if (endDate < new Date(now.getTime() - 60000)) { // Allow 1 minute buffer
        newErrors.endDate = 'End date and time cannot be in the past';
      } else if (event.startDate) {
        const startDate = new Date(event.startDate);
        if (endDate <= startDate) {
          newErrors.endDate = 'End date and time must be after start date and time';
        }
      }
    }

    // Location validation
    if (!event.timezone) {
      newErrors.timezone = 'Timezone is required';
    }

    if (event.eventType === 'physical' || event.eventType === 'hybrid') {
      if (!event.address.trim()) {
        newErrors.address = 'Address is required for physical/hybrid events';
      }
      if (!event.city.trim()) {
        newErrors.city = 'City is required for physical/hybrid events';
      }
      if (!selectedCountry) {
        newErrors.country = 'Country is required';
      }
      if (!selectedState) {
        newErrors.state = 'State/Province is required';
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
  console.log(event.eventType);
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="startDate" className="text-gray-900">Start Date & Time *</Label>
            <div className="flex gap-2">
              <Input
                type="datetime-local"
                id="startDate"
                value={event.startDate}
                onChange={(e) => {
                  handleInputChange('startDate', e.target.value);
                  // If end date is not set, set it to 1 hour after start
                  if (!event.endDate && e.target.value) {
                    const start = new Date(e.target.value);
                    start.setHours(start.getHours() + 1);
                    const endDate = start.toISOString().slice(0, 16); // Format for datetime-local
                    handleInputChange('endDate', endDate);
                  }
                }}
                min={new Date().toISOString().slice(0, 16)}
                className={`flex-1 ${errors.startDate ? 'border-red-500' : ''}`}
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
                type="datetime-local"
                id="endDate"
                value={event.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className={`flex-1 ${errors.endDate ? 'border-red-500' : ''}`}
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
              <SelectItem value="physical">Physical Location</SelectItem>
              <SelectItem value="virtual">Virtual Event</SelectItem>
              <SelectItem value="hybrid">Hybrid Event</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(event.eventType === 'physical' || event.eventType === 'hybrid') && (
          <div className="space-y-4">
            <div>
              <Label className="text-gray-900">Address</Label>
              <Input
                type="text"
                value={event.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Venue name or address"
                className={`mt-2 ${errors.address ? 'border-red-500' : ''}`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country *</Label>
                  <Select
                    value={selectedCountry}
                    onValueChange={(value) => setSelectedCountry(value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {countries.map((country) => (
                        <SelectItem key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="state" className="text-sm font-medium text-gray-700">State/Province *</Label>
                  <Select
                    value={selectedState}
                    onValueChange={(value) => setSelectedState(value)}
                    disabled={!selectedCountry}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {states.map((state) => (
                        <SelectItem key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">City *</Label>
                  <Select
                    value={event.city}
                    onValueChange={(value) => handleInputChange('city', value)}
                    disabled={!selectedState}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {cities.map((city) => (
                        <SelectItem key={city.name} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                <Label className="text-gray-900">Zip Code</Label>
              <Input
                type="text"
                value={event.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                placeholder="Zip Code"
                className={`mt-2 ${errors.zipCode ? 'border-red-500' : ''}`}
              />
              {errors.zipCode && (
                <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
              )}
              </div>
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
