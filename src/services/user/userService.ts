import { get, post, upload, del, put } from '@/services/controllerServices';

export async function getUserRegistrationForm(data: any) {
  try {
    const response = await get(`/user/get-user-registration-form?event_id=${data.event_id}&registration_form_id=${data.registration_form_id}&email=${data.email}`);
    console.log('get user registration form response----', response)
    return response;
  } catch (err: any) {
    throw new Error(err.message || 'Failed to get user registration form');
  }
}

export async function submitRegistrationForm(data: any) {
  try {
    console.log('submit registration form data----', data)
    const response = await upload('/user/submit-user-registration-form', data);
    console.log('submit registration form response----', response)
    return response;
  } catch (err: any) {
    throw new Error(err.message || 'Failed to submit registration form');
  }
}

export async function getUserRegistrationResponse(data: any) {
  try {
    const response = await get(`/user/get-user-registration-response?event_id=${data.event_id}&email=${data.email}`);
    console.log('get user registration response----', response)
    return response;
  } catch (err: any) {
    throw new Error(err.message || 'Failed to get user registration response');
  }
}

export async function getUserProfile(id: string) {
  try {
    const response = await get(`/user/get-user-profile-by-id/${id}`);
    console.log('get user profile response----', response)
    return response;
  } catch (err: any) {
    throw new Error(err.message || 'Failed to get user profile');
  }
}


