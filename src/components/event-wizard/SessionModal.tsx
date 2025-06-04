import { useEventWizard } from '@/contexts/EventWizardContext';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { SessionData } from '@/shared/eventSchema';

interface SessionModalProps {
  open: boolean;
  onClose: () => void;
  editingIndex: number | null;
}

const sessionTags = [
  { value: 'keynote', label: 'Keynote', color: 'bg-purple-500' },
  { value: 'workshop', label: 'Workshop', color: 'bg-green-500' },
  { value: 'panel', label: 'Panel Discussion', color: 'bg-orange-500' },
  { value: 'networking', label: 'Networking', color: 'bg-teal-500' }
];

export function SessionModal({ open, onClose, editingIndex }: SessionModalProps) {
  const { state, actions } = useEventWizard();
  const [formData, setFormData] = useState<Omit<SessionData, 'id'>>({
    title: '',
    speaker: '',
    startTime: '09:00',
    duration: 30,
    description: '',
    tags: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load session data when editing
  useEffect(() => {
    if (editingIndex !== null && state.sessions[editingIndex]) {
      const session = state.sessions[editingIndex];
      setFormData({
        title: session.title,
        speaker: session.speaker,
        startTime: session.startTime,
        duration: session.duration,
        description: session.description || '',
        tags: session.tags
      });
    } else {
      setFormData({
        title: '',
        speaker: '',
        startTime: '09:00',
        duration: 30,
        description: '',
        tags: []
      });
    }
    setErrors({});
  }, [editingIndex, state.sessions, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Session title is required';
    }
    if (!formData.speaker.trim()) {
      newErrors.speaker = 'Speaker name is required';
    }
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    if (!formData.duration || formData.duration < 1) {
      newErrors.duration = 'Duration must be at least 1 minute';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editingIndex !== null) {
      actions.updateSession(editingIndex, { ...formData, id: state.sessions[editingIndex].id });
    } else {
      actions.addSession(formData);
    }

    onClose();
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTagToggle = (tagValue: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagValue)
        ? prev.tags.filter(tag => tag !== tagValue)
        : [...prev.tags, tagValue]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-gray-900">
            {editingIndex !== null ? 'Edit Session' : 'Add Session'}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="sessionTitle" className="text-gray-900">Session Title *</Label>
            <Input
              id="sessionTitle"
              placeholder="Enter session title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <Label htmlFor="speakerName" className="text-gray-900">Speaker Name *</Label>
            <Input
              id="speakerName"
              placeholder="Enter speaker name"
              value={formData.speaker}
              onChange={(e) => handleInputChange('speaker', e.target.value)}
              className={errors.speaker ? 'border-red-500' : ''}
            />
            {errors.speaker && (
              <p className="text-red-500 text-sm mt-1">{errors.speaker}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime" className="text-gray-900">Start Time *</Label>
              <Input
                type="time"
                id="startTime"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className={errors.startTime ? 'border-red-500' : ''}
              />
              {errors.startTime && (
                <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
              )}
            </div>
            <div>
              <Label htmlFor="duration" className="text-gray-900">Duration (min) *</Label>
              <Input
                type="number"
                id="duration"
                placeholder="30"
                min="1"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                className={errors.duration ? 'border-red-500' : ''}
              />
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-900">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe this session"
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-900 mb-2 block">Session Tags</Label>
            <div className="grid grid-cols-2 gap-2">
              {sessionTags.map((tag) => (
                <div key={tag.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={tag.value}
                    checked={formData.tags.includes(tag.value)}
                    onCheckedChange={() => handleTagToggle(tag.value)}
                  />
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${tag.color}`} />
                    <Label htmlFor={tag.value} className="text-sm cursor-pointer text-gray-700">
                      {tag.label}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose} className='text-gray-900 bg-transparent border-gray-200 hover:bg-gray-50 cursor-pointer'>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gray-900 text-white hover:bg-gray-800 cursor-pointer">
            <Save className="mr-2 w-4 h-4" />
            Save Session
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
