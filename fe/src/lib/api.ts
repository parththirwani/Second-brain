const API_URL = 'http://localhost:3000/api/v1';

interface ApiRequestOptions extends Omit<RequestInit, 'headers'> {
  requiresAuth?: boolean;
  headers?: Record<string, string>;
}

async function apiRequest(endpoint: string, options: ApiRequestOptions = {}) {
  const { requiresAuth = true, ...fetchOptions } = options;
  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (requiresAuth && token) {
    headers.Authorization = token;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    let error;
    try {
      error = await response.json();
    } catch {
      throw new Error('Request failed');
    }
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

export const api = {
  auth: {
    signup: (data: { username: string; password: string }) =>
      apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
        requiresAuth: false,
      }),
    signin: (data: { username: string; password: string }) =>
      apiRequest('/auth/signin', {
        method: 'POST',
        body: JSON.stringify(data),
        requiresAuth: false,
      }),
  },

  content: {
    getAll: () => apiRequest('/content'),
    create: (data: any) =>
      apiRequest('/content', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      apiRequest(`/content/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      apiRequest(`/content/${id}`, { method: 'DELETE' }),
  },

  brain: {
    share: (id: string) =>
      apiRequest(`/brain/share/${id}`, { method: 'PUT' }),
    unshare: (id: string) =>
      apiRequest(`/brain/unshare/${id}`, { method: 'PUT' }),
  },

  profile: {
    get: () => apiRequest('/profile'),
    update: (data: any) =>
      apiRequest('/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    toggleVisibility: (publicProfile: boolean) =>
      apiRequest('/profile/visibility', {
        method: 'PUT',
        body: JSON.stringify({ publicProfile }),
      }),
  },
};