// client/src/services/api.ts
import axios from 'axios';
import type { 
  DonationData, 
  SponsorshipData, 
  NewsletterSubscription, 
  Child, 
  Story, 
  ImpactStats,
} from '../types/apiTypes';

// To fix the "Cannot find name 'process'" error in TypeScript
// The `npm install` command above is the primary fix. This line is a fallback.
// declare var process: {
//   env: {
//     REACT_APP_BACKEND_URL: string;
//   };
// };

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const API_BASE = `${BACKEND_URL}`;

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  donations: {
    create: async (donationData: DonationData) => {
    // Construct the payload to match the backend's expected structure
    const payload = {
      amount: donationData.amount,
      type: donationData.type,
      category: donationData.category,
      firstName: donationData.firstName, // <-- Use separate fields
      lastName: donationData.lastName,   // <-- Use separate fields
      email: donationData.email,
      phone: donationData.phone,
      paymentMethod: donationData.paymentMethod,
      currency: donationData.currency,
    };
    
    // Now send the corrected payload
    const response = await apiClient.post('/donations', payload);
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
      // The backend now correctly handles this endpoint
      const params = new URLSearchParams({ limit: limit.toString() });
      if (region) params.append('region', region);

      const response = await apiClient.get<Child[]>(`/children/available?${params}`);
      return response.data;
    },

    create: async (sponsorshipData: SponsorshipData) => {
    // Corrected payload to match the new flat backend model
    const payload = {
      amount: sponsorshipData.monthlyAmount, // <-- Corrected property name
      firstName: sponsorshipData.firstName, // <-- Use the new flat structure
      lastName: sponsorshipData.lastName,
      email: sponsorshipData.email,
      child_id: sponsorshipData.childId, // <-- Corrected property name
    };

    // Now send the corrected payload
    const response = await apiClient.post('/sponsorships', payload); // <-- This route now exists
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