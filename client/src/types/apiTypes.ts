// client/src/types/apiTypes.ts


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
  currency?: string; // Optional, default to 'USD'
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
  firstName: string;
  lastName: string;
  email: string;
  monthlyAmount: number; // Corrected to match the backend payload
  childId?: string;
}

export interface Child {
  _id: string; // <-- Corrected property name to '_id'
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