import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Service } from '@shared/schema';

const QuickAccess: React.FC = () => {
  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ['/api/services'],
    staleTime: 60 * 60 * 1000, // 1 hour
  });
  
  if (isLoading) {
    return (
      <section className="bg-white py-12 -mt-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-center mb-8">Quick Access Services</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse flex flex-col items-center p-4 rounded-lg">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section className="bg-white py-12 -mt-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-center mb-4">Quick Access Services</h2>
            <p className="text-center text-red-500">Error loading services. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }
  
  // Take only the first 4 services
  const quickAccessServices = services?.slice(0, 4);
  
  return (
    <section className="bg-white py-12 -mt-8 relative z-10">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Quick Access Services</h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {quickAccessServices?.map((service) => (
              <Link 
                key={service.id} 
                to={`/services/${service.slug}`} 
                className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                <div className="w-16 h-16 flex items-center justify-center bg-primary-100 text-primary-700 rounded-full mb-4">
                  <i className={`fas ${service.icon || 'fa-check'} text-2xl`}></i>
                </div>
                <h3 className="font-medium text-lg mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickAccess;
