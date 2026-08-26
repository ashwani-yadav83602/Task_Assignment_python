import { fetchApi } from './api';

export const dashboardService = {
  getStats: async () => {
    return fetchApi('/dashboard');
  }
};
