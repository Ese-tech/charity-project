import axios from 'axios';
import type { 
  DonationData, 
  SponsorshipData, 
  NewsletterSubscription, 
  Child, 
  Story, 
  ImpactStats,
  PaymentMethod,
} from '../types/apiTypes';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
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
    const payload = {
      firstName: donationData.firstName,
      lastName: donationData.lastName,
      email: donationData.email,
      phone: donationData.phone,
      type: donationData.type,
      category: donationData.category,
      childId: donationData.childId,
      ...(donationData.category !== 'items' && {
        amount: donationData.amount,
        currency: donationData.currency,
        paymentMethod: donationData.paymentMethod,
      }),
      ...(donationData.category === 'items' && {
        item_type: donationData.item_type,
        description: donationData.description,
      }),
    };
    
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
      const params = new URLSearchParams({ limit: limit.toString() });
      if (region) params.append('region', region);

      const response = await apiClient.get<Child[]>(`/children/available?${params}`);
      
      return response.data;
    },
    
    getFeaturedChild: async () => {
      const response = await apiClient.get<Child>('/children/featured');
      return response.data;
    },

    // ADDED: The missing getChild method to fetch a single child by ID
    getChild: async (child_id: string) => {
      const response = await apiClient.get<Child>(`/children/${child_id}`);
      return response.data;
    },

    create: async (sponsorshipData: SponsorshipData) => {
    const payload = {
      monthlyAmount: sponsorshipData.monthlyAmount,
      firstName: sponsorshipData.firstName,
      lastName: sponsorshipData.lastName,
      email: sponsorshipData.email,
      childId: sponsorshipData.childId,
      paymentMethod: sponsorshipData.paymentMethod,
      currency: sponsorshipData.currency,
    };

    const response = await apiClient.post('/sponsorships', payload);
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
    
  stories: { 
    getStories: async () => { 
      const response = await apiClient.get<Story[]>('/stories');
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