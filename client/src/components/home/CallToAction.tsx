import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const CallToAction: React.FC = () => {
  return (
    <section className="relative py-20 bg-gray-900 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1541783261460-ad4e5abe2ce5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
          className="w-full h-full object-cover opacity-20" 
          alt="City skyline" 
        />
      </div>
      
      <div className="relative container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Have Questions About Urban Planning or Permitting?</h2>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
          Our team of experts is ready to assist you with any inquiries regarding urban planning, 
          zoning regulations, or the building permit process.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild className="bg-accent hover:bg-accent-700 text-white font-medium px-8 py-4 rounded-md transition-colors shadow-md">
            <Link to="/contact">
              Contact Us
            </Link>
          </Button>
          <Button asChild variant="outline" className="bg-transparent hover:bg-white hover:bg-opacity-10 text-white border border-white font-medium px-8 py-4 rounded-md transition-colors">
            <Link to="/services">
              Explore Our Services
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
