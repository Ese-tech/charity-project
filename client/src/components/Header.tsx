import React, { useState } from 'react';
// import { Button } from './ui/button'; // Button is not directly used in Header's JSX, so we can remove this import
import { Search, Menu, X, User } from 'lucide-react';
import { mockData } from './mock';
import DonationModal from './DonationModal';

// Define an interface for menu items to give 'item' a type
interface MenuItem {
  name: string;
  href: string;
  highlighted?: boolean;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [donationModal, setDonationModal] = useState<{ isOpen: boolean; type: 'general' | 'disaster' | 'sponsor' }>({
  isOpen: false,
  type: 'general',
});

  const handleSearch = (e: React.FormEvent) => { // Added type for 'e'
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // In a real app, this would trigger a search results page or component
    alert(`Searching for: ${searchQuery}`); // Consider replacing alert() with a custom modal/toast
  };

  const handleMenuClick = (item: MenuItem) => { // Added type for 'item'
    console.log(`Navigating to: ${item.name}`);
    if (item.name === 'Donate') {
      setDonationModal({ isOpen: true, type: 'general' });
    } else if (item.name === 'Sponsor a Child') {
      setDonationModal({ isOpen: true, type: 'sponsor' });
    } else {
      // In a real app, use react-router-dom's navigate for internal links
      alert(`Navigating to ${item.name} page...`); // Consider replacing alert()
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex justify-between items-center py-2 text-sm border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors">
              <User className="w-4 h-4" />
              <span>My World Vision</span>
            </button>
          </div>
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-10 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Main navigation */}
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 transform rotate-45"></div>
              <span className="text-2xl font-bold text-gray-900">World Vision</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {mockData.navigation.menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuClick(item)}
                className={`font-medium transition-colors ${
                  item.highlighted
                    ? 'text-orange-500 hover:text-orange-600'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4">
            <nav className="flex flex-col space-y-4">
              {mockData.navigation.menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleMenuClick(item)}
                  className={`text-left font-medium transition-colors py-2 ${
                    item.highlighted
                      ? 'text-orange-500 hover:text-orange-600'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
      <DonationModal 
        isOpen={donationModal.isOpen}
        onClose={() => setDonationModal({ isOpen: false, type: 'general' })}
        type={donationModal.type}
      />
    </header>
  );
};

export default Header;