import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logoSvg from '@/assets/icons/logo.svg';

const Footer: React.FC = () => {
  const [email, setEmail] = React.useState('');
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribing email:", email);
    setEmail('');
  };
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-6">Government Agency</h3>
            <div className="flex items-center mb-4">
              <img src={logoSvg} alt="Government Agency Logo" className="h-8 w-8 mr-2" />
              <span className="text-lg">Urban Planning</span>
            </div>
            <p className="mb-4 text-gray-300">
              Official website of the Urban Planning Authority, responsible for guiding the physical development of communities.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-300 hover:text-white transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-300 hover:text-white transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" aria-label="YouTube" className="text-gray-300 hover:text-white transition-colors">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-300 hover:text-white transition-colors">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/maps" className="text-gray-300 hover:text-white transition-colors">Maps</Link></li>
              <li><Link to="/documents" className="text-gray-300 hover:text-white transition-colors">Documents</Link></li>
              <li><Link to="/news" className="text-gray-300 hover:text-white transition-colors">News</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6">Contact Us</h3>
            <address className="not-italic">
              <p className="flex items-start mb-3">
                <MapPin className="h-5 w-5 mt-1 mr-3 text-primary-400" />
                <span className="text-gray-300">123 Government St.<br/>Capital City, ST 12345</span>
              </p>
              <p className="flex items-center mb-3">
                <Phone className="h-5 w-5 mr-3 text-primary-400" />
                <span className="text-gray-300">+1-234-567-8900</span>
              </p>
              <p className="flex items-center mb-3">
                <Mail className="h-5 w-5 mr-3 text-primary-400" />
                <span className="text-gray-300">contact@govagency.gov</span>
              </p>
              <p className="flex items-center">
                <Clock className="h-5 w-5 mr-3 text-primary-400" />
                <span className="text-gray-300">Mon-Fri: 8:00 AM - 5:00 PM</span>
              </p>
            </address>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6">Newsletter</h3>
            <p className="mb-4 text-gray-300">
              Subscribe to receive updates on urban planning projects, events, and regulatory changes.
            </p>
            <form className="mb-4" onSubmit={handleSubscribe}>
              <div className="flex">
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-4 py-2 rounded-l-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-r-md transition-colors">
                  <i className="fas fa-paper-plane"></i>
                </Button>
              </div>
            </form>
            <p className="text-sm text-gray-400">
              By subscribing, you agree to our <Link to="/privacy" className="text-primary-400 hover:text-primary-300">Privacy Policy</Link>.
            </p>
          </div>
        </div>
        
        <hr className="border-gray-800 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Government Agency. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Use</Link>
            <Link to="/accessibility" className="text-gray-400 hover:text-white text-sm transition-colors">Accessibility</Link>
            <Link to="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
