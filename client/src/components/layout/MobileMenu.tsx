import React from 'react';
import { Link } from 'react-router-dom';
import { X, Phone, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { languages, useLanguage, useTranslation } from '@/lib/i18n';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  
  return (
    <div className={`lg:hidden bg-white shadow-lg transform transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    } fixed top-0 right-0 w-4/5 h-full z-50 overflow-y-auto`}>
      {/* Mobile Menu Header */}
      <div className="flex justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">{t('navigation')}</h2>
        <Button 
          onClick={onClose}
          variant="ghost"
          size="icon"
          aria-label={t('header.closeMenu')}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Mobile Menu Items */}
      <nav className="p-4">
        <ul className="space-y-4">
          <li className="border-b border-gray-100 pb-3">
            <Link to="/" className="block font-medium text-primary" onClick={onClose}>
              {t('nav.home')}
            </Link>
          </li>
          <li className="border-b border-gray-100 pb-3">
            <Accordion type="single" collapsible>
              <AccordionItem value="about">
                <AccordionTrigger className="font-medium text-gray-800">{t('nav.about')}</AccordionTrigger>
                <AccordionContent>
                  <ul className="pl-4 mt-2 space-y-2">
                    <li>
                      <Link to="/about/mission" className="block py-1 text-gray-700 hover:text-primary" onClick={onClose}>
                        {t('about.mission')}
                      </Link>
                    </li>
                    <li>
                      <Link to="/about/leadership" className="block py-1 text-gray-700 hover:text-primary" onClick={onClose}>
                        {t('about.leadership')}
                      </Link>
                    </li>
                    <li>
                      <Link to="/about/history" className="block py-1 text-gray-700 hover:text-primary" onClick={onClose}>
                        {t('about.history')}
                      </Link>
                    </li>
                    <li>
                      <Link to="/about/reports" className="block py-1 text-gray-700 hover:text-primary" onClick={onClose}>
                        {t('about.reports')}
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
                <AccordionTrigger className="font-medium text-gray-800">{t('nav.services')}</AccordionTrigger>
                <AccordionContent>
                  <ul className="pl-4 mt-2 space-y-2">
                    <li>
                      <Link to="/services/permits" className="block py-1 text-gray-700 hover:text-primary" onClick={onClose}>
                        {t('services.permits')}
                      </Link>
                    </li>
                    <li>
                      <Link to="/services/zoning" className="block py-1 text-gray-700 hover:text-primary" onClick={onClose}>
                        {t('services.zoning')}
                      </Link>
                    </li>
                    <li>
                      <Link to="/services/planning" className="block py-1 text-gray-700 hover:text-primary" onClick={onClose}>
                        {t('services.planning')}
                      </Link>
                    </li>
                    <li>
                      <Link to="/services/inspection" className="block py-1 text-gray-700 hover:text-primary" onClick={onClose}>
                        {t('services.inspection')}
                      </Link>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </li>
          <li className="border-b border-gray-100 pb-3">
            <Link to="/maps" className="block font-medium text-gray-800 hover:text-primary" onClick={onClose}>
              {t('nav.maps')}
            </Link>
          </li>
          <li className="border-b border-gray-100 pb-3">
            <Link to="/documents" className="block font-medium text-gray-800 hover:text-primary" onClick={onClose}>
              {t('nav.documents')}
            </Link>
          </li>
          <li className="border-b border-gray-100 pb-3">
            <Link to="/news" className="block font-medium text-gray-800 hover:text-primary" onClick={onClose}>
              {t('nav.news')}
            </Link>
          </li>
          <li className="border-b border-gray-100 pb-3">
            <Link to="/contact" className="block font-medium text-gray-800 hover:text-primary" onClick={onClose}>
              {t('nav.contact')}
            </Link>
          </li>
        </ul>
      </nav>
      
      {/* Mobile Contact & Language */}
      <div className="p-4 mt-4 border-t border-gray-200">
        <div className="space-y-4">
          {/* Contact Information */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">{t('header.contactUs')}</h3>
            <div className="flex items-center space-x-2 text-gray-700">
              <Phone className="h-4 w-4" />
              <span>{t('footer.phoneNumber')}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <Mail className="h-4 w-4" />
              <span>{t('footer.email')}</span>
            </div>
          </div>
          
          {/* Language Switcher for Mobile */}
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">{t('header.language')}</h3>
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
