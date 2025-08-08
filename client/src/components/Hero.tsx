import { useState } from 'react';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { mockData } from './mock';
import DonationModal from './DonationModal';
import { useToast } from './ToastProvider';

const Hero = () => {
  const [donationModal, setDonationModal] = useState<{ isOpen: boolean; type: 'general' | 'disaster' | 'sponsor' }>({
    isOpen: false,
    type: 'general',
  });
  const { showToast } = useToast(); // <-- Initialize the hook

  const handleDonate = () => {
    console.log('Donate button clicked');
    setDonationModal({ isOpen: true, type: 'general' });
  };

  const handleLearnMore = () => {
    console.log('Learn more clicked');
    // Replace alert() with a toast notification
    showToast('Showing partnership information...', 'info');
  };

  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${mockData.hero.backgroundImage})`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {mockData.hero.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-white mb-8 leading-relaxed">
            {mockData.hero.subtitle}
          </p>

          <Button 
            onClick={handleDonate}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 text-lg rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            {mockData.hero.ctaText}
          </Button>
        </div>

        {/* Partnership section at bottom */}
        <div className="absolute bottom-8 left-4 sm:left-6 lg:left-8">
          <div className="flex items-center space-x-4">
            <span className="text-white font-medium">
              {mockData.hero.partnershipText}
            </span>
            <button 
              onClick={handleLearnMore}
              className="text-teal-400 hover:text-teal-300 font-medium flex items-center space-x-1 transition-colors group"
            >
              <span>{mockData.hero.partnershipCta}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Partner logos */}
        <div className="absolute bottom-8 right-4 sm:right-6 lg:right-8 flex items-center space-x-6">
          <div className="bg-white bg-opacity-90 px-4 py-2 rounded">
            <span className="text-gray-700 font-semibold text-sm">Global Leadership Network</span>
          </div>
          <div className="bg-white bg-opacity-90 px-4 py-2 rounded">
            <span className="text-gray-700 font-semibold text-sm">thrive</span>
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

export default Hero;