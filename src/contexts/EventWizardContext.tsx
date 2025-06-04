import { createContext, useContext, useReducer, ReactNode } from 'react';
import { EventWizardData, EventTemplate, EventType, ColorTheme, FontStyle, SessionData } from '@/shared/eventSchema';

// Initial state
const initialState: EventWizardData = {
  currentStep: 1,
  template: 'professional',
  event: {
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '17:00',
    timezone: 'UTC',
    eventType: 'in-person',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    meetingLink: ''
  },
  branding: {
    colorTheme: 'professional',
    fontStyle: 'modern',
    visibility: {
      showLogo: true,
      showBanner: true,
      showDescription: true,
      showSchedule: true,
      showSpeakers: true,
      showLocation: true,
      showRegistration: true
    }
  },
  sessions: [],
  registration: {
    registrationOpen: '',
    registrationClose: '',
    paymentType: 'free',
    currency: 'USD',
    confirmationEmail: 'Thank you for registering for our event. We look forward to seeing you!',
    termsConditions: 'By registering for this event, you agree to our terms and conditions.',
    fields: [
      {
        fieldName: 'Full Name',
        fieldType: 'text',
        required: true
      },
      {
        fieldName: 'Email Address',
        fieldType: 'email',
        required: true
      }
    ]
  }
};

// Action types
type EventWizardAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_TEMPLATE'; payload: EventTemplate }
  | { type: 'UPDATE_EVENT'; payload: Partial<EventWizardData['event']> }
  | { type: 'UPDATE_BRANDING'; payload: Partial<EventWizardData['branding']> }
  | { type: 'UPDATE_VISIBILITY'; payload: Partial<EventWizardData['branding']['visibility']> }
  | { type: 'ADD_SESSION'; payload: SessionData }
  | { type: 'UPDATE_SESSION'; payload: { index: number; session: SessionData } }
  | { type: 'DELETE_SESSION'; payload: number }
  | { type: 'UPDATE_REGISTRATION'; payload: Partial<EventWizardData['registration']> }
  | { type: 'ADD_REGISTRATION_FIELD'; payload: EventWizardData['registration']['fields'][0] }
  | { type: 'UPDATE_REGISTRATION_FIELD'; payload: { index: number; field: EventWizardData['registration']['fields'][0] } }
  | { type: 'DELETE_REGISTRATION_FIELD'; payload: number }
  | { type: 'RESET' };

// Reducer
function eventWizardReducer(state: EventWizardData, action: EventWizardAction): EventWizardData {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'SET_TEMPLATE':
      return { ...state, template: action.payload };
    
    case 'UPDATE_EVENT':
      return {
        ...state,
        event: { ...state.event, ...action.payload }
      };
    
    case 'UPDATE_BRANDING':
      return {
        ...state,
        branding: { ...state.branding, ...action.payload }
      };
    
    case 'UPDATE_VISIBILITY':
      return {
        ...state,
        branding: {
          ...state.branding,
          visibility: { ...state.branding.visibility, ...action.payload }
        }
      };
    
    case 'ADD_SESSION':
      return {
        ...state,
        sessions: [...state.sessions, { ...action.payload, id: Date.now() }]
      };
    
    case 'UPDATE_SESSION':
      return {
        ...state,
        sessions: state.sessions.map((session, index) =>
          index === action.payload.index ? action.payload.session : session
        )
      };
    
    case 'DELETE_SESSION':
      return {
        ...state,
        sessions: state.sessions.filter((_, index) => index !== action.payload)
      };
    
    case 'UPDATE_REGISTRATION':
      return {
        ...state,
        registration: { ...state.registration, ...action.payload }
      };
    
    case 'ADD_REGISTRATION_FIELD':
      return {
        ...state,
        registration: {
          ...state.registration,
          fields: [...state.registration.fields, action.payload]
        }
      };
    
    case 'UPDATE_REGISTRATION_FIELD':
      return {
        ...state,
        registration: {
          ...state.registration,
          fields: state.registration.fields.map((field, index) =>
            index === action.payload.index ? action.payload.field : field
          )
        }
      };
    
    case 'DELETE_REGISTRATION_FIELD':
      return {
        ...state,
        registration: {
          ...state.registration,
          fields: state.registration.fields.filter((_, index) => index !== action.payload)
        }
      };
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
}

// Context
interface EventWizardContextType {
  state: EventWizardData;
  dispatch: React.Dispatch<EventWizardAction>;
  actions: {
    setStep: (step: number) => void;
    setTemplate: (template: EventTemplate) => void;
    updateEvent: (data: Partial<EventWizardData['event']>) => void;
    updateBranding: (data: Partial<EventWizardData['branding']>) => void;
    updateVisibility: (data: Partial<EventWizardData['branding']['visibility']>) => void;
    addSession: (session: Omit<SessionData, 'id'>) => void;
    updateSession: (index: number, session: SessionData) => void;
    deleteSession: (index: number) => void;
    updateRegistration: (data: Partial<EventWizardData['registration']>) => void;
    addRegistrationField: (field: EventWizardData['registration']['fields'][0]) => void;
    updateRegistrationField: (index: number, field: EventWizardData['registration']['fields'][0]) => void;
    deleteRegistrationField: (index: number) => void;
    reset: () => void;
  };
}

const EventWizardContext = createContext<EventWizardContextType | undefined>(undefined);

// Provider
interface EventWizardProviderProps {
  children: ReactNode;
}

export function EventWizardProvider({ children }: EventWizardProviderProps) {
  const [state, dispatch] = useReducer(eventWizardReducer, initialState);

  const actions = {
    setStep: (step: number) => dispatch({ type: 'SET_STEP', payload: step }),
    setTemplate: (template: EventTemplate) => dispatch({ type: 'SET_TEMPLATE', payload: template }),
    updateEvent: (data: Partial<EventWizardData['event']>) => dispatch({ type: 'UPDATE_EVENT', payload: data }),
    updateBranding: (data: Partial<EventWizardData['branding']>) => dispatch({ type: 'UPDATE_BRANDING', payload: data }),
    updateVisibility: (data: Partial<EventWizardData['branding']['visibility']>) => dispatch({ type: 'UPDATE_VISIBILITY', payload: data }),
    addSession: (session: Omit<SessionData, 'id'>) => dispatch({ type: 'ADD_SESSION', payload: session as SessionData }),
    updateSession: (index: number, session: SessionData) => dispatch({ type: 'UPDATE_SESSION', payload: { index, session } }),
    deleteSession: (index: number) => dispatch({ type: 'DELETE_SESSION', payload: index }),
    updateRegistration: (data: Partial<EventWizardData['registration']>) => dispatch({ type: 'UPDATE_REGISTRATION', payload: data }),
    addRegistrationField: (field: EventWizardData['registration']['fields'][0]) => dispatch({ type: 'ADD_REGISTRATION_FIELD', payload: field }),
    updateRegistrationField: (index: number, field: EventWizardData['registration']['fields'][0]) => dispatch({ type: 'UPDATE_REGISTRATION_FIELD', payload: { index, field } }),
    deleteRegistrationField: (index: number) => dispatch({ type: 'DELETE_REGISTRATION_FIELD', payload: index }),
    reset: () => dispatch({ type: 'RESET' })
  };

  return (
    <EventWizardContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </EventWizardContext.Provider>
  );
}

// Hook
export function useEventWizard() {
  const context = useContext(EventWizardContext);
  if (context === undefined) {
    throw new Error('useEventWizard must be used within an EventWizardProvider');
  }
  return context;
}
