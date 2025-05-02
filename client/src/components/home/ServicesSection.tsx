import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ArrowRight } from 'lucide-react';
import { Service } from '@shared/schema';

const ServicesSection: React.FC = () => {
  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ['/api/services'],
    staleTime: 60 * 60 * 1000, // 1 hour
  });
  
  // Display only 3 featured services
  const featuredServices = services?.slice(0, 3);
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-primary">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We offer a comprehensive range of services to support urban development, community planning, and regulatory compliance.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeleton
            Array(3).fill(null).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </CardContent>
              </Card>
            ))
          ) : error ? (
            <div className="col-span-3 text-center text-red-500">
              Error loading services. Please try again later.
            </div>
          ) : (
            featuredServices?.map((service) => (
              <Card key={service.id} className="overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={service.imageUrl} 
                    className="w-full h-full object-cover transition-transform hover:scale-105" 
                    alt={service.title} 
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <Link to={`/services/${service.slug}`} className="text-primary hover:text-primary-800 font-medium inline-flex items-center">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        <div className="text-center mt-10">
          <Button asChild className="bg-primary hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-md transition-colors shadow-md">
            <Link to="/services">
              View All Services
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
