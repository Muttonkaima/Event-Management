import { Metadata, ResolvingMetadata } from 'next';
import { adaptEvents, Event } from '@/app/events/events-new-adapter';
import rawEvents from '@/data/events.json';



export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Find the event with the matching ID
  const eventsData: Event[] = adaptEvents(rawEvents);
  const event = eventsData.find((e) => e.id === params.id);

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
