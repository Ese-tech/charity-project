// client/src/pages/SponsorPage.tsx

import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Button } from '../components/ui/button';
import DonationModal from '../components/DonationModal';
import type { Child } from '../types/apiTypes';

const SponsorPage: React.FC = () => {
    const [children, setChildren] = useState<Child[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [donationModal, setDonationModal] = useState<{
        isOpen: boolean;
        childId: string | null;
    }>({
        isOpen: false,
        childId: null,
    });

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const availableChildren = await apiService.sponsorship.getAvailableChildren();
                setChildren(availableChildren);
            } catch (err) {
                console.error("Failed to fetch children:", err);
                setError("Failed to load children. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchChildren();
    }, []);

    const handleSponsorClick = (childId: string) => {
        setDonationModal({ isOpen: true, childId });
    };

    const handleModalClose = () => {
        setDonationModal({ isOpen: false, childId: null });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-gray-600">Loading children...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">Sponsor a Child</h1>
            <p className="text-lg text-center text-gray-600 mb-12">
                Make a difference in a child's life by providing them with the support they need to thrive.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {children.map((child) => (
                    <div key={child._id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                        <img src={child.photoUrl} alt={child.name} className="w-full h-64 object-cover" />
                        <div className="p-6 flex-grow flex flex-col">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{child.name}, {child.age}</h2>
                            <p className="text-gray-600 mb-4 flex-grow">{child.story}</p>
                            <Button 
                                onClick={() => handleSponsorClick(child._id)}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-all"
                            >
                                Sponsor {child.name}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <DonationModal
                isOpen={donationModal.isOpen}
                onClose={handleModalClose}
                type="sponsor"
                childId={donationModal.childId || undefined}
            />
        </div>
    );
};

export default SponsorPage;