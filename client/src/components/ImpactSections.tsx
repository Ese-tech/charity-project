// client/src/components/ImpactSections.tsx

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { mockData } from './mock';
import DonationModal from './DonationModal';
import { apiService } from '../services/api';
import type { Child } from '../types/apiTypes';

const ImpactSections = () => {
  const [featuredChild, setFeaturedChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Add a loading state
  
  useEffect(() => {
    const fetchFeaturedChild = async () => {
      try {
        const data = await apiService.sponsorship.getFeaturedChild();
        setFeaturedChild(data);
      } catch (e) {
        console.error("Failed to fetch featured child for ImpactSections:", e);
      } finally {
        setLoading(false); // Set loading to false after the API call finishes
      }
    };
    fetchFeaturedChild();
  }, []);

  const [donationModal, setDonationModal] = useState<{
    isOpen: boolean;
    type: 'general' | 'disaster' | 'sponsor';
    childId?: string;
  }>({
    isOpen: false,
    type: 'general',
  });

  const handleSponsorChild = () => {
    console.log('Sponsor a child clicked');
    if (featuredChild && featuredChild._id) {
        setDonationModal({ isOpen: true, type: 'sponsor', childId: featuredChild._id });
    } else {
        console.error("No featured child available to sponsor.");
    }
  };

  const handleDisasterDonate = () => {
    console.log('Disaster relief donate clicked');
    setDonationModal({ isOpen: true, type: 'disaster' });
  };
  
  // Add a loading state check to prevent rendering until data is fetched
  if (loading) {
    return (
      <section className="py-16 bg-gray-50 text-center">
        <p className="text-xl">Loading impact sections...</p>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your partner in faith ... and impact.
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Together, we're making a lasting difference in the lives of children and communities around the world.
          </p>
        </div>

        {/* Impact Cards */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Child Sponsorship Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
            <div className="aspect-w-16 aspect-h-10">
              <img 
                src={featuredChild?.photoUrl || mockData.childSponsorship.image}
                alt="Children supported through sponsorship"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {mockData.childSponsorship.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {mockData.childSponsorship.description}
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">
                    {mockData.childSponsorship.stats.totalSponsored}
                  </div>
                  <div className="text-sm text-gray-600">children supported globally</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">
                    {mockData.childSponsorship.stats.usSponsored}
                  </div>
                  <div className="text-sm text-gray-600">by U.S. sponsors</div>
                </div>
              </div>

              <button 
                onClick={handleSponsorChild}
                className="text-teal-500 hover:text-teal-600 font-semibold flex items-center space-x-1 transition-colors group"
              >
                <span>{mockData.childSponsorship.ctaText}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Disaster Relief Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
            <div className="aspect-w-16 aspect-h-10">
              <img 
                src={mockData.disasterRelief.image}
                alt="Disaster relief efforts"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {mockData.disasterRelief.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {mockData.disasterRelief.description}
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">
                    {mockData.disasterRelief.stats.usEmergencies}
                  </div>
                  <div className="text-sm text-gray-600">emergencies in the U.S.</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">
                    {mockData.disasterRelief.stats.worldwideEmergencies}
                  </div>
                  <div className="text-sm text-gray-600">more worldwide</div>
                </div>
              </div>

              <button 
                onClick={handleDisasterDonate}
                className="text-teal-500 hover:text-teal-600 font-semibold flex items-center space-x-1 transition-colors group"
              >
                <span>{mockData.disasterRelief.ctaText}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="mt-16 text-center bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ready to make a difference?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of compassionate people who are helping create lasting change in communities around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleSponsorChild}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Sponsor a Child
            </Button>
            <Button 
              variant="outline"
              onClick={handleDisasterDonate}
              className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold py-3 px-8 rounded-lg transition-all duration-300"
            >
              Make a Donation
            </Button>
          </div>
        </div>
      </div>
         <DonationModal 
        isOpen={donationModal.isOpen}
        onClose={() => setDonationModal({ isOpen: false, type: 'general' })}
        type={donationModal.type}
      />
    </section>
  );
};

export default ImpactSections;