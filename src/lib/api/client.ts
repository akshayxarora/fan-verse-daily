// API client for making requests to the backend
// This will work with Vercel serverless functions

// Support both Vite (import.meta.env) and Next.js (process.env)
const API_BASE_URL = typeof window !== 'undefined' 
  ? (import.meta.env?.VITE_API_URL || '/api')
  : (process.env.NEXT_PUBLIC_API_URL || '/api');

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get auth token if available
  const token = localStorage.getItem('auth_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, response.statusText, errorData);
  }

  return response.json();
}

// Posts API
export const postsApi = {
  getAll: async (params?: { type?: string; status?: string; limit?: number; offset?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const query = queryParams.toString();
    return fetchApi(`/posts${query ? `?${query}` : ''}`);
  },

  getBySlug: async (slug: string) => {
    return fetchApi(`/posts/${slug}`);
  },

  create: async (data: any) => {
    return fetchApi('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return fetchApi(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchApi(`/posts/${id}`, {
      method: 'DELETE',
    });
  },
};

// Tools API
export const toolsApi = {
  getAll: async () => {
    return fetchApi('/tools');
  },

  getBySlug: async (slug: string) => {
    return fetchApi(`/tools/${slug}`);
  },

  create: async (data: any) => {
    return fetchApi('/tools', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return fetchApi(`/tools/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchApi(`/tools/${id}`, {
      method: 'DELETE',
    });
  },
};

// Newsletter API
export const newsletterApi = {
  subscribe: async (email: string, source?: string) => {
    return fetchApi('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email, source }),
    });
  },

  unsubscribe: async (email: string) => {
    return fetchApi('/newsletter/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  getSubscribers: async (params?: { status?: string; limit?: number; offset?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const query = queryParams.toString();
    return fetchApi(`/newsletter/subscribers${query ? `?${query}` : ''}`);
  },

  send: async (subject: string, html: string, testEmail?: string) => {
    return fetchApi('/newsletter/send', {
      method: 'POST',
      body: JSON.stringify({ subject, html, testEmail }),
    });
  },

  remove: async (email: string) => {
    return fetchApi(`/newsletter/subscribers?email=${email}`, {
      method: 'DELETE',
    });
  },
};

// Settings API
export const settingsApi = {
  getAll: async () => {
    return fetchApi('/settings');
  },

  get: async (key: string) => {
    return fetchApi(`/settings/${key}`);
  },

  update: async (key: string, value: any, type: string = 'string', group: string = 'general') => {
    return fetchApi(`/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value, type, group }),
    });
  },
};

// Analytics API
export const analyticsApi = {
  getGlobal: async () => {
    return fetchApi('/analytics?type=global');
  },

  getPost: async (postId: string) => {
    return fetchApi(`/analytics?type=post&postId=${postId}`);
  },
};

// Code Injection API
export const codeInjectionApi = {
  getAll: async (location?: string) => {
    return fetchApi(`/code-injection${location ? `?location=${location}` : ''}`);
  },

  create: async (data: any) => {
    return fetchApi('/code-injection', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return fetchApi(`/code-injection/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchApi(`/code-injection/${id}`, {
      method: 'DELETE',
    });
  },
};

// Themes API
export const themesApi = {
  getAll: async () => {
    return fetchApi('/themes');
  },

  getActive: async () => {
    return fetchApi('/themes/active');
  },

  activate: async (id: string) => {
    return fetchApi(`/themes/${id}/activate`, {
      method: 'POST',
    });
  },
};

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    return fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    localStorage.removeItem('auth_token');
    return Promise.resolve();
  },

  me: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new ApiError(401, 'Unauthorized');
    }
    return fetchApi('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// Upload API (for Tigris)
export const uploadApi = {
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    // Get auth token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(response.status, response.statusText, errorData);
    }

    return response.json();
  },
};

