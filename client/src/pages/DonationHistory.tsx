// client/src/pages/DonationHistory.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { apiService } from '../services/api';
import type { DonationData } from '../types/apiTypes';

const DonationHistory: React.FC = () => {
  const { userInfo } = useAuth();
  const [donations, setDonations] = useState<DonationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userInfo?.email) {
      setError('Please log in to view your donation history.');
      setLoading(false);
      return;
    }

    const fetchDonationHistory = async () => {
      try {
        const history = await apiService.donations.getHistoryByEmail(userInfo.email);
        setDonations(history);
      } catch (err) {
        console.error('Failed to fetch donation history:', err);
        setError('Failed to load your donation history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonationHistory();
  }, [userInfo]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading donation history...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }
  
  if (donations.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">You have no donation history.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Your Donation & Sponsorship History</h1>
      <div className="space-y-6">
        {donations.map((donation, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-gray-900">
                {donation.category === 'sponsor' ? 'Child Sponsorship' : 'General Donation'}
              </h2>
              <span className="text-sm text-gray-500">
                {/* CORRECTED: Conditional check for createdAt */}
                {donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : 'Date not available'}
              </span>
            </div>
            <p className="text-gray-700">
              <span className="font-semibold">Amount:</span> ${donation.amount?.toFixed(2)} {donation.currency}
            </p>
            {donation.childId && (
              <p className="text-gray-700">
                <span className="font-semibold">Child ID:</span> {donation.childId}
              </p>
            )}
            <p className="text-gray-700">
              <span className="font-semibold">Payment Method:</span> {donation.paymentMethod}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonationHistory;