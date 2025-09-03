// API utility functions
import { API_BASE_URL } from './constants';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData.code
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'An unknown error occurred',
      0
    );
  }
}

// Auth API functions
export const authApi = {
  login: (data: { email: string; password: string }) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  register: (data: { name: string; email: string; password: string }) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),
  
  getProfile: () =>
    apiRequest('/auth/profile'),
  
  updateProfile: (data: { name?: string; email?: string }) =>
    apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Polls API functions
export const pollsApi = {
  getPolls: (params?: { page?: number; limit?: number; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    
    const query = searchParams.toString();
    return apiRequest(`/polls${query ? `?${query}` : ''}`);
  },
  
  getPoll: (id: string) =>
    apiRequest(`/polls/${id}`),
  
  createPoll: (data: {
    title: string;
    description?: string;
    options: string[];
    isPublic: boolean;
    allowMultipleVotes: boolean;
    expiresAt?: string;
  }) =>
    apiRequest('/polls', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updatePoll: (id: string, data: Partial<{
    title: string;
    description: string;
    isPublic: boolean;
    allowMultipleVotes: boolean;
    expiresAt: string;
  }>) =>
    apiRequest(`/polls/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  deletePoll: (id: string) =>
    apiRequest(`/polls/${id}`, {
      method: 'DELETE',
    }),
  
  vote: (id: string, data: { optionIds: string[] }) =>
    apiRequest(`/polls/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getMyPolls: () =>
    apiRequest('/polls/my'),
};


