import axios from 'axios';
import type { 
  DonationData, 
  SponsorshipData, 
  NewsletterSubscription, 
  Child, 
  Story, 
  ImpactStats,
} from '../types/apiTypes'; // Assuming you have a types file for better organization

// To fix the "Cannot find name 'process'" error in TypeScript
// The `npm install` command above is the primary fix. This line is a fallback.
declare var process: {
  env: {
    REACT_APP_BACKEND_URL: string;
  };
};

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
const API_BASE = `${BACKEND_URL}/api`;

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  donations: {
    create: async (donationData: DonationData) => {
      const response = await apiClient.post('/donations', donationData);
      return response.data;
    },
    
    getImpactStats: async () => {
      const response = await apiClient.get<ImpactStats>('/donations/impact-stats');
      return response.data;
    },
    
    getHistory: async (limit: number = 10) => {
      const response = await apiClient.get<DonationData[]>(`/donations/history?limit=${limit}`);
      return response.data;
    }
  },

  sponsorship: {
    getAvailableChildren: async (limit: number = 12, region: string | null = null) => {
      const params = new URLSearchParams({ limit: limit.toString() });
      if (region) params.append('region', region);
      
      const response = await apiClient.get<Child[]>(`/children/available?${params}`);
      return response.data;
    },
    
    create: async (sponsorshipData: SponsorshipData) => {
      const response = await apiClient.post('/sponsorships', sponsorshipData);
      return response.data;
    },
    
    getStats: async () => {
      const response = await apiClient.get('/sponsorship/stats');
      return response.data;
    }
  },

  newsletter: {
    subscribe: async (subscriptionData: NewsletterSubscription) => {
      const response = await apiClient.post('/newsletter/subscribe', subscriptionData);
      return response.data;
    },
    
    unsubscribe: async (email: string) => {
      const response = await apiClient.post('/newsletter/unsubscribe', { email });
      return response.data;
    },
    
    getStats: async () => {
      const response = await apiClient.get('/newsletter/stats');
      return response.data;
    }
  },

  content: {
    getStories: async (limit: number = 6, category: string | null = null, featured: boolean = false) => {
      const params = new URLSearchParams({ 
        limit: limit.toString(),
        featured: featured.toString()
      });
      if (category) params.append('category', category);
      
      const response = await apiClient.get<Story[]>(`/news-stories?${params}`);
      return response.data;
    },
    
    getStoryById: async (storyId: string) => {
      const response = await apiClient.get<Story>(`/stories/${storyId}`);
      return response.data;
    },
    
    searchStories: async (query: string, limit: number = 10) => {
      const params = new URLSearchParams({ 
        q: query,
        limit: limit.toString()
      });
      
      const response = await apiClient.get<Story[]>(`/stories/search?${params}`);
      return response.data;
    }
  },

  healthCheck: async () => {
    const response = await apiClient.get('/');
    return response.data;
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      throw new Error('Resource not found');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.code === 'NETWORK_ERROR') {
      throw new Error('Network error. Please check your connection.');
    }
    
    throw error;
  }
);

export default apiService;