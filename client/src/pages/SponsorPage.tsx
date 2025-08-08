// client/src/pages/SponsorPage.tsx
import { useState, useEffect } from 'react';
import DonationModal from '../components/DonationModal';

// Import the newly added components
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui card';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';

// Define the interface for the Child data fetched from the API
interface Child {
  id: string;
  name: string;
  country: string;
  age: number;
  photo_url?: string;
  bio?: string;
}

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
        const response = await fetch('http://127.0.0.1:8000/children/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Child[] = await response.json();
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
  
  const closeModal = () => {
    setDonationModal({
        ...donationModal,
        isOpen: false,
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
    <>
      <Header />
      <main className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-12">Sponsor a Child</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {children.map((child) => (
            <Card key={child.id} className="w-full max-w-sm mx-auto">
              {child.photo_url && (
                <img src={child.photo_url} alt={child.name} className="w-full h-48 object-cover rounded-t-lg" />
              )}
              <CardHeader>
                <CardTitle>{child.name}</CardTitle>
                <p className="text-sm text-gray-500">{child.country}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{child.bio}</p>
                <Button onClick={() => handleSponsorClick(child.id)} className="w-full">
                  Sponsor {child.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
      <DonationModal
        isOpen={donationModal.isOpen}
        onClose={() => setDonationModal({ ...donationModal, isOpen: false })}
        type={donationModal.type}
        childId={donationModal.childId}
      />
    </>
  );
};

export default SponsorPage;