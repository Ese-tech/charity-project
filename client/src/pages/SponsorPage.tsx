// client/src/pages/SponsorPage.tsx
import { useState, useEffect } from 'react';
import DonationModal from '../components/DonationModal';
import { apiService } from '../services/api';
import type { Child } from '../types/apiTypes';

// Import the newly added components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SponsorPage = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [donationModal, setDonationModal] = useState<{
    isOpen: boolean;
    type: 'general' | 'disaster' | 'sponsor';
    childId?: string;
  }>({
    isOpen: false,
    type: 'sponsor',
    childId: undefined,
  });

  // Fetch children data from the FastAPI backend
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const data: Child[] = await apiService.sponsorship.getAvailableChildren();
        setChildren(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []); // The empty array ensures this effect runs only once when the component mounts


  const handleSponsorClick = (childId: string) => {
    setDonationModal({
      isOpen: true,
      type: 'sponsor',
      childId: childId,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading children...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error loading data: {error}
      </div>
    );
  }

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-12">Sponsor a Child</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {children.map((child) => (
          <Card key={child._id} className="w-full max-w-sm mx-auto">
            {child.photoUrl && (
              <img src={child.photoUrl} alt={child.name} className="w-full h-48 object-cover rounded-t-lg" />
            )}
            <CardHeader>
              <CardTitle>{child.name}</CardTitle>
              <p className="text-sm text-gray-500">{child.country}</p>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{child.story}</p>
              <Button onClick={() => handleSponsorClick(child._id)} className="w-full">
                Sponsor {child.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <DonationModal
        isOpen={donationModal.isOpen}
        onClose={() => setDonationModal({ ...donationModal, isOpen: false })}
        type={donationModal.type}
        childId={donationModal.childId}
      />
    </main>
  );
};

export default SponsorPage;