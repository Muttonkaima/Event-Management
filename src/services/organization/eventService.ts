import { get } from '@/services/controllerServices';

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