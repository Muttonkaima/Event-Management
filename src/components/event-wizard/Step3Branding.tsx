import { useEventWizard } from '@/contexts/EventWizardContext';
import { useFileUpload } from '@/hooks/useFileUpload';
import { ArrowLeft, ArrowRight, CloudUpload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ColorTheme, FontStyle } from '@/shared/eventSchema';
import { useState } from 'react';
import Image from 'next/image';

const colorThemes = [
  {
    id: 'professional' as ColorTheme,
    name: 'Professional',
    colors: ['bg-indigo-500', 'bg-indigo-300', 'bg-gray-600']
  },
  {
    id: 'ocean' as ColorTheme,
    name: 'Ocean Blue',
    colors: ['bg-cyan-500', 'bg-blue-400', 'bg-teal-600']
  },
  {
    id: 'sunset' as ColorTheme,
    name: 'Sunset',
    colors: ['bg-orange-500', 'bg-red-400', 'bg-yellow-500']
  },
  {
    id: 'forest' as ColorTheme,
    name: 'Forest',
    colors: ['bg-green-600', 'bg-emerald-400', 'bg-lime-500']
  }
];

const fontStyles = [
  {
    id: 'modern' as FontStyle,
    name: 'Modern Sans',
    description: 'Clean and professional for modern events',
    className: 'font-sans'
  },
  {
    id: 'classic' as FontStyle,
    name: 'Classic Serif',
    description: 'Traditional and elegant for formal events',
    className: 'font-serif'
  },
  {
    id: 'minimal' as FontStyle,
    name: 'Minimal',
    description: 'Light and airy for minimalist designs',
    className: 'font-light tracking-wide'
  },
  {
    id: 'creative' as FontStyle,
    name: 'Creative',
    description: 'Fun and unique for creative events',
    className: 'font-mono'
  },
  {
    id: 'elegant' as FontStyle,
    name: 'Elegant',
    description: 'Sophisticated for premium events',
    className: 'font-serif font-light'
  }
];

export function Step3Branding() {
  const { state, actions } = useEventWizard();
  const { branding } = state;
  const { uploadFile, isUploading } = useFileUpload();
  const [logoPreview, setLogoPreview] = useState<string | null>(branding.logoUrl || null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(branding.bannerUrl || null);

  const handlePrevious = () => {
    actions.setStep(2);
  };

  const handleNext = () => {
    actions.setStep(4);
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      const url = await uploadFile(file);
      actions.updateBranding({ logoUrl: url });
    } catch (error) {
      console.error('Logo upload failed:', error);
    }
  };

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      const url = await uploadFile(file);
      actions.updateBranding({ bannerUrl: url });
    } catch (error) {
      console.error('Banner upload failed:', error);
    }
  };

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Branding & Appearance</h2>
        <p className="text-gray-600">Customize the look and feel of your event page.</p>
      </div>

      <div className="space-y-8">
        {/* Logo Upload */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Event Logo</Label>
          <div
            className="file-upload-area border border-gray-200 rounded-lg p-4 cursor-pointer"
            onClick={() => document.getElementById('logo-upload')?.click()}
          >
            {logoPreview ? (
              <div>
                <Image src={logoPreview} alt="Logo preview" className="mx-auto max-h-24 rounded-lg" />
                <p className="mt-2 text-sm text-gray-600">Click to change logo</p>
              </div>
            ) : (
              <div>
                <CloudUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">Click to upload a logo</p>
                <p className="text-sm text-gray-500">PNG, JPG up to 2MB (200x200px recommended)</p>
              </div>
            )}
            <input
              type="file"
              id="logo-upload"
              className="hidden"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={isUploading}
            />
          </div>
        </div>

        {/* Banner Upload */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Event Banner</Label>
          <div
            className="file-upload-area border border-gray-200 rounded-lg p-4 cursor-pointer"
            onClick={() => document.getElementById('banner-upload')?.click()}
          >
            {bannerPreview ? (
              <div>
                <Image src={bannerPreview} alt="Banner preview" className="mx-auto max-h-32 rounded-lg w-full object-cover" />
                <p className="mt-2 text-sm text-gray-600">Click to change banner</p>
              </div>
            ) : (
              <div>
                <CloudUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">Click to upload a banner image</p>
                <p className="text-sm text-gray-500">PNG, JPG up to 5MB (1200x400px recommended)</p>
              </div>
            )}
            <input
              type="file"
              id="banner-upload"
              className="hidden"
              accept="image/*"
              onChange={handleBannerUpload}
              disabled={isUploading}
            />
          </div>
        </div>

        {/* Color Themes */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">Color Palette</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {colorThemes.map((theme) => (
              <div
                key={theme.id}
                className={`color-theme-option cursor-pointer p-4 border-2 rounded-lg transition-all ${
                  branding.colorTheme === theme.id ? 'border-black' : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => actions.updateBranding({ colorTheme: theme.id })}
              >
                <div className="flex space-x-2 mb-2">
                  {theme.colors.map((color, index) => (
                    <div key={index} className={`w-4 h-4 rounded-full ${color}`} />
                  ))}
                </div>
                <p className="text-sm font-medium text-gray-900">{theme.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Font Styles */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">Font Style</Label>
          <div className="space-y-3">
            {fontStyles.map((font) => (
              <div
                key={font.id}
                className={`font-option cursor-pointer p-4 border-2 rounded-lg transition-all ${
                  branding.fontStyle === font.id ? 'border-black' : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => actions.updateBranding({ fontStyle: font.id })}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-medium text-gray-900 ${font.className}`}>{font.name}</h4>
                    <p className="text-sm text-gray-600">{font.description}</p>
                  </div>
                  <span className={`text-2xl text-gray-300 ${font.className}`}>Aa</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Element Visibility */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">Element Visibility</Label>
          <div className="space-y-3">
            {Object.entries(branding.visibility).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  {key.replace('show', 'Show ').replace(/([A-Z])/g, ' $1')}
                </span>
                <Switch
                  checked={value as boolean}
                  onCheckedChange={(checked) => 
                    actions.updateVisibility({ [key]: checked })
                  }
                />
              </div>
            ))}
          </div>
        </div>
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
