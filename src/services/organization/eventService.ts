import { get, post, upload } from '@/services/controllerServices';

export async function getEventTemplates() {
  try {
    const response = await get('/organization/get-event-template-designs');
    console.log('event templates response----',response)
    return response; // returns the array of templates
  } catch (err: any) {
    throw new Error(err.message || 'Failed to fetch event templates');
  }
}


export async function getColorThemes() {
  try {
    const response = await get('/organization/get-all-colors');
    console.log('color themes response----',response)
    return response; // returns the array of templates
  } catch (err: any) {
    throw new Error(err.message || 'Failed to fetch color themes');
  }
}

export async function getFontStyles() {
  try {
    const response = await get('/organization/get-all-fonts');
    console.log('font styles response----',response)
    return response; // returns the array of templates
  } catch (err: any) {
    throw new Error(err.message || 'Failed to fetch font styles');
  }
}

export async function createEvent(data: any) {
  try {
    const response = await upload('/organization/create-event', data);
    console.log('create event response----',response)
    return response; // returns the array of templates
  } catch (err: any) {
    throw new Error(err.message || 'Failed to create event');
  }
}

export async function getAllEvents() {
  try {
    const response = await get('/organization/get-all-events');
    console.log('get all events response----',response)
    return response; // returns the array of templates
  } catch (err: any) {
    throw new Error(err.message || 'Failed to get events');
  }
}

export async function getEventById(id: string) {
  try {
    const response = await get(`/organization/get-event-by-id/${id}`);
    console.log('get event by id response----',response)
    return response; // returns the array of templates
  } catch (err: any) {
    throw new Error(err.message || 'Failed to get event by id');
  }
}