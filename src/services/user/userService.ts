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

export async function registerUser(data: any) {
  try {
    const response = await post('/user/register', data);
    console.log('register user response----', response)
    return response;
  } catch (err: any) {
    throw new Error(err.message || 'Failed to register user');
  }
}

