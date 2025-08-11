// client/src/pages/ChildProfile.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../services/api';
import { Button } from '../components/ui/button';
import { PaymentMethod, type SponsorshipData, type Child } from '../types/apiTypes';

const ChildProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [child, setChild] = useState<Child | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CreditCard);

    useEffect(() => {
        const fetchChild = async () => {
            if (!id) {
                setError("No child ID provided.");
                setLoading(false);
                return;
            }
            try {
                const fetchedChild = await apiService.sponsorship.getChild(id);
                setChild(fetchedChild);
            } catch (err) {
                console.error("Failed to fetch child:", err);
                setError("Failed to load child's profile. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchChild();
    }, [id]);

    const handleSponsor = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (!child) return;

        try {
            const sponsorshipData: SponsorshipData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                monthlyAmount: 39, // Standard sponsorship amount
                paymentMethod: selectedPaymentMethod,
                currency: 'USD',
                childId: child._id, // Pass the child's ID from the URL
            };

            await apiService.sponsorship.create(sponsorshipData);
            alert(`Thank you for sponsoring ${child.name}!`);
        } catch (error) {
            console.error('Sponsorship failed:', error);
            alert('Sponsorship failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading child profile...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
    }

    if (!child) {
        return <div className="flex justify-center items-center h-screen">Child not found.</div>;
    }

    return (
        <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Child Information Section */}
                <div>
                    <img src={child.photoUrl} alt={`Photo of ${child.name}`} className="w-full h-auto rounded-lg shadow-lg mb-6" />
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{child.name}, {child.age}</h1>
                    <p className="text-lg text-gray-600 mb-6">{child.country}</p>
                    <p className="text-gray-700 leading-relaxed">{child.story}</p>
                </div>

                {/* Sponsorship Form Section */}
                <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Sponsor {child.name}</h2>
                    <p className="text-gray-600 mb-6">
                        Your monthly gift of $39 provides {child.name} with education, healthcare, and a brighter future.
                    </p>

                    <form onSubmit={handleSponsor}>
                        {/* Contact Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <input
                                type="text"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                required
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                required
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
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

                        <Button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Processing...' : `Sponsor ${child.name} for $39/month`}
                        </Button>
                        <p className="text-xs text-gray-500 mt-4 text-center">
                            This is a demo form. No actual payment will be processed.
                        </p>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default ChildProfile;