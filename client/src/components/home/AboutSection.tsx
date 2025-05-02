import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold mb-6 text-primary">About Our Agency</h2>
            <p className="text-lg mb-6 text-gray-700">
              The Urban Planning Authority is responsible for guiding the physical development of communities, 
              ensuring orderly growth and environmentally sound land use through planning, regulation, and 
              community engagement.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 flex items-center justify-center bg-accent-100 text-accent rounded-full">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-lg">Strategic Urban Vision</h3>
                  <p className="text-gray-600">Creating sustainable development plans for future urban growth</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 flex items-center justify-center bg-accent-100 text-accent rounded-full">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-lg">Regulatory Oversight</h3>
                  <p className="text-gray-600">Enforcing zoning laws and building codes for community safety</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 flex items-center justify-center bg-accent-100 text-accent rounded-full">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-lg">Community Engagement</h3>
                  <p className="text-gray-600">Involving citizens in the planning process to create inclusive cities</p>
                </div>
              </div>
            </div>
            
            <Button asChild className="bg-primary hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-md transition-colors shadow-md">
              <Link to="/about">
                Learn More About Us
              </Link>
            </Button>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1571867424488-4565932edb41?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                className="rounded-lg shadow-xl w-full h-auto object-cover" 
                alt="Urban planners reviewing city plans" 
              />
              
              <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
                <span className="text-3xl font-bold text-primary">35+</span>
                <span className="text-sm text-gray-600">Years of service</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
