import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, type LucideProps } from 'lucide-react'; // Import LucideProps
import { mockData } from './mock';
import { apiService } from '../services/api'; // Ensure apiService is imported

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState<string>(''); // State for newsletter email

  const handleLinkClick = (linkName: string) => { // Explicitly type linkName as string
    console.log(`Footer link clicked: ${linkName}`);
    // In a real application, you'd use react-router-dom's navigate here
    // For now, we'll keep the alert for demonstration, but it should be replaced
    alert(`Navigating to ${linkName}...`);
  };

  const handleSocialClick = (platform: string) => { // Explicitly type platform as string
    console.log(`Social media clicked: ${platform}`);
    // For now, we'll keep the alert for demonstration, but it should be replaced
    alert(`Opening ${platform} page...`);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => { // Explicitly type e as React.FormEvent
    e.preventDefault();
    console.log(`Newsletter signup: ${newsletterEmail}`);

    if (!newsletterEmail) {
      alert('Please enter your email address to subscribe.'); // Consider replacing alert()
      return;
    }

    try {
      // Call the backend API service to subscribe
      const result = await apiService.newsletter.subscribe({ email: newsletterEmail });
      console.log('Newsletter subscription successful:', result);
      alert(`Thank you for subscribing with ${newsletterEmail}!`); // Consider replacing alert()
      setNewsletterEmail(''); // Clear the input field on success
    } catch (error) {
      console.error('Newsletter subscription failed:', error);
      // More robust error handling would be needed here (e.g., toast notification)
      alert('Subscription failed. Please try again.'); // Consider replacing alert()
    }
  };

  const getSocialIcon = (iconName: string) => { // Explicitly type iconName as string
    // Define a Record type for icons to allow indexing with string keys
    const icons: Record<string, React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>> = {
      facebook: Facebook,
      twitter: Twitter,
      instagram: Instagram,
      youtube: Youtube
    };
    const Icon = icons[iconName]; // Now TypeScript knows icons[iconName] will be a component or undefined
    return Icon ? <Icon className="w-5 h-5" /> : null;
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-orange-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Stay Connected with Our Mission
            </h3>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Get the latest updates on our impact and stories from the communities you're helping to transform.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                value={newsletterEmail} // Bind input value to state
                onChange={(e) => setNewsletterEmail(e.target.value)} // Update state on change
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="bg-white text-orange-500 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Organization Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-orange-500 transform rotate-45"></div>
                <span className="text-2xl font-bold">World Vision</span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {mockData.footer.mission}
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-300">1-888-511-6548</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-300">info@worldvision.org</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <span className="text-gray-300">Federal Way, WA</span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {mockData.footer.sections.map((section, index) => (
              <div key={index}>
                <h4 className="text-lg font-semibold mb-4 text-orange-500">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <button
                        onClick={() => handleLinkClick(link)}
                        className="text-gray-300 hover:text-white transition-colors duration-300 text-left"
                      >
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              {mockData.footer.copyright}
            </div>
            
            {/* Social Media Icons */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm mr-2">Follow us:</span>
              {mockData.footer.socialMedia.map((social, index) => (
                <button
                  key={index}
                  onClick={() => handleSocialClick(social.name)}
                  className="text-gray-400 hover:text-orange-500 transition-colors duration-300 p-2 hover:bg-gray-700 rounded-full"
                  aria-label={`Follow us on ${social.name}`}
                >
                  {getSocialIcon(social.icon)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Additional Legal Links */}
          <div className="mt-4 pt-4 border-t border-gray-700 flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-400">
            <button onClick={() => handleLinkClick('Privacy Policy')} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => handleLinkClick('Terms of Service')} className="hover:text-white transition-colors">
              Terms of Service
            </button>
            <button onClick={() => handleLinkClick('Cookie Policy')} className="hover:text-white transition-colors">
              Cookie Policy
            </button>
            <button onClick={() => handleLinkClick('Accessibility')} className="hover:text-white transition-colors">
              Accessibility
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;