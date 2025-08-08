// User interface for authentication
export interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

// Donation types
export interface DonationData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  amount: number;
  type: 'monthly' | 'one-time';
  category: 'general' | 'disaster' | 'sponsor';
  paymentMethod: string;
}

export interface DonationResponse {
  _id: string;
  amount: number;
  type: string;
  category: string;
  donorInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
}

// Sponsorship types
export interface SponsorshipData {
  sponsorInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  monthlyAmount: number;
  childId?: string;
}

export interface Child {
  _id: string;
  name: string;
  age: number;
  country: string;
  region: string;
  photoUrl: string;
  story: string;
  needs: string[];
}

// Newsletter types
export interface NewsletterSubscription {
  email: string;
  firstName?: string;
  lastName?: string;
  preferences?: string[];
}

// Content types
export interface Story {
  _id: string;
  title: string;
  content: string;
  category: string;
  featured: boolean;
  imageUrl?: string;
  publishedAt: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ImpactStats {
  totalDonations: number;
  childrenSupported: number;
  emergencyResponses: number;
  countriesServed: number;
}