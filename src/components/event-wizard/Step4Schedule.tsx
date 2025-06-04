import { useEventWizard } from '@/contexts/EventWizardContext';
import { ArrowLeft, ArrowRight, Plus, Clock, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { SessionModal } from './SessionModal';
import { SessionData } from '@/shared/eventSchema';

export function Step4Schedule() {
  const { state, actions } = useEventWizard();
  const { sessions } = state;
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [editingSessionIndex, setEditingSessionIndex] = useState<number | null>(null);

  const handlePrevious = () => {
    actions.setStep(3);
  };

  const handleNext = () => {
    actions.setStep(5);
  };

  const handleAddSession = () => {
    setEditingSessionIndex(null);
    setIsSessionModalOpen(true);
  };

  const handleEditSession = (index: number) => {
    setEditingSessionIndex(index);
    setIsSessionModalOpen(true);
  };

  const handleDeleteSession = (index: number) => {
    if (confirm('Are you sure you want to delete this session?')) {
      actions.deleteSession(index);
    }
  };

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Schedule & Sessions</h2>
        <p className="text-gray-600">Add sessions, presentations, or activities to your event schedule.</p>
      </div>

      <div className="mb-6">
        {sessions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Clock className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Sessions Yet</h3>
            <p className="text-gray-500 mb-6">Add sessions to create your event schedule.</p>
            <Button onClick={handleAddSession} className="bg-gray-900 text-white cursor-pointer">
              <Plus className="mr-2 w-4 h-4" /> Add Your First Session
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">{sessions.length} session{sessions.length !== 1 ? 's' : ''} added</span>
              <Button onClick={handleAddSession} className="bg-gray-900 text-white cursor-pointer">
                <Plus className="mr-2 w-4 h-4" /> Add Session
              </Button>
            </div>

            {sessions.map((session: SessionData, index: number) => (
              <div key={index} className="session-card border border-gray-200 p-2 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{session.title}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span>
                        <Clock className="inline w-3 h-3 mr-1" />
                        {session.startTime} ({session.duration} min)
                      </span>
                      <span>by {session.speaker}</span>
                    </div>
                    {session.description && (
                      <p className="text-sm text-gray-600 mt-2">{session.description}</p>
                    )}
                    {session.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {session.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-black/10 text-black text-xs rounded-full "
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditSession(index)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSession(index)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
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

      <SessionModal
        open={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        editingIndex={editingSessionIndex}
      />
    </div>
  );
}
