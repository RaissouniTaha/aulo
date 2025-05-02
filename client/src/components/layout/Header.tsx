import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Phone, Mail, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import SearchBox from './SearchBox';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenu from './MobileMenu';
import logoSvg from '@/assets/icons/logo.svg';

const Header: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  // Handle scroll events for sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

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

  // Check if route is active
  const isLinkActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className={`w-full border-b border-gray-200 ${isSticky ? 'sticky top-0 shadow-md z-50 animate-slideDown' : ''}`}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-primary focus:text-white focus:z-50">
        Skip to main content
      </a>
      
      {/* Top Bar */}
      <div className="bg-primary text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Contact Information */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline text-sm">+1-234-567-8900</span>
            </div>
            <div className="hidden md:flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              <span className="text-sm">contact@govagency.gov</span>
            </div>
          </div>
          
          {/* Social Media Icons & Language Switcher */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex space-x-3">
              <a href="#" aria-label="Facebook" className="text-white hover:text-accent-200 transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" aria-label="Twitter" className="text-white hover:text-accent-200 transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" aria-label="YouTube" className="text-white hover:text-accent-200 transition-colors">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
            
            <LanguageSwitcher />
          </div>
        </div>
      </div>
      
      {/* Main Navigation */}
      <div className="bg-background py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="h-12 w-12 flex items-center justify-center mr-3">
                <img src={logoSvg} alt="Government Agency Logo" className="h-12 w-12" />
              </div>
              <div className="ml-3 hidden sm:block">
                <h1 className="text-xl font-bold text-gray-800">
                  Government Agency
                </h1>
                <p className="text-sm text-gray-600">
                  Urban Planning Authority
                </p>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList className="flex space-x-6">
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink className={`px-1 py-2 font-medium hover:text-primary border-b-2 transition-colors duration-300 ${
                      isLinkActive('/') ? 'text-primary border-primary' : 'text-gray-800 border-transparent'
                    }`}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={`font-medium ${isLinkActive('/about') ? 'text-primary' : 'text-gray-800'}`}>
                    About Us
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="font-medium text-primary">About Our Agency</h3>
                    </div>
                    <div className="p-2 w-64">
                      <Link to="/about/mission" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                        Our Mission & Vision
                      </Link>
                      <Link to="/about/leadership" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                        Leadership
                      </Link>
                      <Link to="/about/history" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                        History
                      </Link>
                      <Link to="/about/reports" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                        Annual Reports
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={`font-medium ${isLinkActive('/services') ? 'text-primary' : 'text-gray-800'}`}>
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="font-medium text-primary">Our Services</h3>
                    </div>
                    <div className="p-2 w-64">
                      <Link to="/services/permits" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                        Building Permits
                      </Link>
                      <Link to="/services/zoning" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                        Zoning Information
                      </Link>
                      <Link to="/services/planning" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                        Urban Planning
                      </Link>
                      <Link to="/services/inspection" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                        Inspection Services
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/maps">
                    <NavigationMenuLink className={`px-1 py-2 font-medium hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors duration-300 ${
                      isLinkActive('/maps') ? 'text-primary border-primary' : 'text-gray-800'
                    }`}>
                      Maps
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/documents">
                    <NavigationMenuLink className={`px-1 py-2 font-medium hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors duration-300 ${
                      isLinkActive('/documents') ? 'text-primary border-primary' : 'text-gray-800'
                    }`}>
                      Documents
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/news">
                    <NavigationMenuLink className={`px-1 py-2 font-medium hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors duration-300 ${
                      isLinkActive('/news') ? 'text-primary border-primary' : 'text-gray-800'
                    }`}>
                      News
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/contact">
                    <NavigationMenuLink className={`px-1 py-2 font-medium hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors duration-300 ${
                      isLinkActive('/contact') ? 'text-primary border-primary' : 'text-gray-800'
                    }`}>
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            {/* Search and Mobile Menu Buttons */}
            <div className="flex items-center space-x-4">
              {/* Search Toggle Button */}
              <Button 
                onClick={toggleSearch}
                variant="ghost"
                size="icon"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
              
              {/* Mobile Menu Button */}
              <Button
                className="lg:hidden"
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          
          {/* Search Bar - Expanded when active */}
          {searchOpen && (
            <div className="mt-4">
              <SearchBox 
                onSearch={(term) => {
                  console.log("Searching for:", term);
                  setSearchOpen(false);
                }}
                placeholder="Search for services, documents, or information..."
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
};

export default Header;
