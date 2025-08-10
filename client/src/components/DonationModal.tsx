// client/src/components/DonationModal.tsx
import React, { useState } from 'react';
import { Button } from './ui/button';
import { X, Heart, Shield, Users } from 'lucide-react';
import { mockData } from './mock';
import { apiService } from '../services/api';
import { PaymentMethod } from '../types/apiTypes';
import type { DonationData, SponsorshipData } from '../types/apiTypes';

// Define an interface for the component's props
interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'general' | 'disaster' | 'sponsor' | 'items';
  childId?: string;
}

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose, type = 'general', childId }) => {
  const SPONSORSHIP_AMOUNT = 39;
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donationType, setDonationType] = useState<'monthly' | 'one-time'>('monthly');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [itemData, setItemData] = useState({
    item_type: '',
    description: '',
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CreditCard);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donationCategory, setDonationCategory] = useState<'monetary' | 'items'>(type === 'items' ? 'items' : 'monetary');

  if (!isOpen) return null;

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value) {
      setSelectedAmount(parseInt(value) || 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const amount = type === 'sponsor' ? SPONSORSHIP_AMOUNT : (customAmount ? parseFloat(customAmount) : selectedAmount);

    try {
      if (type === 'sponsor') {
        // Build sponsorship data, but only include childId if it exists
        const sponsorshipData: SponsorshipData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          monthlyAmount: amount,
          paymentMethod: selectedPaymentMethod,
          currency: selectedCurrency,
        };

        if (childId) {
          sponsorshipData.childId = childId;
        }

        await apiService.sponsorship.create(sponsorshipData);
        alert('Thank you for sponsoring a child!');
      } else {
        const donationData: DonationData = {
          ...formData,
          type: donationType,
          category: type,
        };

        if (donationCategory === 'monetary') {
          if (!amount || amount <= 0) {
            alert('Please enter a valid donation amount.');
            setIsSubmitting(false);
            return;
          }
          donationData.amount = amount;
          donationData.currency = selectedCurrency;
          donationData.paymentMethod = selectedPaymentMethod;
        } else {
          donationData.category = 'items';
          donationData.item_type = itemData.item_type;
          donationData.description = itemData.description;
          donationData.amount = undefined;
          donationData.currency = undefined;
          donationData.paymentMethod = undefined;
        }

        await apiService.donations.create(donationData);
        alert('Thank you for your donation!');
      }
      onClose();
    } catch (error) {
      console.error('Donation failed:', error);
      alert('Donation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemDataChange = (field: string, value: string) => {
    setItemData(prev => ({ ...prev, [field]: value }));
  };

  const getTitle = () => {
    switch(type) {
      case 'sponsor': return 'Sponsor a Child - $39/month';
      case 'disaster': return 'Support Disaster Relief';
      case 'items': return 'Donate Items';
      default: return 'Make a Donation';
    }
  };

  const getDescription = () => {
    switch(type) {
      case 'sponsor': return 'Your monthly gift provides a sponsored child with access to clean water, healthcare, education, and economic opportunities.';
      case 'disaster': return 'Help us respond quickly to emergencies and provide relief to families affected by disasters worldwide.';
      case 'items': return 'Your donation of essential items helps us provide direct support to families in need.';
      default: return 'Your generous gift helps us continue our mission to serve vulnerable children and communities worldwide.';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">{getDescription()}</p>

          {/* Impact Icons */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Heart className="w-6 h-6 text-orange-500" />
              </div>
              <span className="text-sm text-gray-600">Healthcare</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="w-6 h-6 text-orange-500" />
              </div>
              <span className="text-sm text-gray-600">Protection</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-orange-500" />
              </div>
              <span className="text-sm text-gray-600">Community</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
             {/* Donation Category Selection */}
             {type !== 'sponsor' && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Donation Category
                    </label>
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={() => setDonationCategory('monetary')}
                            className={`flex-1 py-3 px-4 rounded-lg border text-center transition-all ${
                                donationCategory === 'monetary'
                                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                                    : 'border-gray-300 text-gray-700 hover:border-orange-300'
                            }`}
                        >
                            Monetary
                        </button>
                        <button
                            type="button"
                            onClick={() => setDonationCategory('items')}
                            className={`flex-1 py-3 px-4 rounded-lg border text-center transition-all ${
                                donationCategory === 'items'
                                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                                    : 'border-gray-300 text-gray-700 hover:border-orange-300'
                            }`}
                        >
                            Items
                        </button>
                    </div>
                </div>
            )}
            
            {/* Conditional Fields based on donationCategory */}
            {donationCategory === 'monetary' ? (
                <>
                    {/* Donation Type */}
                    {type !== 'sponsor' && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                        Donation Type
                        </label>
                        <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={() => setDonationType('monthly')}
                            className={`flex-1 py-3 px-4 rounded-lg border text-center transition-all ${
                            donationType === 'monthly'
                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                : 'border-gray-300 text-gray-700 hover:border-orange-300'
                            }`}
                        >
                            Monthly
                        </button>
                        <button
                            type="button"
                            onClick={() => setDonationType('one-time')}
                            className={`flex-1 py-3 px-4 rounded-lg border text-center transition-all ${
                            donationType === 'one-time'
                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                : 'border-gray-300 text-gray-700 hover:border-orange-300'
                            }`}
                        >
                            One-time
                        </button>
                        </div>
                    </div>
                    )}

                    {/* Amount Selection */}
                    <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        {type === 'sponsor' ? 'Monthly Amount' : 'Donation Amount'}
                    </label>
                    
                    {type === 'sponsor' ? (
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="text-2xl font-bold text-orange-600">${SPONSORSHIP_AMOUNT}/month</div>
                        <div className="text-sm text-gray-600">Standard sponsorship amount</div>
                        </div>
                    ) : (
                        <>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {mockData.forms.donationAmounts.map((amount: number) => (
                            <button
                                key={amount}
                                type="button"
                                onClick={() => handleAmountSelect(amount)}
                                className={`py-3 px-4 rounded-lg border text-center transition-all ${
                                selectedAmount === amount && !customAmount
                                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                                    : 'border-gray-300 text-gray-700 hover:border-orange-300'
                                }`}
                            >
                                ${amount}
                            </button>
                            ))}
                        </div>
                        <input
                            type="number"
                            placeholder="Custom amount"
                            value={customAmount}
                            onChange={handleCustomAmountChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        </>
                    )}
                    </div>
                
                    {/* Payment Method Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Payment Method
                        </label>
                        <select 
                            value={selectedPaymentMethod}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value as PaymentMethod)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value={PaymentMethod.CreditCard}>Credit Card</option>
                            <option value={PaymentMethod.DebitCard}>Debit Card</option>
                            <option value={PaymentMethod.PayPal}>PayPal</option>
                            <option value={PaymentMethod.MobileMoney}>Mobile Money</option>
                        </select>
                    </div>

                    {/* Currency Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Currency
                        </label>
                        <select 
                            value={selectedCurrency}
                            onChange={(e) => setSelectedCurrency(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                        </select>
                    </div>
                </>
            ) : (
                <>
                    {/* Item Donation Fields */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Item Type (e.g., Clothes, Toys, School Supplies)
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Children's clothes"
                            value={itemData.item_type}
                            onChange={(e) => handleItemDataChange('item_type', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Description
                        </label>
                        <textarea
                            placeholder="Provide a brief description of the items, their condition, and quantity."
                            value={itemData.description}
                            onChange={(e) => handleItemDataChange('description', e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                </>
            )}

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Processing...'
                : donationCategory === 'monetary'
                ? `Complete ${donationType} Donation - $${customAmount || selectedAmount}`
                : 'Submit Item Donation'
              }
            </Button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              This is a demo form. No actual payment will be processed.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;