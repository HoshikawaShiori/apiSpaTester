import api from './config';

export const isAuthenticated = async () => {
  try {
    const response = await api.get('api/v1/user');
    return response.data !== null; 
  } catch (error) {
    return false; 
  }
}; 