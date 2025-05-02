import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useQuery } from 'react-query';
import { FaBars, FaTimes, FaSearch, FaChevronDown, FaPhone, FaEnvelope } from 'react-icons/fa';

// API service imports
import { fetchMainNavigation, fetchLanguages } from '@/services/api';

// Component imports
import LanguageSwitcher from './LanguageSwitcher';
import SearchBox from './SearchBox';
import MegaMenu from './MegaMenu';
import SocialIcons from './SocialIcons';

/**
 * MainNavigation component displaying the top bar, logo, and main navigation menu
 */
const MainNavigation = () => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const currentLanguage = i18n.language;
  
  // State for mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State for search bar toggle
  const [searchOpen, setSearchOpen] = useState(false);
  
  // State to track if header is sticky (for styling changes)
  const [isSticky, setIsSticky] = useState(false);
  
  // State to track active mega menu
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  
  // Ref for dropdown handling
  const dropdownRef = useRef(null);
  
  // Fetch main navigation structure
  const { data: navigationData } = useQuery(
    ['mainNavigation', currentLanguage],
    () => fetchMainNavigation(currentLanguage),
    { staleTime: 1000 * 60 * 60 } // Cache for 1 hour
  );
  
  // Fetch available languages
  const { data: languagesData } = useQuery(
    'languages',
    fetchLanguages,
    { staleTime: Infinity } // Doesn't change often, can be cached indefinitely
  );
  
  // Handle scroll events for sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveMegaMenu(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [router.asPath]);
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (searchOpen) setSearchOpen(false);
  };
  
  // Toggle search bar
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };
  
  // Handle mega menu toggle
  const handleMegaMenuToggle = (menuId) => {
    if (activeMegaMenu === menuId) {
      setActiveMegaMenu(null);
    } else {
      setActiveMegaMenu(menuId);
    }
  };
  
  // Format contact info data
  const contactInfo = {
    phone: navigationData?.contact?.phone || '+1-234-567-8900',
    email: navigationData?.contact?.email || 'contact@govagency.gov'
  };
  
  // Navigation menu items
  const menuItems = navigationData?.menu_items || [];
  
  // Check if the route is active
  const isLinkActive = (href) => {
    // Handle index page
    if (href === '/') {
      return router.pathname === '/';
    }
    
    // Handle other pages
    return router.pathname.startsWith(href);
  };
  
  return (
    <header className={`w-full ${isSticky ? 'sticky top-0 shadow-md z-50 animate-slideDown' : ''}`}>
      {/* Top Bar */}
      <div className="bg-primary-900 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Contact Information */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <FaPhone className="mr-2" />
              <span className="hidden sm:inline">{contactInfo.phone}</span>
            </div>
            <div className="hidden md:flex items-center">
              <FaEnvelope className="mr-2" />
              <span>{contactInfo.email}</span>
            </div>
          </div>
          
          {/* Social Media Icons & Language Switcher */}
          <div className="flex items-center space-x-4">
            <SocialIcons 
              socialLinks={navigationData?.social_links} 
              className="hidden sm:flex space-x-3" 
            />
            
            <LanguageSwitcher 
              languages={languagesData} 
              currentLanguage={currentLanguage} 
            />
          </div>
        </div>
      </div>
      
      {/* Main Navigation */}
      <div className="bg-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" locale={currentLanguage}>
              <a className="flex items-center">
                <img 
                  src="/img-proxy-1.webp" 
                  alt="Government Agency Logo" 
                  className="h-16"
                />
                <div className="ml-3 hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-800">
                    {t('agencyName')}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {t('agencyTagline')}
                  </p>
                </div>
              </a>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex" ref={dropdownRef}>
              <ul className="flex space-x-6">
                {menuItems.map((item) => (
                  <li key={item.id} className="relative group">
                    {/* If this item has children, make it a dropdown trigger */}
                    {item.children && item.children.length > 0 ? (
                      <>
                        <button 
                          className={`flex items-center px-1 py-2 font-medium ${
                            isLinkActive(item.url) ? 'text-primary-600' : 'text-gray-800'
                          } hover:text-primary-600 focus:outline-none transition-colors duration-300`}
                          onClick={() => handleMegaMenuToggle(item.id)}
                          aria-expanded={activeMegaMenu === item.id}
                        >
                          {item.label}
                          <FaChevronDown className="ml-1 text-xs" />
                        </button>
                        
                        {/* Mega Menu */}
                        {activeMegaMenu === item.id && (
                          <MegaMenu 
                            items={item.children} 
                            parentUrl={item.url}
                          />
                        )}
                      </>
                    ) : (
                      // Regular Link
                      <Link href={item.url} locale={currentLanguage}>
                        <a 
                          className={`block px-1 py-2 font-medium hover:text-primary-600 border-b-2 transition-colors duration-300 ${
                            isLinkActive(item.url) 
                              ? 'text-primary-600 border-primary-600' 
                              : 'text-gray-800 border-transparent'
                          }`}
                        >
                          {item.label}
                        </a>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* Search and Mobile Menu Buttons */}
            <div className="flex items-center space-x-4">
              {/* Search Toggle Button */}
              <button 
                onClick={toggleSearch}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors duration-300"
                aria-label={t('search')}
              >
                <FaSearch />
              </button>
              
              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors duration-300"
                onClick={toggleMobileMenu}
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? t('closeMenu') : t('openMenu')}
              >
                {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
          
          {/* Search Bar - Expanded when active */}
          <div className={`mt-4 ${searchOpen ? 'block' : 'hidden'}`}>
            <SearchBox 
              onSearch={(term) => {
                router.push(`/search?q=${encodeURIComponent(term)}`);
                setSearchOpen(false);
              }} 
              placeholder={t('searchPlaceholder')}
            />
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div className={`lg:hidden bg-white shadow-lg transform transition-transform duration-300 ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      } fixed top-0 right-0 w-4/5 h-full z-50 overflow-y-auto`}>
        {/* Mobile Menu Header */}
        <div className="flex justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">{t('navigation')}</h2>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
            aria-label={t('closeMenu')}
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        {/* Mobile Menu Items */}
        <nav className="p-4">
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li key={item.id} className="border-b border-gray-100 pb-3">
                {item.children && item.children.length > 0 ? (
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer list-none">
                      <span className="font-medium text-gray-800">{item.label}</span>
                      <FaChevronDown className="text-gray-600 group-open:rotate-180 transition-transform duration-300" />
                    </summary>
                    <ul className="pl-4 mt-2 space-y-2">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <Link href={`${item.url}${child.url}`} locale={currentLanguage}>
                            <a className="block py-1 text-gray-700 hover:text-primary-600">
                              {child.label}
                            </a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <Link href={item.url} locale={currentLanguage}>
                    <a className={`block font-medium ${
                      isLinkActive(item.url) ? 'text-primary-600' : 'text-gray-800'
                    }`}>
                      {item.label}
                    </a>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Mobile Contact & Language */}
        <div className="p-4 mt-4 border-t border-gray-200">
          <div className="space-y-4">
            {/* Contact Information */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">{t('contactUs')}</h3>
              <div className="flex items-center space-x-2 text-gray-700">
                <FaPhone />
                <span>{contactInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <FaEnvelope />
                <span>{contactInfo.email}</span>
              </div>
            </div>
            
            {/* Language Switcher for Mobile */}
            <div className="mt-4">
              <h3 className="font-semibold text-gray-800 mb-2">{t('language')}</h3>
              <div className="flex flex-wrap gap-2">
                {languagesData?.map((lang) => (
                  <Link 
                    href={router.asPath} 
                    locale={lang.code}
                    key={lang.code}
                  >
                    <a className={`px-3 py-1 rounded text-sm ${
                      currentLanguage === lang.code 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {lang.name}
                    </a>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Mobile Social Icons */}
            <div className="mt-4">
              <h3 className="font-semibold text-gray-800 mb-2">{t('followUs')}</h3>
              <SocialIcons 
                socialLinks={navigationData?.social_links} 
                className="flex space-x-4" 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default MainNavigation;