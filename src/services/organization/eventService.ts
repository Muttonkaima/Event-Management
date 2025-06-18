import { get, post, upload, del, put } from '@/services/controllerServices';

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

export async function createEmailTemplate(data: any) {
  try {
    const response = await upload('/organization/create-email-template', data);
    console.log('create email template response----',response)
    return response; // returns the array of templates
  } catch (err: any) {
    throw new Error(err.message || 'Failed to create email template');
  }
}

export async function getAllEmailTemplates() {
  try {
    const response = await get('/organization/get-all-email-templates');
    console.log('get all email templates response----',response)
    return response; // returns the array of templates
  } catch (err: any) {
    throw new Error(err.message || 'Failed to get email templates');
  }
}

export async function deleteEmailTemplate(id: string) {
  try {
    const response = await del('/organization/delete-email-template', {
      body: { id },
    });
    console.log('delete email template response ----', response);
    return response;
  } catch (err: any) {
    throw new Error(err.message || 'Failed to delete email template');
  }
}

export async function createRegistrationForm(data: any) {
  try {
    const response = await post('/organization/create-registration-form', data);
    console.log('create registration form response----',response)
    return response; 
  } catch (err: any) {
    throw new Error(err.message || 'Failed to create registration form');
  }
}

export async function getAllRegistrationForms() {
  try {
    const response = await get('/organization/get-all-registration-forms');
    console.log('get all registration forms response----',response)
    return response; 
  } catch (err: any) {
    throw new Error(err.message || 'Failed to get registration forms');
  }
}

export async function deleteRegistrationForm(id: string) {
  try {
    const response = await del('/organization/delete-registration-form', {
      body: { id },
    });
    console.log('delete registration form response ----', response);
    return response;
  } catch (err: any) {
    throw new Error(err.message || 'Failed to delete registration form');
  }
}

export async function createBadge(data: any) {
  try {
    const response = await upload('/organization/create-badge', data);
    console.log('create badge response----',response)
    return response; // returns the badge
  } catch (err: any) {
    throw new Error(err.message || 'Failed to create badge');
  }
}

export async function getAllBadges() {
  try {
    const response = await get('/organization/get-all-badges');
    console.log('get all badge response----',response)
    return response; // returns the array of badges
  } catch (err: any) {
    throw new Error(err.message || 'Failed to get badges');
  }
}

export async function deleteBadge(id: string) {
  try {
    const response = await del('/organization/delete-badge', {
      body: { id },
    });
    console.log('delete badge response ----', response);
    return response;
  } catch (err: any) {
    throw new Error(err.message || 'Failed to delete badge');
  }
}

export async function getBadgeById (id: string) {
  try {
    const response = await get(`/organization/get-badge-by-id/${id}`);
    console.log('get badge by id response----',response)
    return response; // returns the badge by id
  } catch (err: any) {
    throw new Error(err.message || 'Failed to get badge by id');
  }
}

export async function updateBadge(id: string, data: any) {
  try {
    const response = await put(`/organization/update-badge/${id}`, data);
    console.log('update badge response ----', response);
    return response;
  } catch (err: any) {
    throw new Error(err.message || 'Failed to update badge');
  }
}