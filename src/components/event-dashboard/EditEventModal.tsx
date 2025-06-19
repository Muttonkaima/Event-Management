'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image as ImageIcon, Upload } from "lucide-react";
import Image from 'next/image';
import { Country, State, City } from 'country-state-city';
import { Switch } from "@/components/ui/switch";

interface EditEventModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  event: any;
}

export default function EditEventModal({ isOpen, onCloseAction, event }: EditEventModalProps) {
  if (!event) return null;

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [eventType, setEventType] = useState<string>(event.event_type || 'physical');
  const [selectedCountry, setSelectedCountry] = useState(event.country_code || 'IN');
  const [selectedState, setSelectedState] = useState(event.state_code || '');
  const [selectedCity, setSelectedCity] = useState(event.city || '');
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [brandingVisibility, setBrandingVisibility] = useState({
    showLogo: event.branding_id?.branding_visibility_id?.fields?.showLogo ?? true,
    showBanner: event.branding_id?.branding_visibility_id?.fields?.showBanner ?? true,
    showDescription: event.branding_id?.branding_visibility_id?.fields?.showDescription ?? true,
    showSchedule: event.branding_id?.branding_visibility_id?.fields?.showSchedule ?? true,
    showSpeakers: event.branding_id?.branding_visibility_id?.fields?.showSpeakers ?? true,
    showLocation: event.branding_id?.branding_visibility_id?.fields?.showLocation ?? true,
    showRegistration: event.branding_id?.branding_visibility_id?.fields?.showRegistration ?? true,
  });
  
  const countries = Country.getAllCountries();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const isPhysical = eventType === 'physical' || eventType === 'hybrid';
  const isVirtual = eventType === 'virtual' || eventType === 'hybrid';

  // Toggle branding visibility
  const toggleBrandingVisibility = (key: keyof typeof brandingVisibility) => {
    setBrandingVisibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Load states when country changes
  useEffect(() => {
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry);
      setStates(countryStates);
      setSelectedState('');
      setCities([]);
      setSelectedCity('');
    }
  }, [selectedCountry]);

  // Load cities when state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      const stateCities = City.getCitiesOfState(selectedCountry, selectedState);
      setCities(stateCities);
      setSelectedCity('');
    }
  }, [selectedCountry, selectedState]);

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-black">Edit Event</DialogTitle>
        </DialogHeader>

        {/* Banner Upload */}
        <div className="space-y-4 border-b pb-6">
          <h3 className="text-lg font-medium text-gray-900">Event Banner</h3>
          <div className="flex flex-col items-center justify-center w-full">
            <label
              htmlFor="banner-upload"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              {bannerPreview || event.branding_id?.branding_banner ? (
                <div className="relative w-full h-full overflow-hidden rounded-lg group">
                  <Image
                    src={bannerPreview || `${process.env.NEXT_PUBLIC_ASSETS_URL}${event.branding_id.branding_banner}`}
                    alt="Banner preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Upload className="h-6 w-6 text-white" />
                    <span className="text-white ml-2">Change Banner</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, or JPEG (max. 5MB)</p>
                </div>
              )}
              <input
                id="banner-upload"
                ref={bannerInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleBannerChange}
              />
            </label>
          </div>
        </div>

        {/* Logo Upload */}
        <div className="space-y-4 border-b pb-6">
          <h3 className="text-lg font-medium text-gray-900">Event Logo</h3>
          <div className="flex flex-col items-center justify-center w-full">
            <label
              htmlFor="logo-upload"
              className="flex flex-col items-center justify-center w-32 h-32 rounded-full border-2 border-dashed cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden"
            >
              {logoPreview || event.branding_id?.branding_logo ? (
                <div className="relative w-full h-full group">
                  <Image
                    src={logoPreview || `${process.env.NEXT_PUBLIC_ASSETS_URL}${event.branding_id.branding_logo}`}
                    alt="Logo preview"
                    fill
                    className="object-fill"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Upload className="h-5 w-5 text-white" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-5">
                  <ImageIcon className="w-6 h-6 text-gray-500" />
                </div>
              )}
              <input
                id="logo-upload"
                ref={logoInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleLogoChange}
              />
            </label>
          </div>
        </div>
        
        <div className="grid gap-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4 border-b pb-6">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="eventName" className='text-gray-900'>Event Name</Label>
                <Input
                  id="eventName"
                  defaultValue={event.event_name}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eventType" className='text-gray-900'>Event Type</Label>
                <Select 
                  value={eventType} 
                  onValueChange={(value) => setEventType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physical">Physical</SelectItem>
                    <SelectItem value="virtual">Virtual</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className='text-gray-900'>Start Date & Time</Label>
                <Input
                  type="datetime-local"
                  defaultValue={event.start_datetime ? new Date(event.start_datetime).toISOString().slice(0, 16) : ''}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className='text-gray-900'>End Date & Time</Label>
                <Input
                  type="datetime-local"
                  defaultValue={event.end_datetime ? new Date(event.end_datetime).toISOString().slice(0, 16) : ''}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone" className='text-gray-900'>Timezone</Label>
                <Select defaultValue={event.timezone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="IST">IST (India Standard Time)</SelectItem>
                    <SelectItem value="EST">EST (Eastern Time)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="attendeeLimit" className='text-gray-900'>Maximum Attendees</Label>
                <Input
                  id="attendeeLimit"
                  type="number"
                  defaultValue={event.attendee_limit}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className='text-gray-900'>Description</Label>
              <Textarea
                id="description"
                defaultValue={event.description}
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* Location Information */}
          {isPhysical && (
            <div className="space-y-4 border-b pb-6">
              <h3 className="text-lg font-medium text-gray-900">Physical Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="address" className='text-gray-900'>Address</Label>
                  <Input
                    id="address"
                    defaultValue={event.address || ''}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className='text-gray-900'>Country</Label>
                  <Select 
                    value={selectedCountry} 
                    onValueChange={setSelectedCountry}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      {countries.map((country) => (
                        <SelectItem key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className='text-gray-900'>State/Region</Label>
                  <Select 
                    value={selectedState} 
                    onValueChange={setSelectedState}
                    disabled={!selectedCountry}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      {states.map((state) => (
                        <SelectItem key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className='text-gray-900'>City</Label>
                  <Select 
                    value={selectedCity}
                    onValueChange={setSelectedCity}
                    disabled={!selectedState}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      {cities.map((city) => (
                        <SelectItem key={city.name} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipcode" className='text-gray-900'>Postal/Zip Code</Label>
                  <Input
                    id="zipcode"
                    defaultValue={event.zipcode || ''}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Virtual Meeting Link */}
          {isVirtual && (
            <div className="space-y-4 border-b pb-6">
              <h3 className="text-lg font-medium text-gray-900">Virtual Event Details</h3>
              <div className="space-y-2">
                <Label htmlFor="meetingLink" className='text-gray-900'>Meeting Link</Label>
                <Input
                  id="meetingLink"
                  type="url"
                  placeholder="https://meet.example.com/your-event"
                  defaultValue={event.meeting_link || ''}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the URL for your virtual event (Zoom, Google Meet, etc.)
                </p>
              </div>
            </div>
          )}

        {/* Branding Visibility */}
        <div className="space-y-4 border-b pb-6">
          <h3 className="text-lg font-medium text-gray-900">Branding Visibility</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-700">Show Logo</h4>
              </div>
              <Switch 
                checked={brandingVisibility.showLogo} 
                onCheckedChange={() => toggleBrandingVisibility('showLogo')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-700">Show Banner</h4>
              </div>
              <Switch 
                checked={brandingVisibility.showBanner} 
                onCheckedChange={() => toggleBrandingVisibility('showBanner')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-700">Show Description</h4>
              </div>
              <Switch 
                checked={brandingVisibility.showDescription} 
                onCheckedChange={() => toggleBrandingVisibility('showDescription')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-700">Show Schedule</h4>
              </div>
              <Switch 
                checked={brandingVisibility.showSchedule} 
                onCheckedChange={() => toggleBrandingVisibility('showSchedule')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-700">Show Speakers</h4>
              </div>
              <Switch 
                checked={brandingVisibility.showSpeakers} 
                onCheckedChange={() => toggleBrandingVisibility('showSpeakers')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-700">Show Location</h4>
              </div>
              <Switch 
                checked={brandingVisibility.showLocation} 
                onCheckedChange={() => toggleBrandingVisibility('showLocation')} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-700">Show Registration</h4>
              </div>
              <Switch 
                checked={brandingVisibility.showRegistration} 
                onCheckedChange={() => toggleBrandingVisibility('showRegistration')} 
              />
            </div>
          </div>
        </div>
        
          {/* Registration Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Registration Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className='text-gray-900'>Registration Start</Label>
                <Input
                  type="datetime-local"
                  defaultValue={event.registration_start_datetime ? new Date(event.registration_start_datetime).toISOString().slice(0, 16) : ''}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className='text-gray-900'>Registration End</Label>
                <Input
                  type="datetime-local"
                  defaultValue={event.registration_end_datetime ? new Date(event.registration_end_datetime).toISOString().slice(0, 16) : ''}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className='text-gray-900'>Cancellation Deadline</Label>
                <Input
                  type="datetime-local"
                  defaultValue={event.cancellation_deadline_datetime ? new Date(event.cancellation_deadline_datetime).toISOString().slice(0, 16) : ''}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Terms & Conditions</h3>
            <div className="space-y-2">
              <Label htmlFor="terms" className='text-gray-900'>Terms and Conditions</Label>
              <Textarea
                id="terms"
                defaultValue={event.terms_and_conditions}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={onCloseAction} className="hover:bg-black hover:text-white bg-white text-black border border-gray-700 cursor-pointer">
            Cancel
          </Button>
          <Button className="bg-black text-white cursor-pointer">Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
