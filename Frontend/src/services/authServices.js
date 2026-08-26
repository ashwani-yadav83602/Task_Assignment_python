import { fetchApi } from './api';

export const authService = {
  login: async (email, password) => {
    return fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
};