import { fetchApi } from './api';

export const taskService = {
  getTasks: async (params = {}) => {
    // Convert params object to query string
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    
    const queryString = query.toString();
    const endpoint = `/tasks${queryString ? `?${queryString}` : ''}`;
    return fetchApi(endpoint);
  },

  getTaskById: async (id) => {
    return fetchApi(`/tasks/${id}`);
  },

  createTask: async (taskData) => {
    return fetchApi('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  updateTask: async (id, updateData) => {
    return fetchApi(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  deleteTask: async (id) => {
    return fetchApi(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
  
    addComment: async (taskId, comment) => {
    return fetchApi(`/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    });
  }
};
