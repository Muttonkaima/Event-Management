import { get } from '@/services/controllerServices';

export async function getEventTemplates() {
  try {
    const response = await get('/organization/get-event-template-designs');
    console.log('event templates response----',response)
    return response.data; // returns the array of templates
  } catch (err: any) {
    throw new Error(err.message || 'Failed to fetch event templates');
  }
}
