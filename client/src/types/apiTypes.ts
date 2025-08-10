// client/src/types/apiTypes.ts


export interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export const PaymentMethod = {
    CreditCard: "credit_card",
    DebitCard: "debit_card",
    PayPal: "paypal",
    MobileMoney: "mobile_money",
} as const;

// The type is inferred from the object
export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

// Donation types
export interface DonationData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  amount?: number; // Made optional
  currency?: string; // Made optional
  item_type?: string; // New field
  description?: string; // New field
  type: 'monthly' | 'one-time';
  category: 'general' | 'disaster' | 'sponsor' | 'items'; // Updated with new category
  paymentMethod?: PaymentMethod; // Made optional
  childId?: string;
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
  childId?: string;
  monthlyAmount: number;
  paymentMethod: PaymentMethod;
  currency: string;
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