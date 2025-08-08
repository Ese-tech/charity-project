// SponsorPage.tsx

import React, { useState } from 'react';
import DonationModal from '../components/DonationModal';

const SponsorPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string | undefined>(undefined);

  const children = [
    { id: 'child-abc', name: 'Maria', country: 'Kenya' },
    { id: 'child-def', name: 'Samuel', country: 'Haiti' },
    // You can add more children here from your mock data or a real API call.
  ];

  const handleSponsorClick = (childId: string) => {
    setSelectedChildId(childId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedChildId(undefined);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Sponsor a Child</h1>
      <p className="text-lg text-gray-700 mb-8">Select a child to provide them with life-changing support.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.map(child => (
          <div key={child.id} className="border rounded-lg shadow-md p-6 bg-white">
            <h2 className="text-xl font-semibold">{child.name}</h2>
            <p className="text-gray-600">Country: {child.country}</p>
            <button
              onClick={() => handleSponsorClick(child.id)}
              className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Sponsor {child.name}
            </button>
          </div>
        ))}
      </div>
      
      <DonationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        type="sponsor"
        childId={selectedChildId} // <-- The crucial part for the backend
      />
    </div>
  );
};

export default SponsorPage;