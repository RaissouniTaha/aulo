import React from 'react';
import { Routes, Route, Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Service } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoaderPinwheel } from 'lucide-react';

// Service details component
const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: service, isLoading, error } = useQuery<Service>({
    queryKey: [`/api/services/${slug}`],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoaderPinwheel className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Service</h2>
        <p className="text-gray-600">There was a problem loading this service information.</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Service Not Found</h2>
        <p className="text-gray-600">The requested service could not be found.</p>
        <Link to="/services" className="text-primary hover:underline mt-4 inline-block">
          View All Services
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto">
        <Card className="shadow-md overflow-hidden">
          {service.imageUrl && (
            <div className="h-64 overflow-hidden">
              <img 
                src={service.imageUrl} 
                alt={service.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{service.title}</CardTitle>
            <CardDescription className="text-lg">{service.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: service.content }} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Services list component
const ServicesList: React.FC = () => {
  const { data: services, isLoading, error } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoaderPinwheel className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Services</h2>
        <p className="text-gray-600">There was a problem loading the services information.</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide a comprehensive range of urban planning and development services to support our community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service) => (
            <Card key={service.id} className="overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg">
              {service.imageUrl && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={service.imageUrl} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105" 
                  />
                </div>
              )}
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 flex items-center justify-center bg-primary-100 text-primary rounded-full mx-auto mb-4">
                    <i className={`fas ${service.icon || 'fa-check'} text-2xl`}></i>
                  </div>
                  <h3 className="font-bold text-xl mb-2">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-4 text-center">
                  {service.description}
                </p>
                <div className="text-center">
                  <Link 
                    to={`/services/${service.slug}`} 
                    className="inline-block bg-primary hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-md transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Services component with routes
const Services: React.FC = () => {
  return (
    <div id="main-content">
      <Routes>
        <Route path="/" element={<ServicesList />} />
        <Route path="/:slug" element={<ServiceDetail />} />
      </Routes>
    </div>
  );
};

export default Services;
