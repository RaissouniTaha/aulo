import React from 'react';
import { Link } from 'react-router-dom';
import { X, Phone, Mail, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { languages, useLanguage } from '@/lib/i18n';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { language, changeLanguage } = useLanguage();
  
  return (
    <div className={`lg:hidden bg-white shadow-lg transform transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    } fixed top-0 right-0 w-4/5 h-full z-50 overflow-y-auto`}>
      {/* Mobile Menu Header */}
      <div className="flex justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Navigation</h2>
        <Button 
          onClick={onClose}
          variant="ghost"
          size="icon"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Mobile Menu Items */}
      <nav className="p-4">
        <ul className="space-y-4">
          <li className="border-b border-gray-100 pb-3">
            <Link to="/" className="block font-medium text-primary" onClick={onClose}>
              Home
            </Link>
          </li>
          <li className="border-b border-gray-100 pb-3">
            <Accordion type="single" collapsible>
              <AccordionItem value="about">
                <AccordionTrigger className="font-medium text-gray-800">About Us</AccordionTrigger>
                <AccordionContent>
                  <ul className="pl-4 mt-2 space-y-2">
                    <li>
                      <Link to="/about/mission" className="block py-1 text-gray-700 hover:text-primary" onClick={onClose}>
                        Our Mission & Vision
                      </Link>
                    </li>
                    <li>
                      <Link to="/about/leadership" className="block py-1 text-gray-700 hover:text-primary" onClick={onClose}>
                        Leadership
                      </Link>
                    </li>
                    <li>
                      <Link to="/about/history" className="block py-1 text-gray-700 hover:text-primary" onClick={onClose}>
                        History
                      </Link>
                    </li>
                    <li>
                      <Link to="/about/reports" className="block py-1 text-gray-700 hover:text-primary" onClick={onClose}>
                        Annual Reports
                      </Link>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </li>
          <li className="border-b border-gray-100 pb-3">
            <Accordion type="single" collapsible>
              <AccordionItem value="services">
                <AccordionTrigger className="font-medium text-gray-800">Services</AccordionTrigger>
                <AccordionContent>
                  <ul className="pl-4 mt-2 space-y-2">
                    <li>
                      <Link to="/services/permits" className="block py-1 text-gray-700 hover:text-primary" onClick={onClose}>
                        Building Permits
                      </Link>
                    </li>
                    <li>
                      <Link to="/services/zoning" className="block py-1 text-gray-700 hover:text-primary" onClick={onClose}>
                        Zoning Information
                      </Link>
                    </li>
                    <li>
                      <Link to="/services/planning" className="block py-1 text-gray-700 hover:text-primary" onClick={onClose}>
                        Urban Planning
                      </Link>
                    </li>
                    <li>
                      <Link to="/services/inspection" className="block py-1 text-gray-700 hover:text-primary" onClick={onClose}>
                        Inspection Services
                      </Link>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </li>
          <li className="border-b border-gray-100 pb-3">
            <Link to="/maps" className="block font-medium text-gray-800 hover:text-primary" onClick={onClose}>
              Maps
            </Link>
          </li>
          <li className="border-b border-gray-100 pb-3">
            <Link to="/documents" className="block font-medium text-gray-800 hover:text-primary" onClick={onClose}>
              Documents
            </Link>
          </li>
          <li className="border-b border-gray-100 pb-3">
            <Link to="/news" className="block font-medium text-gray-800 hover:text-primary" onClick={onClose}>
              News
            </Link>
          </li>
          <li className="border-b border-gray-100 pb-3">
            <Link to="/contact" className="block font-medium text-gray-800 hover:text-primary" onClick={onClose}>
              Contact
            </Link>
          </li>
        </ul>
      </nav>
      
      {/* Mobile Contact & Language */}
      <div className="p-4 mt-4 border-t border-gray-200">
        <div className="space-y-4">
          {/* Contact Information */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">Contact Us</h3>
            <div className="flex items-center space-x-2 text-gray-700">
              <Phone className="h-4 w-4" />
              <span>+1-234-567-8900</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Mail className="h-4 w-4" />
              <span>contact@govagency.gov</span>
            </div>
          </div>
          
          {/* Language Switcher for Mobile */}
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Language</h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  variant={language.code === lang.code ? "default" : "outline"}
                  className={language.code === lang.code ? "bg-primary text-white" : "bg-gray-200 text-gray-800"}
                >
                  {lang.nativeName}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
