const API_BASE_URL = 'http://localhost:8000/api';

export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'An error occurred during the API request');
  }

  // Handle empty responses (like 204 No Content for DELETE)
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
