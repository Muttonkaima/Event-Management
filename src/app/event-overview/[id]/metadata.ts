import { Metadata, ResolvingMetadata } from 'next';
import eventsData from '@/data/events.json';

export interface Event {
  id: string;
  name: string;
  description: string;
  date: {
    start: string;
    end: string;
  };
  location: {
    name: string;
    city: string;
    address: string;
    country: string;
  };
  status: string;
  organizer: {
    name: string;
    email: string;
    avatar: string;
  };
  attendees: number;
  category: string;
  tags: string[];
  image: string;
}

export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Find the event with the matching ID
  const event = (eventsData as Event[]).find((e) => e.id === params.id);

  if (!event) {
    return {
      title: 'Event Not Found',
    };
  }

  return {
    title: `${event.name} | Event Overview`,
    description: event.description,
  };
}
