import { Metadata, ResolvingMetadata } from 'next';
import { getEventById } from '@/services/organization/eventService';

export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Fetch event from API
  const response = await getEventById(params.id);
  if (!response?.success || !response.data) {
    return {
      title: 'Event Not Found',
    };
  }
  const event = response.data;
  return {
    title: `${event.event_name} | Event Overview`,
    description: event.description,
  };
}
